# Signature features

A signature feature turns a real fact about the business into something interactive or visual that a template couldn't have. Pick 2–4 that are supported by facts you actually have. Every one below was built for a real beauty salon pitch and worked. Adapt the idea, not the surface.

## Logo gesture as a recurring mark
**Source:** a swoosh, underline, flourish or shape in the real logo.
**Build:**
- Redraw it as a small inline SVG.
- Put it in the text wordmark where it sits in the original logo (e.g. between name and tagline).
- Repeat it once or twice in the page, e.g. as an underline under the place name in the hero that draws itself on load (`pathLength="1"`, `stroke-dasharray:1`, animate `stroke-dashoffset` 1→0).
- Use it sparingly: 3–4 appearances total.

## Walk-through instead of a gallery ("Projděte se salonem")
**Source:** photos of different rooms or areas.
**Build:**
- Order rooms the way a customer walks: entrance → reception → … → treatment room.
- Make a horizontal scroll-snap track of rooms.
- Each room gets: a number, a name, one line saying what happens there (only what you know), and a photo count.
- Clicking a room opens a lightbox limited to that room's photos.
- Add prev/next buttons, a counter "02 / 09" and a progress line.
- Keep a full grid of all photos behind a toggle if the brief asked for a grid.

**Mapping photos to rooms:**
- Use the old site's image filenames and page context.
- Say which mappings you're unsure about.

## Price calculator instead of a dry table
**Source:** a tiered or package price list (e.g. 2/4/6/8/10 applications).
**Build:**
- A segmented radio group for the quantity.
- Live output with three lines:
  - a big total;
  - the price per unit;
  - the saving versus buying the smallest package repeatedly.
- Pure arithmetic from their own prices; no invented discounts.
- Keep the full table in a `<details>` for scanning.

## Live paper artefact next to booking
**Source:** whatever the business hands customers – an appointment card, receipt, order slip, menu.
**Build:**
- A flat "paper" card beside the booking widget, with the brand wordmark, a thin inner frame and a slight rotation.
- Its dotted lines fill in as the user picks service, day, time and name, with each new value briefly highlighted.
- Put the real cancellation terms on it.
- Reuse it as the confirmation screen.
- Hide the side copy on mobile and show it only at confirmation.

## Opening hours as a day timeline
**Source:** opening hours.
**Build:**
- A line from e.g. 7:00 to 20:00 with the open window filled and a "now" marker at the current local time.
- Use the business's time zone via `Intl.DateTimeFormat`.
- Hatch the bar for "by appointment" days.
- Combine it with a status line ("Open today until 17:00") and today's row highlighted in the hours table.

## Other ideas that follow the same logic
- **Street-level detail:** the storefront photo as an inset with the address caption, so customers recognise the door.
- **A menu-style service list:** groups with a real room photo, rows with name, one-line description, price and a "Book" link that preselects the service in the booking flow.
- **A flat, printable voucher:** a paper object on a dark surface, with an empty "For" line to write on.
- **Team:** if staff names are public on the old site, show who does what. Never invent people.
- **Restaurants and cafés:** today's menu or a dish-of-the-day pattern built from their real menu.
- **Workshops or garages:** a "how a visit goes" timeline built from their stated process.
