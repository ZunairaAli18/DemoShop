# Output format

Your ENTIRE final message must be exactly one JSON object and nothing else.

- The first character of your message is `{` and the last character is `}`.
- No preface ("Here are the findings..."), no summary, no notes, no explanation outside the JSON.
- No markdown: no code fences, no headings, no bullet points.
- Any explanation belongs inside the `explanation` and `fix` fields.

The object has this shape:

{
  "findings": [
    {
      "field": "Customer.cnic",
      "sink": "sendToCrm (external POST)",
      "sinkType": "log | third_party | api_response | error_tracker | storage",
      "file": "src/services/notifier.js",
      "line": 12,
      "severity": "high | medium | low",
      "explanation": "one sentence on HOW the data reaches the sink",
      "fix": "one sentence on the smallest safe change"
    }
  ]
}

- One finding per field per sink.
- `sinkType` and `severity` must each be exactly one of the listed values.
- If nothing is found, your entire message is `{"findings": []}`.

## Line numbers

`line` is a line number in the NEW version of `file` (after the diff is applied), counted from 1. It points at the line containing the expression that puts the sensitive data into the sink call, for example the `profile: buildProfile(customer),` argument line, not the line where the call starts.

- If the call and its argument are on the same line, use that line.
- Prefer a line that the diff adds or changes (a `+` line). Only use an unchanged line if no added line carries the data into the sink.
- Work it out from the file itself or the `@@ -a,b +c,d @@` hunk header (new-file lines start at `c`). Never guess.
