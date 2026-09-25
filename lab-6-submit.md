# Lab 6 — Into the Database — Submission Packet

**Live URL:** https://kroeung.vercel.app
**Repo:** https://github.com/Reach488/Vibe-coding-Khmer-preserve-
**Supabase project:** Khmer-preserve (`ap-southeast-1`), ACTIVE_HEALTHY

---

## STILL TO DO (only you can do these)

1. **Eyeball the live site.** Home, `/browse`, one entry page, both languages,
   both themes. Everything below was verified from the server and the API; the
   one thing a terminal cannot check is whether it *looks* the same.
2. **Phone test on mobile data.** Browse, search, log in, log out.
3. **Confirm the owner account.** Every row is owned by
   `57631f4a-b195-4522-93af-91e94f2eb3e2` (makdine@gmail.com), chosen because
   it is the real address of the three and was created minutes after the Lab 5
   client setup. To move them: `update entries set owner = '<other-uuid>';`
4. Submit the URL + the three write-ups at the bottom of this file.

---

# Part 0 — Preflight

- Supabase project awake — `ACTIVE_HEALTHY`, no Restore needed.
- `git status` clean at start, `npm run build` clean.
- Lab 5 finished: login, signup, session, logout all live. No catch-up needed.

---

# Part 1 — The worksheet becomes SQL

Table created with the four policies in the same run, before any data existed.
The full statement is in `supabase/schema.sql`.

### What the generic schema assumed, and what had to be tailored

**1. That `id uuid primary key` was the whole identity.** It is not. Sprint 1's
entries were keyed by a readable string — `prahok`, `tnot-skor` — and that
string is in every URL the archive has: `/browse/prahok`. Taking the generic
answer would have turned every entry link into a 36-character uuid and broken
any link anyone had already saved. Added:

```sql
slug text not null unique check (slug ~ '^[a-z0-9-]+$')
```

The uuid is the database's business. The slug is the archive's.

**2. That camelCase field names survive the trip into Postgres.** They do not —
unquoted identifiers fold to lowercase, so `khmerTerm` would have needed
double-quoting in every statement forever. Columns are snake_case, and one
function in `lib/archive.js` maps them back to the names the components have
spoken since Sprint 1. That single mapping is the reason `EntryCard`,
`BrowseExplorer` and the entry page were not touched at all.

**3. That `varchar(n)` is a reasonable default for text.** It is not, for this
archive. No character budget guessed in English is right for Khmer at the same
time. Every text column is `text`.

**4. That `status` should be constrained now.** Tempting — `check (status in
(...))` — but Sprint 3 designs submit-review-publish, and the other states do
not exist yet. Inventing them here is building ahead. `status` defaults to
`'published'` and carries no constraint yet.

### The policies

Pasted exactly as given. Read is open because Feature 1 is "browse and search"
for everyone. Write is owner-only, three policies, no edit form in sight —
the point being that the missing Edit button is politeness and the policy is
the lock.

---

# Part 2 — The entries move in

Generated the inserts from `lib/entries.js` with a script rather than by hand,
so the quote-escaping is mechanical rather than hopeful. Output kept at
`supabase/seed.sql`.

### Read before running

- Khmer intact in all ten (`ប្រហុក`, `គ្រឿង`, `ស្ករត្នោត`, `ត្រីងៀត`, `ផ្អក`,
  `សាច់គោងៀត`, `ឆៃប៉ូវ`, `ស្ពៃជ្រក់`, `ត្រីឆ្អើរ`, `ខ្វាគោ`) — not transliterated,
  not escaped into entities.
- Em dashes and curly apostrophes intact; `It's` correctly doubled to `It''s`.
- Photo paths exactly as they are in `public/images/`.
- `source_credit` null where the data file had null — four entries — rather
  than silently becoming an empty string.

### Verified after running

Pulled all ten rows back **through the public REST endpoint with the
publishable key** — which tests the `select` policy from outside at the same
time — and diffed every field against the data file:

```
status 200 rows 10
MATCH: all 10 rows identical to the data file, in file order
```

### The ordering problem nobody mentioned

The cutover task says "newest first". Run literally against rows inserted in
file order, that **reverses the archive** — prahok falls from first to last,
and "nothing a visitor sees should change" is broken on the first page load.

