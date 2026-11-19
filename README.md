# St. Baldrick's 2027 Tracker (Vercel)

Files (all must be in the repo, with `api/` at the top level, next to `index.html`):

```
index.html        the website
package.json
api/_lib.js       shared helpers
api/data.js       reads/saves shared progress and notes, checks the login
api/health.js     open /api/health to check the backend
```

## Deploy
1. **GitHub:** create a repo and upload everything above (keep the `api` folder).
2. **Vercel:** Add New → Project → import the repo → Deploy.
3. **Database:** in the Vercel project open **Storage** → create / connect **Upstash for Redis** (free plan) → connect it to the project.
4. **Redeploy:** Deployments → ⋯ → Redeploy (needed so the database variables load).
5. **Check:** open `https://YOUR-SITE.vercel.app/api/health`. You want `"ok": true`.

## Login
Works immediately with username `TKE` and password `Baldricks`. To change them, add Vercel environment variables `TEAM_USER` and `TEAM_PASS` (set both), then redeploy. If your GitHub repo is public, change the password this way, because the defaults are visible in `api/_lib.js`.
