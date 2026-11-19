// Open /api/health in a browser to check the backend. No secrets are shown.
const { redis, redisConfigured, usingDefaults } = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const out = { api: true, databaseConfigured: redisConfigured(), databaseReachable: false, usingDefaultLogin: usingDefaults };
  if (out.databaseConfigured) {
    try { await redis(["PING"]); out.databaseReachable = true; } catch (e) { out.databaseError = String(e.message).slice(0, 120); }
  }
  out.ok = out.api && out.databaseReachable;
  out.hint = out.ok ? "Everything works." : !out.databaseConfigured
    ? "No database connected. In Vercel: Storage → Upstash Redis → connect to this project, then Redeploy."
    : "Database is connected but not answering. Check the Upstash database is active.";
  res.status(200).json(out);
};