Fixed at seed time rather than in the query: the ten entries carry descending
`created_at` values, so `order by created_at desc` reproduces exactly the order
the file had. `created_at` in this table means curatorial position, and it is
commented as such in the schema. A new entry lands on top, which is what an
archive's front page should do anyway.

---

# Part 3 — The cutover

New module `lib/archive.js` is the only thing in the project that talks to the
database. It exports `fetchEntries()`, `fetchEntry(slug)` and `rowToEntry()`.
Two hooks wrap it, `useEntries` and `useEntry`, mirroring the existing
`useSession` pattern. No component builds a query; no component sees a raw row.

`select` names its columns rather than using `*` — `*` would ship `owner`, an
account id, into every visitor's browser. The read policy permits that. There
is still no reason to do it.

### Three things the task description missed

**1. It named "the home page and search" — but three pages read the file.**
`/browse/[id]` did too. Deleting `lib/entries.js` after doing only what was
asked would have broken every entry page in the archive. It was moved over in
the same commit, which is also why the delete commit is safe to stand alone.

**2. "Handle the loading case" is not just a message — the scroll reveals
break.** `components/Reveal.js` swept the document once on mount, found every
`[data-reveal-group] > *`, and observed them. The six homepage cards now arrive
*after* that sweep, from a query. The CSS hides reveal targets until the
observer reveals them, so cards the observer never saw would have stayed
invisible **permanently** — a blank homepage that builds clean, passes
`npm run build`, and fails only in a real browser. Reveal now keeps a
`MutationObserver` on the document and claims new targets as they appear.

This is the reading's "does the code assume the file is there?" question with
the word *network* substituted, and it is the one that would actually have
shipped.

**3. Nothing said what to do about the count.** The archive strip prints
"10 entries". Rendered during loading it would say "0 entries" for a beat, then
correct itself. The count is now omitted until there is a real number.

### The three states

`components/ArchiveNotice.js`, one quiet line each, both languages,
`role="status"` so a screen reader is told the archive arrived:

| state | line |
|---|---|
| loading | Loading the archive… / កំពុងផ្ទុកបណ្ណសារ… |
| empty | The archive has no entries yet. / បណ្ណសារមិនទាន់មានធាតុនៅឡើយទេ។ |
| error | The archive could not be reached. Refresh the page, or try again in a moment. |

No skeleton cards and no spinner: this site has neither anywhere else, and a
grid of pulsing grey boxes would be a *louder* change to an editorial archive
than one sentence.

On `/browse/[id]` the "no such entry" case is kept distinct from the "query
failed" case. A 404 is only raised when the database answered and said there is
no such slug. The archive going quiet does not mean prahok stopped existing.

### Packages

None added. `@supabase/supabase-js` and `@supabase/ssr` were already the two
approved for Sprint 2, and they did the whole job. No Prisma, no Drizzle.

### Commits

```
5365834 Round out the Khmer no-results line
d227317 Tell the agents where the archive lives now
4402a3e sprint 2: retire the data file, entries live in supabase
cf6c762 Read the archive from Supabase instead of the data file
```

The retirement is its own commit, after the cutover was verified, exactly as
the lab asks — one revert puts the file back without touching the database.

---

# Part 4 — Verify like an attacker

Run logged out, against the live project, with the real publishable key.

### Write attempt — refused

```
INSERT -> 401 {"code":"42501","message":"new row violates row-level
               security policy for table \"entries\""}
```

Valid key, refused anyway. The key was never the lock.

### Delete and update attempts — and a result worth reading carefully

```
DELETE -> 204
UPDATE -> 204
```

`204` looks like success and is not. For `update` and `delete`, RLS `using`
filters rows *out of visibility* rather than raising an error, so the statement
matched zero rows and changed nothing. Confirmed immediately after:

```
STILL THERE -> [{"slug":"prahok","title":"Prahok"}]
count -> 10 rows, 1 owner, prahok_title "Prahok"
```

Worth knowing: an attacker script reading only status codes would report those
two as wins. The database says otherwise.

### Public read — still works

`select` over REST with no session returned all ten rows, 200. Feature 1 got no
worse for a logged-out visitor, which is the Sprint 2 promise.

### Key search — clean

| searched for | hits in tracked files |
|---|---|
| publishable key | **0** |
| project ref `zyagffedggxyyalatuwn` | **0** |
| owner uuid | 1 — `supabase/seed.sql` |
| any `.env*` file tracked | none |

