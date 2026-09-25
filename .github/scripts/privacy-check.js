#!/usr/bin/env node
// .github/scripts/privacy-check.js
//
// Reads bob-output.json, posts/updates a PR comment with a findings table,
// ships the scan to the dashboard, and exits 1 if any high-severity leak was found.
//
// Runtime: Node 24 – uses only built-in modules (fs, path) and built-in fetch.
// All secrets arrive via environment variables; none are printed.

"use strict";

const fs = require("fs");

// ─── Environment ────────────────────────────────────────────────────────────

const {
  GITHUB_TOKEN,
  WORKER_URL,
  SCAN_TOKEN,
  REPO,
  PR_NUMBER,
  PR_TITLE,
  HEAD_SHA,
  HEAD_REF,
} = process.env;

const GITHUB_API = "https://api.github.com";
// Hidden HTML marker so we can find and update our own comment.
const COMMENT_MARKER = "<!-- source-to-sink -->";

// ─── Entry point ─────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});

async function main() {
  // 1. Parse Bob's output ────────────────────────────────────────────────────
  const { bobResult, findings, parseError } = loadBobOutput();

  if (parseError) {
    await postErrorComment(parseError);
    process.exit(1);
  }

  console.log(`Parsed ${findings.length} finding(s).`);

  // 2. Determine overall status ──────────────────────────────────────────────
  const status = findings.some((f) => f.severity === "high") ? "blocked" : "passed";
  console.log(`Privacy check status: ${status}`);

  // 3. Send scan to dashboard (optional – never blocks the PR check) ─────────
  const dashboardResult = await sendToDashboard(bobResult, findings);

  // 4. Post / update PR comment ──────────────────────────────────────────────
  const comment = buildComment(status, findings, bobResult.stats, dashboardResult);
  await upsertPrComment(comment);

  // 5. Exit code drives the GitHub check ────────────────────────────────────
  if (status === "blocked") {
    console.log("Exiting 1 – high-severity findings detected.");
    process.exit(1);
  }
  console.log("Exiting 0 – no high-severity findings.");
  process.exit(0);
}

// ─── 1. Load and parse Bob's output ──────────────────────────────────────────

