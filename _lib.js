// Shared helpers for the API (files starting with _ are not exposed as endpoints).
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// If TEAM_USER / TEAM_PASS are not set in Vercel, these defaults are used so login works out of the box.
const USER = String(process.env.TEAM_USER || "TKE").trim().toLowerCase();
const PASS = String(process.env.TEAM_PASS || "Baldricks").trim();

function redisConfigured() { return !!(URL_ && TOKEN); }

async function redis(cmd) {
  if (!redisConfigured()) throw new Error("redis not configured");
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const d = await r.json();
  if (!r.ok || d.error) throw new Error(d.error || "redis http " + r.status);
  return d.result;
}

function authorized(b) {
  return !!b && String(b.user || "").trim().toLowerCase() === USER && String(b.pass || "").trim() === PASS;
}

function parseBody(req) {
  let b = req.body || {};
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b;
}

module.exports = { redis, redisConfigured, authorized, parseBody, usingDefaults: !(process.env.TEAM_USER && process.env.TEAM_PASS) };
