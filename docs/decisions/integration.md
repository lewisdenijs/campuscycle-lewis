# Decision: an integration

Whether the site connects to another service, and to which.

## The question

How do users find the repair café on the campus? Users come once, often for the first time, with a
broken device; "Room 0.14, Library building" alone does not tell a new student where to go.

## Options considered

- **No integration: only the address in words.** Advantage: nothing leaves the site. Drawback: users
  who do not know the campus must look the building up elsewhere.
- **A map from OpenStreetMap** on the contact page. Advantage: free, no account, no key; the course's
  recipe R11 shows how. Drawback: the map is another service's frame, and that service receives each
  user's internet address when it loads.
- **Confirmation e-mails with Resend.** Advantage: users get their booking in their inbox. Drawback:
  needs an account, a key and a verified domain; this practice site has no real addresses to send to.
- **A booking calendar from Cal.com.** Drawback: it would replace our own booking task, which is the
  point of the project.

## The decision

OpenStreetMap: its own embed (`openstreetmap.org/export/embed.html`) in an `iframe` on `/contact`,
with a text link under it to the same map on its own page. The settings are the `bbox` and `marker`
numbers in `src/app/(site)/contact/page.tsx`.

Checked on the live site: `/contact` shows the map with the marker, the link under it opens the map
on openstreetmap.org, and with the keyboard the frame can be reached and passed with Tab.

TODO: the date it was checked on the live site.

## Why

- It answers the users' need (finding the place) with the least set-up: no account, no key, no cost.
- The embed is OpenStreetMap's own page, which shows the "© OpenStreetMap contributors" attribution
  that its tile policy asks for.
- The link under the map gives the same information to users who cannot use the frame.

## Consequences

- When the map loads, openstreetmap.org receives the user's internet address, as with any page. The
  privacy page says so, under "The map".
- There is no guarantee of service: when OpenStreetMap is slow or down, the frame stays empty, but the
  address in words and the link still work.
- Heavy or automated use is not allowed by the tile policy; a small site with a few users a day is
  normal interactive use.

## Facts read on

- OpenStreetMap Foundation, Tile Usage Policy: <https://operations.osmfoundation.org/policies/tiles/>,
  read on 24 November 2026 (normal interactive use allowed, visible attribution required, no bulk
  downloading, availability is best effort with no guarantee).

## Review when

If the site starts sending many map views (thousands a day), or OpenStreetMap changes its tile policy:
then consider a map provider with a plan, or a static image of the map.
