# Hand-over

Everything the next owner of Fixpoint's site needs. This file is public: it names accounts, never a
password, a secret or a connection string.

## Who owns what

The services the site runs on, and whose account each one is in.

| Service | What it holds | Owner (account name, not the password) |
| --- | --- | --- |
| GitHub | the code: `lewisdenijs/campuscycle-lewis` | lewisdenijs (Lewis Denijs) |
| Vercel | the live site <https://campuscycle-lewis.vercel.app> and its settings | Lewis Denijs's Hobby account (lewisdenijs1) |
| Neon | the database (connected through Vercel) | Lewis Denijs, through the Vercel project |
| Vercel Blob | the images | Lewis Denijs, through the Vercel project |

The six responsibilities. The owner is a role; today one person, the builder, fills every role.

| Responsibility | Owner (a role) | Who can log in | Last tested |
| --- | --- | --- | --- |
| Content | the repair café coordinator | the editors in `/admin` (today: the builder's admin account) | 24 November 2026: repairs, devices and pages changed by the content migration and checked on the live site |
| Access | the repair café coordinator | the builder (GitHub, Vercel, `/admin`) | never: no second editor has been added and removed yet |
| Updates | the site's developer | the builder (GitHub, merges pull requests) | 24 November 2026: changes merged through pull requests with green checks |
| Monitoring | the repair café coordinator | the builder (Vercel Analytics, `/admin` → Bookings) | never: the measures below have not been read on a full month yet |
| Backup and restore | the site's developer | the builder (Neon, through Vercel) | never: no backup has been restored on test data |
| Ownership | the college's student services, once they take the site over | the builder | never: the accounts have not been moved |

- **Who edits what in `/admin`:** the coordinator edits the **Repairs** (name, price, minutes, the
  devices each is for), the **Devices**, the **Fixers**, the **Questions** on the contact page, the
  **Pages** (home, about, contact, privacy) and the **Site facts** (place, e-mail address, pricing
  rule). They add the **Time Slots** for each new Saturday (the ones made by the migration end on 27
  March 2027) and delete old **Bookings**. A new editor gets an account from an existing editor in
  `/admin` → **Users**. A new kind of content, a new field or a new page layout needs a developer.

## Left out, and in which order

Ranked by what users and the café lose without each.

1. **Time slots after 27 March 2027.** Without them the booking task stops working: users can no
   longer book at all. Until it is automated, the coordinator adds them in `/admin` before the end of
   March (from 28 March Belgium is on summer time: check that 13:00 shows as 13:00).
2. **A reminder e-mail the day before.** Without it some users forget to come, and the place stays
   empty while others could have used it.
3. **Cancelling or moving a booking by the user.** Without it a user who cannot come blocks a place;
   today they must e-mail and an editor deletes the booking.
4. **A waiting list for full Saturdays.** Without it a user who finds the day full must check again
   later, and some give up.
5. **Photos per repair, and a Dutch version.** Without them some users understand a repair less
   quickly, but they can still find and book it.

What does not work yet, or could break:

- The repair choice on the booking is optional: a user who ticks nothing must explain the problem in
  the note. If that is often empty, make the choice required.
- On the free plans the database sleeps when nobody uses it: the first visit after a quiet spell can
  take a few seconds. Nothing to do unless users complain.
- The content migration (`src/migrations/*_fixpoint_content.ts`) ran once on the live site; it does
  not run again, so editors' changes are safe.

## How you will know it works

- **Bookings per Saturday**, read in `/admin` → **Bookings** (filter on the time slot). If there are
  none on two Saturdays in a row, try the booking task on the live site yourself.
- **Visits to `/repairs` against visits to the repair café page**, read in Vercel → **Analytics** →
  Pages, once a month (Hobby keeps one month). If fewer than 1 in 5 users who open `/repairs` also
  open the repair café page, watch one person find and book a repair.
- **E-mails about a booking that went wrong**, in the café's inbox. More than two in one month: test
  the booking on a phone and read the test report's open points.

How to run, change and deploy the site safely:

- On your own computer: `docs/guides/local-setup.md`.
- Different from the starter: the site's own content (devices, repairs, fixers, questions) is added
  by the seed on a new database, and was added to the live site by the migration
  `*_fixpoint_content.ts`. The old example (workshops, topics, the repair price list) was removed.
- A change reaches the live site through `main`. Never use Vercel's "Promote to Production": use
  Redeploy, and check that the build log shows `MIGRATIONS: verified committed migrations`.
- Every change goes through a pull request with its AI note, its preview and green checks; the builder
  merges it.
