# Booking demo (browser only)

Online booking is usually the strongest selling point to an owner who books by phone. It must feel real, work on a phone and clearly say it sends nothing.

## Flow
1. **Service.** Native radio inputs grouped in `<fieldset>`/`<legend>` by category; native radios give arrow-key behaviour for free. Style the label with `:has(input:checked)` and `:has(input:focus-visible)`.
2. **Day.** Month grid, Monday first.
   - Disable past days, closed days and days beyond ~75 days.
   - Disable today if no slot is left.
   - Use buttons with `aria-pressed` and full `aria-label`s ("pondělí 24. listopadu").
   - Arrow keys move between enabled days.
   - Prev/next month buttons are disabled at the range ends.
   - If the current month has nothing free, jump to the next one.
3. **Time.** Slots within opening hours, e.g. every 30 minutes.
   - For the demo, mark ~1/3 as busy with a deterministic hash of date+time, so it's stable across renders, and say so in a legend.
   - Today: hide slots less than an hour from now.
4. **Details.** Name, phone, e-mail, optional note, and a checkbox acknowledging the real cancellation terms.
   - Validate on blur and on submit, with messages linked via `aria-describedby`.
   - Focus the first invalid field.
5. **Confirmation.** A summary (or the live paper card) plus an "Add to calendar" button that downloads an `.ics` built client-side with the business's time zone (`DTSTART;TZID=Europe/Prague:…`).

## Rules
- A visible label inside the widget: "DEMO – rezervace se neodesílá" (in the site's language). Nothing leaves the browser; no `fetch`, no storage of personal data.
- Step indicator with `aria-current="step"`. On step change, move focus to the step heading (`tabindex="-1"`) and scroll the widget into view if it's off-screen.
- A footer bar with Back (hidden on step 1), a short live summary ("Kosmetika · po 24. 11. · 10:30"), and Next. Next is disabled until the step is complete; its label is "Confirm" on step 4. Hide the footer on step 5.
- Every service on the page gets a "Book" link with `data-preselect="<service>"`. It selects the service, jumps to step 2 and scrolls to the widget.
- When the booking section is visible, hide the mobile sticky "Book" bar.
- A restart button resets state, form and errors.
