# Progress Log — Lab 2 — 2026-09-02

## Summary

Rewrote the five entry descriptions with sharper, food-writer-style
sensory hooks, kept the data schema untouched, verified the change
deployed correctly, and traced a "no changes" report back to the
browser/page the user was checking rather than a bad deploy.

## What was done

1. **Scope check against AGENTS.md** — the ask came in as a full
   "Recipe Card" template (Ingredients, Instructions, Prep/Ferment
   time, Yield, Storage life, Flavor profile, Search tags). None of
   that exists in `lib/entries.js`'s schema
   (`title, khmerTerm, description, category, photo, photoNote,
   sourceCredit, status`), and `AGENTS.md` says "build only what the
   current task asks for; do not build ahead." Flagged the mismatch
   and the missing recipe content (template placeholder was still
   in the request) before writing any code.

2. **Confirmed scope with the user** (`AskUserQuestion`) — asked
   three things: how to source recipe content, whether to add new
   schema fields, whether the homepage needed more work. Answers:
   fit the template to the *current* schema (no new fields), stay
   within current fields, leave the homepage as-is.

3. **Rewrote `lib/entries.js` descriptions** — prahok, kroeung,
   tnot skor, kapi, phaok. Same facts, same fields, punchier
   sensory openers (aroma, texture, umami) instead of flat
   ingredient lists. No changes to `EntryCard.js`, `app/page.js`,
   or any other file.

4. **Verified before shipping** — `npx next build` clean, then
   `git commit` (`c5ced53`) + `git push origin main`.

5. **Diagnosed a "no changes" report** — used the Vercel MCP tools
   to confirm `kroeung.vercel.app` was aliased to the new deployment
   (`dpl_Eu4B...`, commit `c5ced53`, state `READY`), then used
   `WebFetch` on `https://kroeung.vercel.app/browse` to pull the
   live prahok description and confirm the new text was actually
   being served. Deploy was correct; likely causes are browser
   cache or checking `/` (homepage doesn't render per-entry
   descriptions, only category chips) instead of `/browse`.

## Deploy flow used

Same standing rule as Lab 1: verify locally (`next build`) →
commit → `git push origin main` → Vercel auto-deploy → confirm
`READY` and correct commit SHA via Vercel MCP tools before calling
it done.

## Open items

- Still waiting on user confirmation that a hard refresh /
  `/browse` check shows the new descriptions.
- `build_out.txt` still untracked in repo root from a prior
  session — stray build-log output, safe to delete whenever.
- If the course sprint later calls for full recipe fields
  (ingredients, steps, timing), that's a schema + `EntryCard.js`
  change explicitly deferred this session per user's answer.
