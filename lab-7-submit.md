# Lab 7 — The Doors Open — Submission Packet

**Live URL:** https://kroeung.vercel.app
**Repo:** https://github.com/Reach488/Vibe-coding-Khmer-preserve-
**Deployment:** `dpl_8Wq8t9Knus4mGxji49jERkacF8QT`, `READY`, commit `bb08eaf`
**Supabase project:** Khmer-preserve (`ap-southeast-1`), ACTIVE_HEALTHY
**Due:** Sunday Oct 4, 11:59 PM — Lab 7 URL, week 7 discussion post, week 7 process log

---

## STILL TO DO (only you can do these)

1. **Part 4 had no human partner.** Claude (the AI assistant) played the
   stranger: it created demo accounts on the live site, ran the lab's console
   attacks, and deleted the accounts afterwards. The submission and the
   discussion post say so. If a classmate can still attack your site before
   Sunday, that is better; ask them to tell you what they saw.
2. **Add one real entry** (your own Khmer text and a real photo) on the live
   site. The whole add / edit / delete cycle has been driven in a real browser
   (below), but with throwaway text and generated images.
3. **Delete one leftover test photo** in Dashboard → Storage → `photos`:
   `98a81a70-85fc-453d-b161-fc1959fa1527/07557624-5903-4169-b2e0-0b506027bae6.png`.
4. Submit the text at the bottom, post the discussion (`lab-7-discussion.md`),
   and upload `progress-lab-7.md` as the process log. All three say the attacker
   was Claude. The assignment says documented blockers earn full
   participation, and a missing human partner is one.
5. Add one real Chruok entry. As of the last check the archive still has only
   your original 10 entries.

---

## The assignment's checklist

| item | status | evidence |
|---|---|---|
| `photos` bucket + storage policies (Part 0) | **Done** | Had never been run. Bucket: public, 5 MB, JPEG/PNG/WebP. Two policies from the guide, plus a SELECT policy added after testing (see Part 2). `supabase/storage.sql`, `supabase/hardening.sql` |
| Contribution form with Tuesday's rules | **Done, browser-tested on the live site** | `/contribute`, `lib/entryRules.js`. Empty submit, 5,000-char title, PDF/6 MB refused, Khmer saved and displayed exactly |
| Owner set from the session | **Done, tested** | `sessionUser()` → `auth.getUser()`. Insert with someone else's id: refused by RLS |
| Edit/Delete only on your own entries | **Done, browser-tested** | Owner sees both; a second account sees neither and gets "only the owner" on `/edit`. Manners; the policies are the lock |
| Updates and deletes checked for a returned row | **Done, tested** | Both `.select()` and throw on zero rows. Tested through the real functions |
| Part 3 check constraints running | **Done, tested** | 11 constraints + 1 function. Six bad inserts refused; a 500-character title refused on update |
| Partner's console attack refused on live URL | **Done, but the attacker was Claude, not a classmate** | Demo stranger accounts ran the lab's commands in a browser console on the live site: update and delete `data: []`, `.txt` refused, entry unchanged (Part 4) |

---

# Part 0 — Before Friday

- Supabase awake, `ACTIVE_HEALTHY`. Lab 6 cutover pushed and live.
- **The bucket SQL had not been run.** Found by querying `storage.buckets` and
  `pg_policies`. Ran the guide's block unchanged; recorded in
  `supabase/storage.sql`.
- Read-before-run, as the guide asks: the bucket line is the third layer of the
  upload rules (the database refuses a PDF or a 12 MB file whatever the form
  says); the two policies decide whose folder you can write into; *public* lets
  anyone view a photo by its link and does not let anyone upload.

# Part 1 — The contribution form, with a photo

- `/contribute` is a server component. Signed-out visitors get a login link; the
  form is drawn only for a session (`SignedInOnly`).
- **Rules as data.** `lib/entryRules.js` holds `FIELDS`; the form renders from it
  and validates against it, so a rule is changed in one place. A message sits
  next to each field. Text is trimmed at the ends only, so nothing inside a
  Khmer word moves. Lengths count characters, matching Postgres `char_length`.
- **The photo is checked by its bytes** (`lib/photo.js`): JPEG `FF D8 FF`, PNG
  `89 50 4E 47…`, WebP `RIFF…WEBP`. A PDF renamed `photo.jpg` and an SVG both
  fail. Max 5 MB. The stored extension comes from the sniffed type, never the
  filename.
- Path is `<user id>/<random uuid>.<ext>`. Submit is disabled while the upload
  runs. The new entry's page opens after a save.

