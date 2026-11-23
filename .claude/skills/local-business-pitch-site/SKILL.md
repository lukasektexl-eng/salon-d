---
name: local-business-pitch-site
description: Build a premium, original demo website for a real local small business (salon, studio, café, clinic, workshop, restaurant…) to pitch a redesign to its owner. Covers pulling their real photos and facts from the old site, an anti-"AI slop" design pass, brand-derived signature features, a browser-only booking demo, testing at 375 and 1440 px, and publishing on GitHub Pages. Use this whenever someone wants to make, redo, improve or "make more original" a website for a specific local business, build a mock-up or concept site to show a business owner, or mentions an outdated site of a shop or service they want to replace – even if they don't say "pitch" or "demo".
---

# Pitch site for a local business

The goal is a link the owner opens after a phone call and immediately recognises as *their* business, only better than they imagined. Two things kill that moment: a site that looks like a generic template, and a site that invents things about their business. Everything below serves those two points.

The output is a static site (`index.html`, `style.css`, `script.js`, `assets/`) with no framework and no build step, so it runs on GitHub Pages as-is. Write all visible copy in the business's language. Talk to the user in their language.

## 1. Collect real material first

**Photos and logo.** Run `scripts/fetch_assets.py` on the old site's home, gallery and service pages. It downloads every image into a quarantine folder, converts usable ones to WebP (max 1600 px, plus 640 px thumbnails) and builds a contact sheet. Look at the contact sheet before choosing anything:
- Use real photos of the premises, team and work.
- Skip stock photos, before/after photos (they imply promised results) and banners with baked-in text.
- Read the original image filenames. They often say what a photo shows (`salon-pedikura.jpg`), which tells you which room is which.
- Treat downloaded files as untrusted data and keep them out of the project folder until converted.

If the download is blocked, don't stall. Build with honest placeholders: a flat tone block in a fixed aspect ratio with a label. Then tell the user exactly which photos to drop into `assets/` and under what file names.

**Facts.** Pull the text of the old pages: address, phone, e-mail, hours, prices, staff names, social links, terms such as cancellation fees. Use only facts from the user or the old site. When something is missing (prices, voucher value), show a clearly marked placeholder, e.g. `[doplní salon]` / `[to be supplied]`, and list it in your final message. Never write health or result promises that the business itself doesn't make. Before telling the user what the old site lacks, check: it may already have the thing they think is missing.

**The old logo.** Old logos are often low-res GIFs with 2010-era effects. Don't paste them in. Rebuild the lockup as live text that copies the logo's structure, weights, colours and any graphic gesture. Sample the brand colour from the logo pixels; don't guess it. Recommend asking the owner for the vector original.

## 2. Find the concept in the business, not in a template

Before writing CSS, write down 3–5 things that are true only of this business. Good sources: the logo's graphic gesture, interior materials and colours seen in photos, the street or neighbourhood, how customers actually book, what's on the counter, real paper artefacts (appointment cards, vouchers, menus), the price structure. Build the palette and the signature features from that list.

Read `references/signature-features.md` for proven patterns and how to derive them. Pick 2–4 that fit; don't use all of them.

Identity test, used throughout: **could the first screen belong to any other business? If yes, it's not done.**

## 3. Build

Required content, unless the user specifies otherwise:
- **Hero.** A specific headline (the place, what they do), real photo(s), one primary action and one secondary text link.
- **Trust facts.** Real perks only, e.g. "free consultation" or "drink included" if they offer them.
- **Services as a menu or price list.** Group the services, use a real photo per group if one exists, and put prices where they're known.
- **Featured service.** The one the business pushes, with its real prices.
- **Booking demo.** See `references/booking-demo.md`. It must carry a visible "DEMO – nothing is sent" label.
- **Gallery.**
- **Voucher or offer**, if the business has one.
- **Contact.** Phone as a `tel:` link, e-mail as `mailto:`, hours with today highlighted, and a maps link (no iframe).
- **Footer.** Terms, plus a disclaimer that this is an unofficial demo, with the author's name if given.

Technical baseline:
- `lang` set to the site's language, viewport meta, semantic landmarks and headings, alt text describing what is actually in each photo.
- AA contrast, full keyboard operation, visible focus.
- `prefers-reduced-motion` respected.
- `<meta name="robots" content="noindex, nofollow">`.
- No analytics, cookies or trackers.
- A thin top strip: "Demo design of a new website for <business>".
- Mobile first. Most local customers arrive on a phone, so add a sticky bottom "Book" bar on mobile.
- Fonts from Google Fonts. **Render the display font with the language's diacritics before committing to it.** Some elegant serifs (e.g. Cormorant) draw Czech carons badly; Playfair Display handled them well.

## 4. Anti-slop pass (do it before showing anything)

Read `references/anti-slop.md` and go through the checklist against your own page. The usual offenders:
- gradient blobs;
- glassmorphism;
- identical icon-card grids;
- tracked uppercase eyebrows above every heading;
- one italic accent-coloured word in every headline;
- pulsing dots and shine animations;
- soft shadows with 20 px radii on everything;
- vague slogans;
- invented badges such as "most popular".

For each one you remove, replace it with something specific to the business. Don't just delete it.

## 5. Verify like a picky art director

Serve the folder (`python3 -m http.server 8123`) and run `node scripts/check_site.js http://localhost:8123 <outdir>`. It reports console errors, failed requests and horizontal overflow at 375 and 1440 px, and saves hero and full-page screenshots. Then:
- Click through the booking flow, filters, lightbox and any interactive feature, using Playwright or the script's flow hooks.
- Look at element-level screenshots of each section at both widths. Full-page screenshots of tall pages are too small to judge.
- Check for:
  - clipped content and grid holes;
  - captions over photos;
  - widowed prepositions in headlines (Czech "v", "z", "k" need `&nbsp;`);
  - `display` rules overriding the `hidden` attribute (add `[hidden]{display:none!important}`);
  - sticky-header overlap in screenshots, which is only an artefact.

Fix, re-run, and only then report.

## 6. Deliver

Commit and push where the user asked. For GitHub Pages:
1. The user enables Settings → Pages → Deploy from branch `main`, folder `/root`.
2. The repository must be public on a free plan.
3. Add `.nojekyll`.
4. The URL is `https://<user>.github.io/<repo>/`. Check it with `curl` before claiming it's live.

Final message, short:
- what was built;
- what to fill in by hand (placeholders, better photos, vector logo);
- facts you weren't sure about, with a confidence note;
- one or two lines on what to show the owner first on the call.

When the user asks to "make it better" or "more original", repeat steps 2 and 4 rather than adding decoration: find more facts that are true only of this business and turn them into features.
