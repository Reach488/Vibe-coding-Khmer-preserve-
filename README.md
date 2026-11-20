# Khmer Traditional Pastes & Preserves

**Live site:** https://kroeung.vercel.app
**Repo:** https://github.com/Reach488/Vibe-coding-Khmer-preserve-

Built by Sitheareach Phann for ICT 340 at AUPP, August to November 2026.

## 1. About the archive

A living archive of Cambodia's traditional pastes and preserves: prahok,
kroeung, tnot skor, trey ngeat, phaok and more. Each entry records how the
food is made, what it is used for, and how recipes vary by family and region.

Before refrigerators, Khmer households kept food by salting, fermenting and
sun-drying it. That knowledge was passed on by hand, not written down. This
archive writes it down, starting with my grandmother's, and lets other people
add their own family's version.

The archive's name, description, curator and source live in one place,
`collection.config.js`. Pages read them from there.

## 2. The collection

Every entry has a Khmer name in Khmer script, a photo, and a source credit
shown on the entry page. The founding entries:

| Entry | Khmer | Source |
|---|---|---|
| Prahok | ប្រហុក | grantourismotravels.com, figaroshakes.com, morethantemples.com |
| Kroeung | គ្រឿង | en.wikipedia.org/wiki/Kroeung, chefnak.com |
| Tnot Skor | ស្ករត្នោត | fondazioneslowfood.com, tasteatlas.com, cambodianess.com |
| Trey Ngeat | ត្រីងៀត | My grandmother |
| Phaok | ផ្អក | My grandmother |
| Sach Ko Ngeat | សាច់គោងៀត | My grandmother |
| Chaipov | ឆៃប៉ូវ | My grandmother |
| Spey Jruk | ស្ពៃជ្រក់ | My grandmother |
| Trey Chaar | ត្រីឆ្អើរ | My grandmother |
| Kwa Ko | ខ្វាគោ | My grandmother |
| Traditional Khmer Fish Sauce | ទឹកត្រី | Grandmother (added through the contribute form and published through review) |
| Salted Duck Eggs | ពងទាប្រៃ | My grandmother (added through the contribute form and published through review) |

Contributors add more. A new entry appears here only after a reviewer
publishes it. Photos for the first ten are in `public/images/`; photos for
contributed entries are in Supabase Storage.

## 3. Who can do what

| Who | What |
|---|---|
| Anyone (logged out) | Browse the archive, search in English or Khmer, read an entry, switch language and light/dark theme. Sees published entries only. |
| Contributor (signed in) | Add an entry with a photo. Edit or delete their own entries, and only their own. See every entry they added, with its status and any reviewer note, under **My entries**. |
| Reviewer | Open **Review**, see every waiting entry oldest first, and publish it or return it with a note. |
| Admin | Edit or delete any entry, to clean up. An admin's edit still goes back to review unless the admin is also a reviewer. |

My own account is the reviewer and the admin. Both lists live in database
tables (`reviewers`, `admins`) that only the Supabase SQL Editor can change;
nobody can sign up into either role.

Sign-up and login use email and password (8 characters or more) with an
hCaptcha check. A failed login or signup gives the same plain message either
way, so the form never reveals whether an email has an account
(`lib/authCopy.js`).

## 4. How an entry gets published (the gate)

1. A contributor adds an entry. It is saved as **Waiting for review** and does
   not appear on the public archive.
2. A reviewer publishes it, or returns it with a note.
3. A returned entry shows the note in **My entries**, with a link to edit it.
   Saving the edit sends it back to the queue.
4. Editing a published entry also sends it back to review, and off the public
   archive until it is approved again. The edit page warns about this before
   saving. A reviewer's own edit stays published.

**The database enforces this, not the buttons.** Hiding a button is manners;
the policy is the lock. Anyone can skip the page and call Supabase from the
browser console with the public key, so every rule is in Postgres
(`supabase/gate.sql`):

- **Read:** anyone sees published entries. An owner also sees their own
  waiting or returned ones, and a reviewer sees everything.
- **Add:** only as yourself (`owner` must be your login), and only as
  `pending`.
- **Edit:** only your own rows (or any row, for an admin), and the result
  must be `pending` unless you are a reviewer. An entry's owner, slug, id and
  creation date can never be changed.
- **Delete:** only your own rows (or any row, for an admin).
- **Publish / return:** only through one database function, `review_entry`.
  It refuses anyone not on the `reviewers` table, which the API can neither
  read nor write, and it only touches entries that are still pending.
- **Photos:** a photo must be one the writer uploaded into their own folder.
  It can't point at another server, and an approved photo can't be swapped
  in storage afterwards (`photo_lock.sql`, `photo_swap.sql`).