### Tuesday's four holes

| hole | answer |
|---|---|
| owner | from `supabase.auth.getUser()`, never a form field |
| the insert | `toRow()` names ten columns; nothing is spread from the form |
| errors | `console.error`, then a fixed sentence. No `error.message` anywhere in `app/`, `components/`, `lib/` |
| the upload | your id + random uuid, not the name it arrived with |

`dangerouslySetInnerHTML`: two hits, both older constant scripts
(`app/layout.js`, `app/page.js`). None in anything written this lab.

Old photos are `/images/…` files in the repo; new ones are full Supabase URLs.
The page renders `<img src={photo}>` for both, with no string-gluing.

**Deviation — no `province`:** the rules file lists it, but the table has no such
column. Adding one is a schema change; it was not made.

# Part 2 — Edit and delete, your own only

- Edit and Delete show only when `user.id === entry.owner`. Edit opens
  `/browse/[id]/edit`: the same `EntryForm`, pre-filled. A new photo is optional;
  without one the `photo` column is left out of the update.
- **Every update and delete calls `.select()` and fails if no row came back**
  ("That change wasn't saved", real error to `console.error`).
- Delete confirms first.
- **Photo cleanup (optional in the guide, done):** deleting an entry removes its
  photo; replacing a photo removes the old one. Both run only after the
  database change is confirmed, and a failure to remove is logged, never shown.
  The old URL is read from the database, not from the form.

### What the testing found

The first version passed review and failed under attack:

1. **`storage.remove()` returned success and removed nothing.** The guide's
   storage policies give INSERT and DELETE but no SELECT, and removal has to see
   an object first. The cleanup code was dead until a SELECT policy for the
   user's own folder was added.
2. **`status: 'featured'` went straight into the table** from a console request.
   Fixed with a check constraint, and `created_at` is now forced by a trigger.

Both are in `supabase/hardening.sql`. The second failure has the same shape as
Lab 6's `204 No Content`: a call that reports success and changes nothing.

# Part 3 — The checklist, top to bottom

`supabase/constraints.sql` — eleven check constraints and `entry_tags_ok()` (a
check cannot hold a subquery, and the per-tag length rule needs one). Ran
clean; none of the ten old rows broke a rule. The story and credit columns are
nullable in the table, so each rule is "null, or in range"; the form still
requires them.

**Constraints, tested from outside the form** — six inserts in a block that never
commits, all refused: 5,000-character title, Latin-only `khmer_term`,
5-character description, nine tags, photo without a note, slug `../admin`.

**The guide's six browser items, run on the live site in headless Chrome:**

- [x] Submit the form empty — 10 messages (9 fields + photo), nothing sent
- [x] Paste a 5,000-character title — "Keep it to 100 characters or fewer (now 5000)", nothing sent
- [x] A PDF, a PDF renamed `.jpg`, and a 6 MB image — all refused by the form
- [x] Real Khmer in every text field, including a 100-character title — saved,
  and title, term and story fields display exactly as typed
- [x] A title of `<script>alert(1)</script>` — `<h1>` text is the literal string,
  zero `<script>` elements inside it, no pop-up on the entry or browse page
- [x] Break something on purpose — network switched off mid-submit: "Your entry
  couldn't be saved. Check your connection and try again." No raw error text, and
  the button comes back (no endless spinner)

# Part 4 — Attack (what I could verify alone)

Run as a second, signed-in account in its own browser profile, **on the live
site, in the browser console, using the guide's own commands** (`createClient`
from jsdelivr, `signInWithPassword`, then update, delete, upload). **There was no
human partner:** Claude played the stranger from demo accounts it created, and
deleted them afterwards.

| attack | pass condition | result |
|---|---|---|
| update someone else's entry | `data: []` | `[]`, entry unchanged |
| delete someone else's entry | `data: []` | `[]`, entry still there |
| upload a `.txt` | error about the file type | `mime type text/plain is not supported` |
| upload into someone else's folder | refused | `new row violates row-level security policy` |
| 6 MB upload | refused | `The object exceeded the maximum allowed size` |
| signed-out upload / insert | refused | RLS violation |
| insert with another user's `owner` | refused | RLS violation |
| delete someone else's photo | not deleted | `remove` returned `[]`, file still served |
| set `status` to `'featured'` | refused | `entries_status_published` — **after** the fix; it was accepted before |
| set `created_at` to 2099 | ignored | trigger returns the real time |
| through the interface: open the owner's entry | no Edit/Delete | none shown; `/edit` says only the owner can edit |
| add an entry titled `<script>alert(1)</script>` | plain text | literal text, no pop-up; deleted by the stranger afterwards |
| refresh their site | entry unchanged | title identical |

