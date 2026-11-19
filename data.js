// GET = read shared state + notes (public). POST = login / save state / add note (needs team login).
const { redis, authorized, parseBody } = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      let s, n;
      try {
        [s, n] = await Promise.all([redis(["GET", "sb_state"]), redis(["GET", "sb_notes"])]);
      } catch (e) {
        return res.status(500).json({ error: "database" });
      }
      return res.status(200).json({ state: s ? JSON.parse(s) : null, notes: n ? JSON.parse(n) : [] });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "method" });

    const b = parseBody(req);
    if (!authorized(b)) return res.status(401).json({ error: "unauthorized" });
    if (b.action === "login") return res.status(200).json({ ok: true });

    if (b.action === "state") {
      const json = JSON.stringify(b.state || {});
      if (json.length > 50000) return res.status(413).json({ error: "too large" });
      await redis(["SET", "sb_state", json]);
      return res.status(200).json({ ok: true });
    }

    if (b.action === "note") {
      const n = b.note || {};
      let list = JSON.parse((await redis(["GET", "sb_notes"])) || "[]");
      list.unshift({
        title: String(n.title || "Meeting").slice(0, 120),
        text: String(n.text || "").slice(0, 20000),
        summary: String(n.summary || "").slice(0, 5000),
        by: String(n.by || "").slice(0, 60),
        ts: Date.now(),
      });
      await redis(["SET", "sb_notes", JSON.stringify(list.slice(0, 50))]);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "bad action" });
  } catch (e) {
    return res.status(500).json({ error: "server" });
  }
};