The uuid in retired seed SQL is an account id, not a secret. Keys are keys.

---

# Part 5 — Ship

Pushed to `main`. Vercel built automatically —
`dpl_3j8SGwMGhtpxjZb1MC1cT5iVXdDn`, state `READY`, aliased to
`kroeung.vercel.app`. Env vars unchanged since week 5 and the build proves
they resolved.

Live check, all `200`: `/`, `/browse`, `/browse/prahok`, `/history`, `/login`,
`/signup`. The served homepage HTML now contains **no** `/browse/<slug>` links —
proof the entries are no longer compiled into the page and are coming from the
database instead.

---

# DRAFT — assignment submission text

> The ten entries moved out of `lib/entries.js` into a Supabase Postgres table
> behind row-level security (anyone reads, only the owner writes), and the
> home, search and entry pages now query it. The AI assumed "newest first" was
> harmless, but rows seeded in file order would have come back reversed,
> dropping prahok from the top of the archive to the bottom. I seeded
> `created_at` in descending order so the query reproduces the curated order.

---

# DRAFT — Week 6 discussion post (part 2)

**The assumption:** the cutover code assumed the archive is *present at first
paint*. Not that the query would succeed — I handled that — but that the DOM
would be complete when the page's other JavaScript ran.

My homepage has scroll-reveal animations. `components/Reveal.js` sweeps the
document once on mount, finds every reveal target, and hands them to an
`IntersectionObserver`; CSS keeps those targets hidden until the observer
reveals them. With the entries in a file, that was airtight — the six cards
were compiled into the page and were there before the sweep.

With the entries in a database, the cards arrive *after* the sweep. The
observer never sees them. The CSS keeps hiding them. Forever. A permanently
blank homepage that compiles clean, builds clean, and fails only in a real
browser.

**What I did:** Reveal now keeps a `MutationObserver` on the document and
claims new targets as they appear, with a `WeakSet` so it does not re-observe
what it already handed over.

**Why did the AI assume it?** Because the prompt said "update the home page and
search so they read entries from Supabase", and it did exactly that. It changed
*where the data comes from*. It had no reason to reason about what *else* on the
page depended on the data having already been there — nothing in the prompt
mentioned scroll reveals, and Reveal.js is a different file that was not part of
the task. Osmani's "a very educated guess at a solution; the tailoring is your
job" (p. 99) is usually read as "check the code it wrote". This was the other
half: check the code it *didn't* write, and ask what you just broke underneath
it. Swapping a file for a network changes the timing of everything on the page,
and only someone who knows the whole page can see that.

---

# DRAFT — prompt journal entry

**Best prompt of the day** — the insert generation, because what came back
was correct and still not right:

> Read my entries data file and generate Postgres INSERT statements for the
> entries table, one per entry, mapping the fields to my columns. Set owner to
> `<uuid>` on every row. Output SQL only. Do not modify any file.

**What came back:** correct SQL. Khmer intact, apostrophes doubled, nulls where
the file had nulls.

**What I changed before accepting:** the timestamps. The cutover query orders
`created_at desc`, and rows inserted in file order with `now()` on every one
would have come back in whatever order the database felt like — or, with
distinct ascending timestamps, exactly backwards. Prahok would have dropped
from the top of the archive to the bottom, on a lab whose one visual rule is
that nothing a visitor sees changes. I set `created_at` explicitly, descending,
so "newest first" reproduces the curatorial order the file had, and I commented
the column in the schema so the next person knows that column means *position*,
not *upload time*.

**The lesson:** `ORDER BY` is not a detail you add at the end. It is a decision
about what the archive's order *means*, and the data has to be seeded to carry
it. Nothing in the generated SQL was wrong — it just answered a question I had
not finished asking.

---

# Known / deferred

- **`components/PhotoLoop.js` is dead code.** It takes an `entries` prop and is
  imported by nothing. Left alone — out of scope for this lab — but it should
  go, or find a use, in week 7.
- **The entry page is client-rendered now,** so entry prose is no longer in the
  server HTML. Acceptable for this sprint; the approved client is the browser
  one. If SEO on entry pages matters later, a server-side read is the fix.
- **No cache between pages.** Navigating home → browse re-queries. Ten rows, so
  it does not matter yet. It will when the archive is a hundred.
- **`status` is stored but not filtered on.** Everything is `'published'` today.
  Week 7's review flow is where `where status = 'published'` earns its place.