function loadBobOutput() {
  // Read the file
  let raw;
  try {
    raw = fs.readFileSync("bob-output.json", "utf8");
  } catch {
    return { parseError: "bob-output.json was not created – Bob may have failed to start." };
  }

  // Parse the outer envelope
  let envelope;
  try {
    envelope = JSON.parse(raw);
  } catch {
    return { parseError: "bob-output.json is not valid JSON." };
  }

  if (envelope.status !== "success") {
    const reason = envelope.error || envelope.status || "unknown status";
    return { parseError: `Bob did not complete successfully (status: ${reason}).` };
  }

  // Extract the findings JSON embedded in last_message.
  // last_message is a plain string that may start with prose before the JSON.
  // We look for {"findings" or { "findings" (with optional space).
  const msg = envelope.last_message || "";
  const start = msg.search(/\{\s*"findings"/);
  if (start === -1) {
    return { parseError: "Bob's output did not contain a findings JSON block." };
  }

  // Take everything from that start to the last } in the string.
  const jsonSlice = msg.slice(start, msg.lastIndexOf("}") + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch {
    return { parseError: "Could not parse the findings JSON block from Bob's output." };
  }

  if (!Array.isArray(parsed.findings)) {
    return { parseError: "Findings block is not an array." };
  }

  // Validate and clean findings – drop anything missing required fields.
  const VALID_SEVERITIES = new Set(["high", "medium", "low"]);
  const findings = parsed.findings.filter((f) => {
    if (!f.field || !f.sink) return false;
    if (!VALID_SEVERITIES.has((f.severity || "").toLowerCase())) return false;
    // Normalise severity casing
    f.severity = f.severity.toLowerCase();
    return true;
  });

  return { bobResult: envelope, findings };
}

// ─── 2. Dashboard upload ──────────────────────────────────────────────────────

async function sendToDashboard(bobResult, findings) {
  if (!WORKER_URL || !SCAN_TOKEN) {
    console.log("WORKER_URL or SCAN_TOKEN not set – skipping dashboard upload.");
    return null;
  }

  const stats = bobResult.stats || {};
  const body = {
    repo: REPO,
    pr: Number(PR_NUMBER),
    prTitle: PR_TITLE,
    headSha: HEAD_SHA,
    findings,
    stats: {
      cost: stats.session_costs,
      durationMs: stats.duration_ms,
    },
  };

  try {
    const res = await fetch(`${WORKER_URL}/api/scans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SCAN_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`Dashboard upload failed: HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    console.log(`Scan saved as ${data.id}`);
    return data; // { id, status }
  } catch (err) {
    console.warn("Dashboard upload error (non-fatal):", err.message);
    return null;
  }
}

// ─── 3. Build PR comment ──────────────────────────────────────────────────────

function buildComment(status, findings, stats, dashboardResult) {
  const lines = [];

  // Hidden marker so we can find this comment again on the next push.
  lines.push(COMMENT_MARKER);
  lines.push("");

  // Title
  if (status === "blocked") {
    lines.push("### 🔴 Privacy check: blocked");
  } else {
    lines.push("### 🟢 Privacy check: passed");
  }
  lines.push("");

  // Summary sentence
  if (findings.length > 0) {
    lines.push(`Bob found **${findings.length}** unsafe data flow(s).`);
  } else {
    lines.push("No sensitive data reaches logs, third parties or API responses in this PR.");
  }
  lines.push("");

  // Findings table
  if (findings.length > 0) {
    // Sort: high → medium → low
    const ORDER = { high: 0, medium: 1, low: 2 };
    const sorted = [...findings].sort(
      (a, b) => ORDER[a.severity] - ORDER[b.severity]
    );

    lines.push("| Severity | Data | Goes to | Where |");
    lines.push("|----------|------|---------|-------|");

    for (const f of sorted) {
      const sev = severityEmoji(f.severity);
      const data = escPipe(f.field || "");
      const sink = escPipe(`${f.sink}${f.sinkType ? ` (${f.sinkType})` : ""}`);
      const where = escPipe(f.file ? `${f.file}${f.line ? `:${f.line}` : ""}` : "");
      lines.push(`| ${sev} | ${data} | ${sink} | ${where} |`);
    }
    lines.push("");

    // Suggested fixes – de-duplicate identical fix texts
    const fixGroups = groupFixes(findings);
    if (fixGroups.length > 0) {
      lines.push("#### Suggested fixes");
      lines.push("");
      for (const { fix, fields } of fixGroups) {
        const fieldList = fields.map((f) => `\`${f}\``).join(", ");
        lines.push(`**${fieldList}** – ${fix}`);
        lines.push("");
      }
    }

    // "How to fix with Bob" – only when blocked
    if (status === "blocked") {
      lines.push("#### How to fix with Bob");
      lines.push("");
      lines.push(`1. \`git checkout ${HEAD_REF}\``);
      lines.push("2. `bob chat --mode privacy-fixer`");
      lines.push(
        "3. Paste this comment and ask Bob to fix the leaks, then review the change and push. This check re-runs automatically."
      );
      lines.push("");
    }
  }

  // Dashboard link (only when the upload succeeded)
  if (dashboardResult && dashboardResult.id && WORKER_URL) {
    lines.push(`[View on dashboard: ${WORKER_URL}/#/scans/${dashboardResult.id}](${WORKER_URL}/#/scans/${dashboardResult.id})`);
    lines.push("");
  }

  // Footer
  const cost =
    stats && stats.session_costs != null
      ? `$${Number(stats.session_costs).toFixed(4)}`
      : "n/a";
  const secs =
    stats && stats.duration_ms != null
      ? `${(stats.duration_ms / 1000).toFixed(1)}s`
      : "n/a";
  lines.push(`---`);
  lines.push(`_Reviewed by IBM Bob (Privacy Reviewer mode). Cost: ${cost}, time: ${secs}._`);

  return lines.join("\n");
}

/** Group findings by identical fix text; returns [{ fix, fields }] */
function groupFixes(findings) {
  const map = new Map(); // fix text → Set of field names
  for (const f of findings) {
    if (!f.fix) continue;
    if (!map.has(f.fix)) map.set(f.fix, new Set());
    if (f.field) map.get(f.fix).add(f.field);
  }
  return Array.from(map.entries()).map(([fix, fields]) => ({
    fix,
    fields: Array.from(fields),
  }));
}

/** Emoji label for a severity level */
function severityEmoji(sev) {
  switch (sev) {
    case "high":   return "🔴 High";
    case "medium": return "🟡 Medium";
    default:       return "⚪ Low";
  }
}

/** Escape pipe characters in Markdown table cells */
function escPipe(str) {
  return String(str).replace(/\|/g, "\\|");
}

// ─── 4. GitHub API helpers ────────────────────────────────────────────────────

/** List all comments on the PR */
async function listPrComments() {
  const url = `${GITHUB_API}/repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100`;
  const res = await githubFetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`Failed to list PR comments: HTTP ${res.status}`);
  return res.json();
}

/** Create a new PR comment */
async function createPrComment(body) {
  const url = `${GITHUB_API}/repos/${REPO}/issues/${PR_NUMBER}/comments`;
  const res = await githubFetch(url, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`Failed to create PR comment: HTTP ${res.status}`);
  return res.json();
}

/** Update an existing PR comment */
async function updatePrComment(commentId, body) {
  const url = `${GITHUB_API}/repos/${REPO}/issues/comments/${commentId}`;
  const res = await githubFetch(url, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(`Failed to update PR comment: HTTP ${res.status}`);
  return res.json();
}

/** Shared fetch wrapper that injects auth and JSON content-type headers */
function githubFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

/**
 * Post a new comment or PATCH the existing one that contains COMMENT_MARKER.
 * This keeps the PR timeline clean across multiple pushes.
 */
async function upsertPrComment(body) {
  const comments = await listPrComments();
  const existing = comments.find((c) => c.body && c.body.includes(COMMENT_MARKER));

  if (existing) {
    console.log(`Updating existing PR comment #${existing.id}`);
    await updatePrComment(existing.id, body);
  } else {
    console.log("Creating new PR comment.");
    await createPrComment(body);
  }
}

// ─── Error comment helper ─────────────────────────────────────────────────────

/** Post an error comment when Bob failed and we have no findings. */
async function postErrorComment(reason) {
  console.error(`Privacy check could not complete: ${reason}`);
  const body = [
    COMMENT_MARKER,
    "",
    "### ⚠️ Privacy check: could not complete",
    "",
    `The privacy scan did not produce results. **Reason:** ${reason}`,
    "",
    "Please check the [workflow logs](" +
      `https://github.com/${REPO}/actions) for details.`,
    "",
    "_Reviewed by IBM Bob (Privacy Reviewer mode)._",
  ].join("\n");

  try {
    await upsertPrComment(body);
  } catch (err) {
    // If we can't even post the error comment, log and move on – we still exit 1.
    console.error("Could not post error comment:", err.message);
  }
}
