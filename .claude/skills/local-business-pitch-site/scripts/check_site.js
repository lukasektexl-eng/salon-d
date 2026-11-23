// Quality check for a static pitch site at phone and desktop width.
//
// Usage:
//   python3 -m http.server 8123 &            (from the site folder)
//   node check_site.js http://localhost:8123 /path/to/screens
//
// Reports per width (375 and 1440): console errors/warnings, page errors, failed
// requests, horizontal overflow, images without alt, and links with empty href.
// Saves hero-<w>.png and one screenshot per <section id> (sec-<id>-<w>.png),
// taken with reduced motion so scroll-reveal content is visible.
// Exit code 1 if any hard problem was found.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const [url = 'http://localhost:8123/', out = './screens'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  let hard = 0;

  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 375 ? 812 : 900 }, reducedMotion: 'reduce' });
    const problems = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console ${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()}`));

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${out}/hero-${width}.png` });

    // walk the page so lazy images and observers fire
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }

    const audit = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src),
      emptyLinks: [...document.querySelectorAll('a')].filter((a) => !a.getAttribute('href')).length,
      noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]'),
      lang: document.documentElement.lang,
      sections: [...document.querySelectorAll('section[id]')].map((s) => s.id),
    }));

    for (const id of audit.sections) {
      const el = await page.$(`section[id="${id}"]`);
      if (el) await el.screenshot({ path: `${out}/sec-${id}-${width}.png` }).catch(() => {});
    }

    if (audit.overflow > 0) problems.push(`horizontal overflow: ${audit.overflow}px`);
    if (audit.imgsNoAlt.length) problems.push(`images without alt: ${audit.imgsNoAlt.join(', ')}`);
    if (!audit.noindex) problems.push('missing <meta name="robots" content="noindex, nofollow">');
    if (!audit.lang) problems.push('missing <html lang>');
    if (audit.emptyLinks) problems.push(`links without href: ${audit.emptyLinks}`);
    hard += problems.length;

    console.log(`\n[${width}px] sections: ${audit.sections.join(', ')}`);
    console.log(problems.length ? problems.map((p) => '  ✗ ' + p).join('\n') : '  ✓ no problems');
    await page.close();
  }
  await browser.close();
  console.log(`\nscreenshots in ${out} – look at the sec-*.png files at both widths before reporting.`);
  process.exit(hard ? 1 : 0);
})();
