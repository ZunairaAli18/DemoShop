// Stand-in for a real logger that ships logs to a third-party service
// (e.g. Datadog, Loggly). Anything logged here should be treated as leaving the company.
const log = {
  info(msg, meta = {}) {
    console.log(JSON.stringify({ level: "info", msg, ...meta }));
  },
  error(msg, meta = {}) {
    console.error(JSON.stringify({ level: "error", msg, ...meta }));
  },
};

module.exports = { log };
