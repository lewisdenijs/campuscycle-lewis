# Project brief

The short description of the site: who it is for and what it does. Its reader has never seen the
site. The details are in `docs/requirements.md`.

## What the site is for

Fixpoint is a (fictional) repair café at a college. Its promise: **bring a broken phone, tablet,
laptop or headphones on a Saturday afternoon, and a volunteer repairs it with you while you wait, for
a small and known price.** The site tells users what can be fixed and what it costs, and lets them
book a time at the repair café.

## Its users

Students and staff of the college with a device that has a problem: a battery that is empty before
the evening, a cracked screen, a laptop that has become hot and slow. Most have little money and no
idea what a repair costs; many would otherwise buy a new device. They come to find out whether their
problem can be fixed and for how much, and then to book a time.

## The two tasks, ranked

1. **Book a time slot at the repair café** (transactional, the primary task): the user chooses a
   Saturday time, ticks what needs fixing and books it. When it fails, the user comes for nothing or
   finds no volunteer free, and the volunteers do not have the right part (a screen, a battery) ready.
2. **Find the repair for your device, with its price** (informational): the user chooses their device
   and sees what we fix on it, what it costs and how long it takes. When it fails, the user does not
   know whether a repair is worth it, and often buys a new device instead or never comes.

## Constraints

What must hold whatever is built.

- Test data only: made-up names, e-mail addresses and bookings, never real personal data.
- No payments: users pay at the table, after the repair works.
- Free plans only.
- No photos of people.
- Volunteers repair with the user present: the site never promises to keep a device.

## Not in this version

- A reminder e-mail the day before the booked time.
- Cancelling or moving a booking by the user (an editor does it in `/admin`).
- A price quote for a repair that is not on the list (users book a free device check instead).
- Photos per repair, and a waiting list for full Saturdays.
- A Dutch version of the site.
