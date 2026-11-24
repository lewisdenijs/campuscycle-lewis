'use client'

// What this is: the time slots of the booking form, day first. A user first taps a day (a row of
// day buttons that swipes sideways on a phone), then sees only that day's times. Before, every time
// of every Saturday stood in one long list.
//
// How it stays usable for everyone:
// - Each time is still a real radio button named "timeSlot", so the form sends what it always sent.
//   A full slot is disabled and says "Full" in words.
// - Without JavaScript (or before it has loaded) nothing is hidden: every day's times show, each under
//   its day's heading. Once the page is interactive, only the chosen day's times show.
// - The day buttons say which one is chosen (aria-pressed), and the times of the chosen day follow
//   right after them, so a keyboard or screen reader user goes from the day straight to its times.
// - When the form comes back with an error, the day of the time the user had chosen is open again.
import { useMemo, useState, useSyncExternalStore } from 'react'
import { FieldError } from '@/components/site/FieldError'
import { placesLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

export type SlotChoice = {
  id: number
  // The whole time in words, "Saturday 28 November, 13:00" (src/lib/format.ts, formatSlotTime).
  label: string
  placesLeft: number
  // The parts of the time (src/lib/format.ts, slotParts). Without them, each slot is its own "day".
  dayKey?: string
  weekday?: string
  dayMonth?: string
  dayLong?: string
  time?: string
}

type SlotPickerProps = {
  slots: SlotChoice[]
  selected?: string
  error?: string
}

type Day = { key: string; weekday: string; dayMonth: string; dayLong: string; slots: SlotChoice[]; placesLeft: number }

// The slots grouped by calendar day, in the order they came (earliest first).
function byDay(slots: SlotChoice[]): Day[] {
  const days = new Map<string, Day>()
  for (const slot of slots) {
    const key = slot.dayKey ?? slot.label
    const day = days.get(key) ?? {
      key,
      weekday: slot.weekday ?? '',
      dayMonth: slot.dayMonth ?? slot.label,
      dayLong: slot.dayLong ?? slot.label,
      slots: [],
      placesLeft: 0,
    }
    day.slots.push(slot)
    day.placesLeft += Math.max(0, slot.placesLeft)
    days.set(key, day)
  }
  return [...days.values()]
}

// Nothing to listen to: "interactive" only differs between the server and the browser.
const noChanges = () => () => {}

export function SlotPicker({ slots, selected, error }: SlotPickerProps) {
  const days = useMemo(() => byDay(slots), [slots])
  // The day to open: the one of the time the user had chosen, otherwise the first day with a place.
  const startDay =
    days.find((day) => day.slots.some((slot) => String(slot.id) === selected))?.key ??
    days.find((day) => day.placesLeft > 0)?.key ??
    days[0]?.key
  const [openDay, setOpenDay] = useState(startDay)
  // false on the server and until the page is interactive: then every day's times show (see above).
  // (useSyncExternalStore: the server's answer is false, the browser's true, without a second render.)
  const interactive = useSyncExternalStore(noChanges, () => true, () => false)

  return (
    <fieldset id="timeSlot" tabIndex={-1} aria-describedby={error ? 'timeSlot-error' : undefined} className="grid min-w-0 scroll-mt-6 gap-4">
      <legend className="mb-3 text-base font-semibold">
        Choose a time: first the day, then the hour <span className="font-normal text-ink-soft">(required)</span>
      </legend>
      {error && <FieldError id="timeSlot-error">{error}</FieldError>}

      {interactive && days.length > 1 && (
        // The days: a row that swipes sideways on a phone (scroll-snap), and wraps on a wide screen.
        <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin] sm:overflow-visible">
          <ul className="flex snap-x snap-mandatory gap-2 sm:flex-wrap" aria-label="Days">
            {days.map((day) => {
              const open = day.key === openDay
              const full = day.placesLeft === 0
              return (
                <li key={day.key} className="snap-start">
                  <button
                    type="button"
                    aria-pressed={open}
                    onClick={() => setOpenDay(day.key)}
                    className={cn(
                      'grid min-h-11 min-w-22 cursor-pointer place-items-center gap-0.5 rounded-control border-2 border-ink px-3 py-2 text-center whitespace-nowrap',
                      open ? 'bg-ink text-canvas' : 'bg-paper text-ink hover:bg-mint-tint',
                      full && !open && 'border-dashed text-ink-soft',
                    )}
                  >
                    <span className="text-sm font-semibold">{day.weekday}</span>
                    <span className="font-heading text-lg leading-tight font-bold">{day.dayMonth}</span>
                    <span className={cn('text-xs', open ? 'text-canvas/80' : 'text-ink-soft')}>{full ? 'Full' : `${day.placesLeft} free`}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {days.map((day) => {
        const shown = !interactive || day.key === openDay
        return (
          // Not the hidden attribute: the class "grid" would show it anyway, so the class does the hiding.
          <div key={day.key} className={shown ? 'grid gap-3' : 'hidden'}>
            <p className="font-semibold">{day.dayLong}</p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {day.slots.map((slot) => {
                const full = slot.placesLeft <= 0
                return (
                  <li key={slot.id} className="grid">
                    <label
                      className={cn(
                        'flex min-h-11 cursor-pointer items-start gap-3 rounded-control border-[1.5px] border-ink bg-paper px-4 py-3',
                        'has-checked:border-2 has-checked:bg-mint-wash',
                        'has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus has-focus-visible:outline-solid',
                        error && 'border-2 bg-error-wash',
                        'has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:bg-canvas has-disabled:text-ink-soft',
                      )}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.id}
                        // The whole day and time for a screen reader; the label shows the time only.
                        aria-label={`${slot.label}, ${placesLabel(slot.placesLeft)}`}
                        className="mt-1 size-5 shrink-0 accent-ink"
                        defaultChecked={selected === String(slot.id)}
                        disabled={full}
                        required
                      />
                      <span className="grid">
                        <span className="font-heading text-lg font-bold">{slot.time ?? slot.label}</span>
                        <span className={full ? 'font-semibold' : 'text-sm text-ink-soft'}>{placesLabel(slot.placesLeft)}</span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </fieldset>
  )
}
