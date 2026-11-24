// The facts of the site: Fixpoint, a made-up repair café for phones, tablets, laptops and headphones
// at a college. Volunteers repair devices for a small price on Saturday afternoons, and show users how
// to keep them working. (The file keeps the starter's name, campus-cycle.ts, so every import still
// finds it.)
//
// The seed (src/seed/seed.ts) and the migration that brought this topic to the live site
// (src/migrations/*_fixpoint_content.ts) copy these facts into the database. From then on the records
// live in the database and editors change them in /admin; this file is then no longer read for them.

// The site's name: in the header, the footer and every browser tab ("<Page> · Fixpoint", from
// SITE_TITLE below). Change it here, once.
export const SITE_NAME = 'Fixpoint'

// The browser tab's title. The home page shows the name alone; every other page gives only its own part
// (such as "Repairs") and Next.js adds " · " and the name after it.
export const SITE_TITLE = { default: SITE_NAME, template: `%s · ${SITE_NAME}` }

export const CAMPUS_CYCLE = {
  // The place, the e-mail address and the pricing rule go into the Site facts global
  // (src/globals/SiteFacts.ts): every page that shows them reads them from there.
  place: 'Room 0.14, Library building, college campus',
  email: 'hello@fixpoint.example',
  pricingRule:
    'Every price includes the parts we fit and a 3-month guarantee on that repair. A device check is always free, and you only pay when the repair works.',
  // The repair café: Saturday 13:00 to 17:00, four one-hour time slots, two devices per slot.
  clinic: {
    name: 'Saturday repair café',
    slug: 'saturday-repair-cafe',
    day: 'Saturday',
    startTime: '13:00',
    endTime: '17:00',
    summary:
      'Every Saturday afternoon our volunteers repair phones, tablets, laptops and headphones at a table in the library. Book a time slot, bring your device, and watch how it is fixed: most repairs are done while you wait.',
    whatToBring: ['Your device and its charger', 'The code or password to unlock it', 'A backup of your photos and files, if you can'],
    placesPerSlot: 2,
    slotTimes: ['13:00', '14:00', '15:00', '16:00'],
  },
  devices: [
    {
      name: 'Smartphone',
      slug: 'smartphone',
      description:
        'Any brand of phone. We replace batteries and screens, clean or replace charging ports and save your data. We do not repair water damage inside the phone.',
    },
    {
      name: 'Tablet',
      slug: 'tablet',
      description:
        'Tablets and e-readers. We replace batteries, fix charging ports and move your data to a new device.',
    },
    {
      name: 'Laptop',
      slug: 'laptop',
      description:
        'Windows laptops, MacBooks and Chromebooks. We clean fans, fit more memory or a faster drive, and save your files before anything else.',
    },
    {
      name: 'Headphones',
      slug: 'headphones',
      description: 'Wired and wireless headphones. We fix loose cables, broken buttons and charging ports.',
    },
  ],
  repairs: [
    {
      name: 'Free device check',
      slug: 'free-device-check',
      summary: 'We find out what is wrong and tell you what a repair would cost.',
      details:
        'A volunteer looks at your device with you, tests the battery, the screen and the ports, and tells you what is wrong. You decide afterwards whether you want the repair. The check costs nothing.',
      price: 0,
      minutes: 15,
      devices: ['smartphone', 'tablet', 'laptop', 'headphones'],
    },
    {
      name: 'New battery',
      slug: 'new-battery',
      summary: 'A new battery for a phone or tablet that is empty before the evening.',
      details:
        'We open the device, take out the old battery safely and fit a new one of the right type. Afterwards we test that it charges. Your data stays on the device.',
      price: 35,
      minutes: 45,
      devices: ['smartphone', 'tablet'],
    },
    {
      name: 'New phone screen',
      slug: 'new-phone-screen',
      summary: 'A new screen for a phone with a cracked or dead display.',
      details:
        'We replace the whole front screen and test touch, brightness and the front camera. Book a time slot first and say which phone you have in the note: we then have the right screen ready on the day.',
      price: 60,
      minutes: 60,
      devices: ['smartphone'],
    },
    {
      name: 'Charging port repair',
      slug: 'charging-port-repair',
      summary: 'For a device that only charges when you hold the cable just right.',
      details:
        'Most of the time the port is only full of dust: then we clean it and you pay nothing. When the port itself is broken, we replace it.',
      price: 25,
      minutes: 30,
      devices: ['smartphone', 'tablet', 'headphones'],
    },
    {
      name: 'Laptop clean-up',
      slug: 'laptop-clean-up',
      summary: 'For a laptop that gets hot, loud or slow.',
      details:
        'We open the laptop, clean the dust out of the fan and the air vents and put new thermal paste on the processor. A clean laptop runs cooler, quieter and often faster.',
      price: 15,
      minutes: 45,
      devices: ['laptop'],
    },
    {
      name: 'Memory or SSD upgrade',
      slug: 'memory-or-ssd-upgrade',
      summary: 'More memory or a fast new drive, so an old laptop keeps up again.',
      details:
        'We check which upgrade your laptop takes, fit it and copy your files and system to the new drive. The price includes a 500 GB drive or 8 GB of memory.',
      price: 45,
      minutes: 60,
      devices: ['laptop'],
    },
    {
      name: 'Data backup and transfer',
      slug: 'data-backup-and-transfer',
      summary: 'Your photos and files saved, or moved to your new device.',
      details:
        'We copy your photos, contacts and files to a USB stick you bring, or straight to your new device. We do not look at your files, and we keep no copy.',
      price: 10,
      minutes: 30,
      devices: ['smartphone', 'tablet', 'laptop'],
    },
    {
      name: 'Loose cable or button',
      slug: 'loose-cable-or-button',
      summary: 'For headphones that only work on one side, or a button that no longer clicks.',
      details:
        'We open the headphones, solder the loose wire or replace the button, and test both sides before you go.',
      price: 10,
      minutes: 30,
      devices: ['headphones'],
    },
  ],
  // Made-up volunteers: this is a practice project, so no real people.
  fixers: [
    {
      name: 'Amira',
      bio: 'Studies electronics and has replaced more phone screens than she can count. She likes the small jobs best.',
      repairs: ['new-phone-screen', 'new-battery', 'charging-port-repair'],
    },
    {
      name: 'Jonas',
      bio: 'Builds his own computers at home. Bring him a slow laptop and he will make it fast again.',
      repairs: ['laptop-clean-up', 'memory-or-ssd-upgrade', 'free-device-check'],
    },
    {
      name: 'Sofie',
      bio: 'Works in the library and makes sure nobody loses their photos. She also fixes headphones with a soldering iron.',
      repairs: ['data-backup-and-transfer', 'loose-cable-or-button', 'free-device-check'],
    },
  ],
  questions: [
    {
      question: 'Do I need to book?',
      answer:
        'Yes, please book a time slot on the repair café page. Then a volunteer is free for you, and for a new screen we have the right part ready.',
    },
    {
      question: 'What if my device cannot be repaired?',
      answer: 'Then you pay nothing. We tell you why, and what you could do with the device instead.',
    },
    {
      question: 'Can I leave my device with you?',
      answer:
        'No. You stay with your device the whole time, so it never leaves your sight. Most repairs take less than an hour.',
    },
    {
      question: 'Is my data safe?',
      answer:
        'We never look at your files and keep no copy. Still, make a backup before you come if you can: a repair can always go wrong.',
    },
    {
      question: 'How do I pay?',
      answer: 'At the table, after the repair works, by card or in cash. The website takes no payments.',
    },
  ],
} as const

// Shown on the booking form, in the booking confirmation and on the privacy page. One copy here, so
// the three places can never say it differently. (The browser checks keep their own copy on purpose,
// in tests/e2e/helpers.ts, so a change here shows up there.)
export const MADE_UP_DATA_NOTICE = 'This is a practice project: use made-up details; no one will contact you.'

// What the booking confirmation page shows after a booking was saved.
export const BOOKING_CONFIRMATION = `Your booking is saved. ${MADE_UP_DATA_NOTICE}`