### Fourth hole: "photo required" lived only in the form — fixed

The column was nullable, so a direct insert with no photo, or an update setting
it to null, went through. `photo` is now `not null` with a check that rejects an
empty or whitespace-only value (`supabase/hardening.sql`; all ten existing
entries already had a photo). Tested: insert with no photo, `null`, `""` and
`"   "` all refused; update to `null` or blank refused; updates that leave the
photo alone, and the app's real create / update / delete, still work.

### Third hole, found by reading the rules against the table, then fixed

`slug` could be changed by an update from the console, though the rules say a
contributor cannot change it later (it is the entry's address; changing it
breaks every saved link). A trigger in `supabase/hardening.sql` now refuses any
update that changes it (`check_violation`: "An entry's slug cannot be changed").
Tested: the change is refused and the table is unchanged; ordinary updates, and
sending the same slug back, still work; the app's real create / update / delete
still pass.

# Part 5 — Ship

- Pushed to `main`; Vercel built each commit automatically.
- Latest: `dpl_8Wq8t9Knus4mGxji49jERkacF8QT`, `READY`, ~25 s build, aliased to
  `kroeung.vercel.app`.
- Live, all 200: `/`, `/browse`, `/browse/prahok`, `/contribute`,
  `/browse/prahok/edit`, `/login`. The project ref is inlined in the live bundle,
  so the env vars resolved at build time.
- **Add / edit / delete on the live URL, in a real browser: done** (headless
  Chrome, throwaway accounts, all removed afterwards): signed up through the
  real form; added an entry with a 100-character Khmer title; the offline failure
  and retry; edit without a photo (photo kept); edit with a new photo (URL
  changed); a second entry whose Khmer-only title collided on slug (`entry` /
  `entry-0d00ca`); delete with the confirm dismissed (entry kept) and accepted
  (entry and photo gone).
- Storage was checked directly afterwards: every photo from the run was removed;
  only the one old leftover test file remains.

### Commits

```
bb08eaf sprint 2: remove an entry's old photo from storage when it is replaced
e43ef3a sprint 2: remove an entry's photo from storage when the entry is deleted
3c9ab7e sprint 2: lock status and created_at, let contributors remove their own photos
d4b9040 sprint 2: contribution form, photo upload, edit and delete own entries (AI-assisted)
```

The guide asks for two commits, one per part. Parts 1 and 2 share
`lib/archive.js` and were built together.

---

# DRAFT — assignment submission text

This matches the discussion post (`lab-7-discussion.md`). Every result in it
was observed on the live site.

> I had no classmate to swap with, so my AI assistant (Claude) played the
> partner: it signed up on my live site as a stranger and used the lab's console
> commands to try to update one of my entries, delete one, and upload a .txt
> file. All three were refused: the update and delete came back `data: []` and
> my entry was unchanged on refresh, because row-level security only matches
> rows where `owner = auth.uid()`, and the bucket rejected the .txt by file
> type. The same testing found three holes the form had hidden (anyone could set
> `status` from the console, removing a photo silently did nothing, and `slug`
> and `photo` were only protected by the form), which I fixed and re-tested.

---

# DRAFT — prompt journal entry

The full version is in `progress-lab-7.md`. The short one:

**Prompt:** the Part 1 task from the guide, with the rules from
`validation-rules.txt`.

**What came back:** a form that met every line, with no `error.message`, a
random path in the user's own folder, owner from the session, and named columns.

**What I changed before accepting it as finished:** I attacked it instead of
stopping at the diff. A console request set `status: 'featured'`, and
`storage.remove()` reported success after removing nothing. Fixed with a check
constraint plus a trigger, and one storage policy. [If you edited anything
yourself while reviewing the diffs, say that instead — this is the one line that
has to be true.]

**The lesson:** a rule that lives only in the form is a rule for honest people,
and a refusal and a no-op look the same to code that only checks for an error.

---

# Known / deferred

- **Category is free text**, 1–50 characters. The rules file left it `[?]`.
- **The form is English only.** No Khmer labels or messages were written.
- **The `status` check is temporary.** Sprint 3's review flow has to loosen it.
- **The `created_at` trigger** blocks any future seed from choosing its own
  timestamps; drop it first if that is ever needed.
- **Soft 404** on a missing entry still stands from Lab 6 (real not-found page,
  HTTP 200).
- `components/PhotoLoop.js` is still dead code; Lab 5's throwaway accounts still
  exist.
