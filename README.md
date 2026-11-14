# Khmer Traditional Pastes & Preserves

A living archive of Cambodia's traditional pastes and preserves: prahok, kroeung, tnot skor, trey ngeat, phaok, and more. Each entry records how it is made, what it is used for, and how recipes vary by family and region. Entries are bilingual: every page reads in English or Khmer, and each entry carries its Khmer name.

**Live site:** https://kroeung.vercel.app

Built by Sitheareach Phann for ICT 340 at AUPP. Most of the knowledge comes from my grandmother; entries from other sources credit them on the entry page.

## What you can do

| Who | What |
|---|---|
| Anyone | Browse the archive, search in English or Khmer, read an entry, switch language and light/dark theme. |
| Contributor (signed in) | Add an entry with a photo, edit or delete your own entries, see all of them and their status under **My entries**. |
| Reviewer | Open **Review**, publish a waiting entry, or return it with a note saying what to change. |

## How an entry gets published

1. A contributor adds an entry. It is saved as **Waiting for review** and does not appear on the public archive.
2. A reviewer publishes it, or returns it with a note.
3. A returned entry shows the note in **My entries**. The contributor edits it, and saving sends it back to the queue.
4. A contributor who edits a published entry sends it back to review too. A reviewer's edit stays published.

The database enforces this, not the buttons. Row-level security in Supabase lets anyone read published entries, lets owners write only their own rows, and refuses any contributor write that sets a status other than `pending`. Publishing and returning go through one database function (`review_entry`) that checks the caller is a reviewer.

## Stack

- Next.js 15 (App Router), React 19, plain JavaScript
- Supabase: Postgres for entries, Storage for photos, Auth for accounts (with hCaptcha)
- Hosted on Vercel

No other dependencies. Styling is inline style objects plus `app/globals.css`.

## Where things are

- `collection.config.js`: the archive's name, description, curator and source
- `app/`: pages (`browse`, `contribute`, `my-entries`, `review`, `login`, `signup`, `history`)
- `components/`: one component per file
- `lib/archive.js`: the only module that talks to the database
- `lib/entryRules.js`: the form's validation rules
- `supabase/`: the SQL for tables, policies and functions, run by hand in the Supabase SQL Editor

## Running it locally

```bash
npm install
npm run dev
```

It needs a `.env.local` with these three values (never commit it):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
```

Then open http://localhost:3000.

## Credits

Sources are credited on each entry. Built with AI assistance; commits that were AI-assisted are marked in the commit message.
