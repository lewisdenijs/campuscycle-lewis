# Decision: analytics

Whether the site measures how it is used, and with which tool.

## The question

How do we learn whether users find the repairs and reach the booking, without tracking who they are?

## Options considered

- **No analytics.** Advantage: nothing to set up, nothing about users leaves the site. Drawback: we
  only see the bookings, not how many people looked at the repairs and gave up.
- **Vercel Web Analytics.** Advantage: built into the starter and the host we already use; two
  switches, no cookie banner needed. Drawback: on the free Hobby plan it counts page views only, keeps
  them for one month, and records no custom events.
- **Matomo.** Advantage: very complete, can be hosted by ourselves. Drawback: needs a server and
  someone to run it; nobody hosts one for us.

## The decision

Vercel Web Analytics, page views only.

Installed with the starter's two switches: `NEXT_PUBLIC_ANALYTICS=vercel` for Production in Vercel
(**Settings** → **Environment Variables**), and **Analytics** → **Enable** in the Vercel project.
Checked on the live site in a browser without an ad blocker: the Network tab shows the analytics
`script.js` and then a `view` request.

Switched on by the builder in Vercel, and checked on 24 November 2026: on the live home page the browser loaded `/3977c3e703b81499/script.js` and sent a `view` request, both answered 200.

## Why

- The two questions we have are answered by page views: how many users open `/repairs`, and how many
  of them open the repair café page. The bookings themselves are counted in `/admin`.
- It costs nothing and needs no extra account: the site already runs on Vercel.
- It sets no cookies for analytics and stores no internet address, so the site needs no cookie banner
  (Vercel's privacy page, below).

## Consequences

- Only page views: we cannot see which device was chosen in the filter or that a booking was saved as
  events (`filter_used` and `booking_saved` need a paid plan). The address of a filtered list
  (`/repairs?device=laptop`) does show up as a page.
- Data is kept for one month on Hobby: the owner must read it at least monthly.
- At most 50,000 events a month on Hobby; above that, recording pauses until the next month.
- Users are counted by a hash of their request that is discarded after 24 hours; the privacy page
  says so under "Counting visits".

## Facts read on

- Vercel, Web Analytics limits and pricing: <https://vercel.com/docs/analytics/limits-and-pricing>,
  read on 24 November 2026 (Hobby: 50,000 events a month, a reporting window of 1 month, no custom
  events).
- Vercel, Web Analytics privacy and compliance: <https://vercel.com/docs/analytics/privacy-policy>,
  read on 24 November 2026 (no third-party cookies; users identified by a hash of the request,
  discarded after 24 hours).

## Review when

When the site gets more than 40,000 page views a month, or when the owner wants to measure the
booking itself as an event: then compare Vercel's Pro plan with a self-hosted tool.
