# Requirements

What the site must do, written so that someone else can check it. Each requirement expresses a need of
the users, and has a check that passes or fails on the live site
(<https://campuscycle-lewis.vercel.app>). The results were checked on the live site; the date is in
each result.

| Id | Requirement | Serves | Check | Result |
| --- | --- | --- | --- | --- |
| R1 | A user can book a time at the repair café without an account, by giving a name, an e-mail address and a time that still has a place. | Task 1: book a time slot | On `/repair-cafe/saturday-repair-cafe`, choose the first time, type the name `Test Person` and the e-mail address `test@fixpoint.example`, then **Book this slot**: the page "Booking saved" shows that time and the place. | TODO: |
| R2 | A user can say what needs fixing when booking, so the volunteers have the right part ready. | Task 1 | On the same page, tick **New battery**, then book as in R1: the page "Booking saved" lists Repairs: New battery. | TODO: |
| R3 | A user who forgets a required field keeps everything they typed and is told what to fix. | Task 1 | On the repair café page, choose a time, leave the name empty and book: the form comes back with "Enter your name." under the name field, and the chosen time and e-mail address are still filled in. | TODO: |
| R4 | A user can never book a time that is full. | Task 1 | In `/admin` → **Time Slots**, open a slot with 2 places that has 2 bookings: on the repair café page that time shows "Full" and cannot be chosen. | TODO: |
| R5 | A user can see which repairs exist for their device, each with its price and how long it takes. | Task 2: find the repair | On `/repairs`, choose **Laptop** under "Your device" and **Show repairs**: the address ends in `?device=laptop`, the heading says "Repairs for your laptop: 4", and each repair shows a price and "about … minutes". | TODO: |
| R6 | A filtered list of repairs can be shared and still shows the same list. | Task 2 | Open `/repairs?device=headphones` in a new private window: the heading says "Repairs for your headphones: 3". | TODO: |
| R7 | From a repair, the user sees which devices it is for; from a device, which repairs it has. | Task 2 | On `/repairs/new-battery`, "For these devices" lists Smartphone and Tablet; the link Smartphone opens `/devices/smartphone`, which lists New battery. | TODO: |
| R8 | A user knows what a visit costs before they come. | Both tasks | On the home page, the note under the repair café says that the price includes parts and that a device check is free. | TODO: |
| R9 | A user can find where the repair café is. | Task 1 | On `/contact`, the place "Room 0.14, Library building" and a map are shown. | TODO: |
| R10 | Both tasks work with the keyboard only and at phone width. | Both tasks | With only Tab, Space and Enter, do R1 and R5 at 390 px wide: every step is reachable, the focus is always visible, and nothing scrolls sideways. | TODO: |
