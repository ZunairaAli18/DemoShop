// Sends events to an external CRM (a third-party API).
async function sendToCrm(event, payload) {
  const url = process.env.CRM_URL;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, payload }),
  });
}

module.exports = { sendToCrm };