Tested as a stranger account, run in the database and rolled back
(2026-11-20): adding an entry as `published` is refused (`42501`); updating
their own pending entry to `published` is refused (`42501`); calling
`review_entry` on their own entry returns `false`; editing, deleting or taking
over someone else's entry changes 0 rows. Logged out, the API returns only
published entries and no review notes.

**What the gate doesn't cover yet:**

- I am the only reviewer, so I review my own entries. `review_entry` doesn't
  refuse self-approval, because that would block all of mine. Fixing it needs
  a second reviewer.
- A contributor can write the `review_note` column on their own entry. Only
  they see it, and publishing clears it. Fixing it needs column-level grants.
- `is_reviewer()` can be called logged out. The read policy needs it, so it
  stays (see the note at the end of `gate.sql`).

## 5. Khmer throughout

- The whole interface switches between English and ខ្មែរ: menus, forms, every
  validation and photo error, status words, empty states (`components/T.js`,
  `lib/lang.js`).
- In Khmer, entry cards and entry pages lead with the Khmer name. Entry text
  stays in the language it was written in, and the page says so instead of
  pretending to translate it.
- Numbers next to Khmer text are Khmer digits: the browse count, form limits
  (`toKhmerDigits` in `lib/lang.js`).
- Search finds Khmer as well as English. It ignores spaces and zero-width
  characters, because Khmer is written without spaces between words, so
  "សាច់គោ ងៀត" still finds សាច់គោងៀត (`lib/search.js`).
- The form requires the Khmer name to be in Khmer script, and the database
  counts lengths by character so Khmer text isn't cut short.
- Khmer is set in Kantumruy Pro (`app/layout.js`).
- Every page works on a 390px phone screen with no sideways scroll, and inputs
  are at least 16px so iPhones don't zoom in when you type.

## 6. How it's built

- Next.js 15 (App Router), React 19, plain JavaScript. No TypeScript, no CSS
  framework, no component library.
- Supabase: Postgres for entries, Storage for photos, Auth for accounts.
- Hosted on Vercel, which redeploys on every push to `main`.
- Dependencies: `next`, `react`, `react-dom`, `@supabase/supabase-js`,
  `@supabase/ssr`. Nothing else.

**Where things are**

| Path | What |
|---|---|
| `collection.config.js` | The archive's name, description, curator and source |
| `app/` | Pages: home, `browse`, `browse/[id]`, `browse/[id]/edit`, `contribute`, `my-entries`, `review`, `login`, `signup`, `history` |
| `components/` | One component per file |
| `lib/archive.js` | The only module that talks to the database. Components get plain data. |
| `lib/entryRules.js` | The form's validation rules; the same rules are in `supabase/constraints.sql` |
| `lib/search.js` | Search, shared by typing and the Search button |
| `middleware.js` | Refreshes the login cookie before `/review`, the one page that checks Supabase on the server |
| `supabase/` | All the SQL: tables, constraints, policies, functions, storage. Run by hand in the Supabase SQL Editor, in this order: `schema`, `seed`, `storage`, `constraints`, `hardening`, `admin`, `advisor_fixes`, `gate`, `photo_lock`, `photo_swap`, `review_note` |

The app never builds SQL out of strings; supabase-js sends every query with
parameters.

**How AI was used.** I built this with AI coding assistants, mostly Claude in
Claude Code. AI-assisted commits say so, with `(AI-assisted)` in the subject
or an `AI-assisted commit.` line in the body. Some early Sprint 1 commits
were AI-assisted but aren't marked. The rules the AI worked under are in
`AGENTS.md`. Every change was tested on the live site or in the database
before it was kept.

## 7. Running it locally

```bash
npm install
npm run dev
```

It needs a `.env.local` with these three values. Never commit it; `.gitignore`
already excludes it.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
```

Then open http://localhost:3000. The same three values are set in Vercel's
environment variables for the live site. No secret key is used anywhere: the
publishable key is public by design, and row-level security does the guarding.

## 8. Submission checklist

- [x] Live URL loads: https://kroeung.vercel.app
- [x] Supabase project is active, not paused (checked 2026-11-20; check again before submitting)
- [x] Logged out, browse and search show published entries only
- [x] A contributor's new entry waits for review and isn't public
- [x] A reviewer can publish or return it from **Review**
- [x] A returned entry shows its note; editing it resends it for review
- [x] A contributor sees Edit and Delete only on their own entries
- [x] A stranger can't publish their own entry through the page or the console
- [x] Khmer works end to end: interface, search, entry names, errors, digits
- [x] Every entry is real and credits its source
- [x] Works at phone width (390px)
- [x] Instructor is a collaborator on the repo
- [x] No keys, tokens or passwords anywhere in the history
- [x] AI-assisted commits are marked
- [x] README has all eight sections
- [x] Reflection pasted in the Canvas text box under the links
- [x] Demo video recorded, unlisted, plays in a private window, submitted in *Demo Video*
