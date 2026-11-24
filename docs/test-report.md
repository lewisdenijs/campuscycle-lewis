# Test report

What we learned by watching a person use the site. It is read by whoever decides whether the site can
go live, and later by whoever improves it.

## What was tested, and how

- **The task, as it was read to the person:** "Your phone's battery is empty every afternoon. Find out
  what Fixpoint charges to fix that, and book a time for this Saturday or the next one. Use a made-up
  name and e-mail address."
- **The condition:** the live site <https://campuscycle-lewis.vercel.app>.
- **The person, the device and the date:**

TODO: the version (the commit shown in Vercel → Deployments), the device and its browser, who took part (for example "a fellow student", or "nobody else: I did the task myself in a private window, and nobody else was watched"), whether they had seen the site before, and the date.

- I watched without helping, and wrote down what they did and said.

## What we saw

For each finding: what the person **did**, what I **think** it means, and what I am **not sure** of.

| # | Behaviour (what you saw) | Interpretation (what you think it means) | Uncertainty (what you are not sure of) |
| --- | --- | --- | --- |
| 1 | TODO: | TODO: | TODO: |
| 2 | TODO: | TODO: | TODO: |

## What we changed, and the retest

TODO: the change made for finding 1, the pull request that made it (for example #8), and the retest:
the same task again, with its date and result.

## The release check

Done on the live site after the last pull request was merged.

TODO: the date of the release check.

| Check | Conditions | Result |
| --- | --- | --- |
| Every page has one main heading, landmarks, alt texts and labelled fields | CI's browser checks (`checks/checks.json`) on the pull request's preview, at 1100 px and 390 px | TODO: |
| Task 1 (book) works by keyboard only | Chrome on a laptop, only Tab, Space and Enter | TODO: |
| Task 2 (find a repair) works by keyboard only | Chrome on a laptop, only Tab, Space and Enter | TODO: |
| Both tasks work at phone width, without sideways scrolling | Chrome's device toolbar at 390 px wide, and on a real phone | TODO: |
| The requirements' checks | `docs/requirements.md`, on the live site | TODO: |
| No example text left | `node scripts/ci/leftovers.mjs` | Passed on 24 November 2026: "Leftovers: none." |
| Analytics records a page view | Network tab: `script.js` then `view` | TODO: |

**One improvement, with its evidence:**

TODO: the change from the test above, and what showed it worked.

## Not tested yet

- With a screen reader (NVDA or VoiceOver): the slot list and the repair checkboxes may be read in a
  way nobody has heard yet. Risk: a blind user cannot tell which times are full.
- Two people booking the last place of a slot at the same moment, on the live site (the automated
  tests cover it on a test database). Risk: low; the database refuses a third booking.
- An older phone on a slow connection. Risk: the long list of time slots loads slowly.
