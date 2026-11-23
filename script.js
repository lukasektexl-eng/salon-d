/* Salon Dominique – ukázkový návrh · vanilla JS, bez závislostí */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     DATA
  ------------------------------------------------------------------ */
  const GROUP_IMG = {
    telo: ["salon-17", "Ošetřovna s přístroji pro tělové procedury"],
    plet: ["salon-20", "Kosmetická místnost s lehátkem"],
    vlasy: ["salon-09", "Kadeřnictví se zrcadly a křesly"],
    masaze: ["salon-14", "Místnost pro masáže"],
    rasy: ["salon-12", "Lehátko s lampou pro řasy a permanentní make-up"],
    dalsi: ["salon-05", "Chodba salonu s posezením a květinami"],
  };
  const CATS = {
    telo: "Tělo",
    plet: "Pleť",
    vlasy: "Vlasy",
    masaze: "Masáže a nohy",
    rasy: "Řasy a make-up",
    dalsi: "Další",
  };

  // Popisky jsou záměrně neutrální – bez slibů výsledků. Ceny jen tam, kde je salon zveřejňuje.
  const SERVICES = [
    { name: "Kryolipolýza", cat: "telo", icon: "snow", desc: "Nechirurgické tvarování postavy pomocí chladu. Zákrok trvá 40–60 minut.", price: "<small>od</small> 920 Kč" },
    { name: "Laserová lipolýza", cat: "telo", icon: "laser", desc: "Přístrojová procedura na tělo. Vhodnost probereme na konzultaci zdarma." },
    { name: "Přístrojová lymfodrenáž", cat: "telo", icon: "drops", desc: "Přístrojová lymfatická masáž, kterou lze kombinovat se zábalem." },
    { name: "Maderoterapie", cat: "telo", icon: "roller", desc: "Masážní technika s využitím tvarovaných dřevěných nástrojů." },
    { name: "Kosmetika", cat: "plet", icon: "face", desc: "Kosmetické ošetření pleti v klidném prostředí salonu." },
    { name: "Mikrojehličkování", cat: "plet", icon: "needle", desc: "Ošetření pleti pomocí jemných mikrojehliček." },
    { name: "Chemický peeling", cat: "plet", icon: "flask", desc: "Ošetření pleti s využitím peelingových přípravků." },
    { name: "Diamantová mikrodermabraze", cat: "plet", icon: "diamond", desc: "Mechanický peeling pleti s diamantovou hlavicí." },
    { name: "Radiofrekvenční lifting obličeje", cat: "plet", icon: "wave", desc: "Přístrojové ošetření obličeje pomocí radiofrekvence." },
    { name: "Rejuvenace pokožky", cat: "plet", icon: "sparkle", desc: "Přístrojová péče o pleť." },
    { name: "Kadeřnictví", cat: "vlasy", icon: "scissors", desc: "Střih, barvení a úprava vlasů přímo v salonu." },
    { name: "Masáže", cat: "masaze", icon: "hands", desc: "Chvíle klidu a uvolnění pro tělo i hlavu." },
    { name: "Masáž nohou", cat: "masaze", icon: "lotus", desc: "Odpočinek pro unavené nohy." },
    { name: "Pedikúra", cat: "masaze", icon: "foot", desc: "Péče o chodidla a nehty na nohou." },
    { name: "Prodlužování řas", cat: "rasy", icon: "lash", desc: "Prodloužení a zvýraznění řas." },
    { name: "Permanentní make-up", cat: "rasy", icon: "brush", desc: "Dlouhodobé zvýraznění obočí, linek nebo rtů." },
    { name: "Depilace cukrovou pastou", cat: "dalsi", icon: "honey", desc: "Depilace pomocí cukrové pasty." },
    { name: "Čínská medicína", cat: "dalsi", icon: "yinyang", desc: "Tradiční čínská medicína." },
  ];

  const GALLERY = [
    [14, "Světlá místnost pro masáže"],
    [10, "Křeslo pro pedikúru u okna"],
    [9, "Kadeřnictví se zrcadly a křesly"],
    [20, "Kosmetická místnost s lehátkem a policemi s přípravky"],
    [5, "Chodba salonu s posezením a květinami"],
    [8, "Kadeřnický mycí box s koženým křeslem"],
    [3, "Recepce s kyticí růží v popředí"],
    [12, "Lehátko s lampou"],
    [16, "Ošetřovna s lehátkem a přístroji"],
    [17, "Ošetřovna s přístroji a obrazem orchidejí"],
    [15, "Ošetřovna s lehátkem a přístrojem pro tělové procedury"],
    [2, "Recepce salonu s nápisem Salon Dominique – Best for Body"],
    [1, "Výloha a vchod do salonu z ulice"],
    [6, "Dlouhá světlá chodba salonu", "wide"],
    [4, "Recepce s pultem a křeslem pro hosty"],
    [7, "Pracovní místo pro péči o nohy a nehty"],
    [11, "Kadeřnictví – celkový pohled"],
    [13, "Kosmetická místnost s lehátkem a zrcadlem"],
    [18, "Ošetřovna s paravánem a lehátkem"],
    [19, "Ošetřovna s lehátkem u okna"],
    [21, "Ošetřovna s policemi a lehátkem", "wide"],
  ].map(([n, alt, shape]) => {
    const id = String(n).padStart(2, "0");
    const no = n;
    const tall = n === 10 || n === 16;
    return { full: `assets/gallery/salon-${id}.webp`, thumb: `assets/gallery/salon-${id}-thumb.webp`, alt, no, tall, wide: shape === "wide", w: tall ? 480 : 640, h: tall ? 640 : 480 };
  });
  const GALLERY_INITIAL = GALLERY.length;
  const byNo = Object.fromEntries(GALLERY.map((g, i) => [g.no, i]));

  // Místnosti – pořadí odpovídá cestě od vchodu. Přiřazení fotek vychází z jejich názvů na současném webu salonu.
  const ROOMS = [
    { name: "Výloha a vchod", what: "Široká 16/6, vchod přímo z ulice.", photos: [1] },
    { name: "Recepce", what: "Tady vás přivítáme, nabídneme nápoj a probereme, co je pro vás vhodné.", photos: [2, 3, 4] },
    { name: "Chodba a posezení", what: "Chvilka na vydechnutí před ošetřením.", photos: [5, 6] },
    { name: "Kadeřnictví", what: "Střih, barvení a úprava vlasů.", photos: [8, 9, 11] },
    { name: "Kosmetika", what: "Kosmetika a péče o pleť.", photos: [20, 18, 19, 21] },
    { name: "Řasy a permanentní make-up", what: "Prodlužování řas a permanentní make-up.", photos: [12, 13] },
    { name: "Pedikúra", what: "Péče o chodidla a nehty.", photos: [10, 7] },
    { name: "Masáže", what: "Masáže a masáž nohou.", photos: [14] },
    { name: "Ošetřovna pro tělo", what: "Přístrojové procedury – kryolipolýza a další.", photos: [15, 16, 17] },
  ];

  const MONTHS = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
  const DAYS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
  const DAYS_SHORT = ["ne", "po", "út", "st", "čt", "pá", "so"];

  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------------
     HLAVIČKA, MENU, MOBILNÍ CTA
  ------------------------------------------------------------------ */
  const header = $("#header");
  const burger = $("#burger");
  const nav = $("#nav");
  const mobileCta = $("#mobile-cta");
  const bookingSection = $("#rezervace");
  let bookingVisible = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    mobileCta.classList.toggle("is-visible", y > window.innerHeight * 0.6 && !bookingVisible && !document.body.classList.contains("nav-open"));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    onScroll();
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ------------------------------------------------------------------
     SLUŽBY + FILTR
  ------------------------------------------------------------------ */
  const menuEl = $("#service-menu");
  const plural = (n) => (n === 1 ? "služba" : n < 5 ? "služby" : "služeb");
  menuEl.innerHTML = Object.entries(CATS).map(([key, label]) => {
    const items = SERVICES.filter((x) => x.cat === key);
    const [img, alt] = GROUP_IMG[key];
    return `
    <section class="menu-group reveal" data-cat="${key}" aria-labelledby="mg-${key}">
      <div class="menu-group__aside">
        <img class="menu-group__img" src="assets/gallery/${img}-thumb.webp" width="640" height="480" alt="${esc(alt)}" loading="lazy" decoding="async">
        <h3 class="menu-group__title" id="mg-${key}">${label}</h3>
        <p class="menu-group__count">${items.length} ${plural(items.length)}</p>
      </div>
      <ul class="menu-list">
        ${items.map((x) => `
        <li class="menu-row">
          <h4 class="menu-row__name">${esc(x.name)}</h4>
          <p class="menu-row__desc">${esc(x.desc)}</p>
          <div class="menu-row__end">
            ${x.price ? `<span class="menu-row__price">${x.price}</span>` : ""}
            <a class="menu-row__book" href="#rezervace" data-preselect="${esc(x.name)}" aria-label="Rezervovat: ${esc(x.name)}">Rezervovat ${icon("arrow")}</a>
          </div>
        </li>`).join("")}
      </ul>
    </section>`;
  }).join("");

  const filterStatus = $("#filter-status");
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const f = tab.dataset.filter;
      $$(".tab").forEach((t) => { const on = t === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-pressed", String(on)); });
      let shown = 0;
      $$(".menu-group", menuEl).forEach((g) => {
        const match = f === "all" || g.dataset.cat === f;
        g.hidden = !match;
        if (match) { shown += $$(".menu-row", g).length; g.classList.add("is-in"); }
      });
      filterStatus.textContent = `Zobrazeno ${shown} ${plural(shown)}`;
    });
  });

  /* ------------------------------------------------------------------
     ANIMACE PŘI SCROLLU + AKTIVNÍ POLOŽKA MENU
  ------------------------------------------------------------------ */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));

    const links = $$(".nav__list a[href^='#']:not(.btn)");
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["sluzby", "kryolipolyza", "galerie", "poukaz", "kontakt"].forEach((id) => navIo.observe(document.getElementById(id)));
  } else {
    revealEls.forEach((el) => el.classList.remove("reveal"));
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      bookingVisible = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.15 }).observe(bookingSection);
  }

  /* ------------------------------------------------------------------
     OTEVÍRACÍ DOBA (čas v Praze)
  ------------------------------------------------------------------ */
  const pragueNow = () => {
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Prague", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date()).map((x) => [x.type, x.value]));
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
      return { day, mins: Number(p.hour) * 60 + Number(p.minute) };
    } catch {
      const d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  };

  const updateOpenStatus = () => {
    const { day, mins } = pragueNow();
    const weekday = day >= 1 && day <= 5;
    let text, open = false;
    if (weekday && mins < 600) text = "Dnes otevíráme v 10:00";
    else if (weekday && mins < 1020) { text = "Dnes otevřeno do 17:00"; open = true; }
    else if (weekday) text = day === 5 ? "Dnes už zavřeno · otevíráme v pondělí v 10:00" : "Dnes už zavřeno · zítra od 10:00";
    else text = "Dnes zavřeno · návštěva po domluvě";
    $$("[data-open-status]").forEach((el) => (el.textContent = text));
    root.classList.toggle("is-open-now", open);
    $$(".hours tr").forEach((tr) => tr.classList.toggle("is-today", Number(tr.dataset.day) === day));
    const now = $("#dayline-now");
    const START = 420, SPAN = 780; // 7:00–20:00
    const inRange = mins >= START && mins <= START + SPAN;
    $("#dayline").classList.toggle("is-weekend", !weekday);
    now.hidden = !inRange;
    if (inRange) now.style.left = `${((mins - START) / SPAN) * 100}%`;
  };
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  /* ------------------------------------------------------------------
     KRYOLIPOLÝZA – KALKULAČKA (ceny z webu salonu)
  ------------------------------------------------------------------ */
  const KRYO = { 2: 920, 4: 1820, 6: 2600, 8: 3400, 10: 3900 };
  const DATIV = { 2: "dvěma", 3: "třem", 4: "čtyřem", 5: "pěti" };
  const kc = (n) => `${n.toLocaleString("cs-CZ").replace(/\s/g, "\u00a0")}\u00a0Kč`;
  const updateCalc = (n) => {
    const price = KRYO[n];
    $("#calc-price").textContent = kc(price);
    $("#calc-per").textContent = `${kc(Math.round(price / n))} za jednu aplikaci`;
    const packs = n / 2, save = packs * KRYO[2] - price;
    $("#calc-save").textContent = n === 2
      ? "Nejmenší balíček – dobrý začátek po konzultaci."
      : `Oproti ${DATIV[packs]} balíčkům po 2 aplikacích ušetříte ${kc(save)}.`;
  };
  $(".calc__opts").addEventListener("change", (e) => updateCalc(Number(e.target.value)));
  updateCalc(Number($(".calc__opts input:checked").value));

  /* ------------------------------------------------------------------
     REZERVAČNÍ PRŮVODCE (DEMO – nic se neodesílá)
  ------------------------------------------------------------------ */
  const wizard = $("#wizard");
  const state = { step: 1, service: null, date: null, time: null, contact: null };
  const nextBtn = $("#next-btn");
  const backBtn = $("#back-btn");
  const foot = $("#wizard-foot");
  const pickEl = $("#wizard-pick");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 75);
  let viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const SLOTS = [];
  for (let m = 600; m <= 990; m += 30) SLOTS.push(m); // 10:00 – 16:30
  const fmtTime = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  const fmtDate = (d) => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
  const fmtDateLong = (d) => `${DAYS[d.getDay()]} ${d.getDate()}. ${MONTHS_GEN[d.getMonth()]}`;
  const MONTHS_GEN = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];

  // pseudonáhodná obsazenost pro ukázku (stabilní pro daný den)
  const isBusy = (d, m) => {
    let h = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate() + m * 7;
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995); h ^= h >>> 15;
    return (h >>> 0) % 100 < 34;
  };
  const nowMins = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
  const freeSlots = (d) => SLOTS.filter((m) => {
    if (d.getTime() === today.getTime() && m < nowMins() + 60) return false;
    return !isBusy(d, m);
  });
  const isBookable = (d) => {
    const wd = d.getDay();
    return wd >= 1 && wd <= 5 && d >= today && d <= maxDate && freeSlots(d).length > 0;
  };

  /* Krok 1 – služba (nativní radio = ovládání šipkami zdarma) */
  const picker = $("#svc-picker");
  picker.innerHTML = Object.entries(CATS).map(([key, label]) => `
    <fieldset class="svc-group">
      <legend class="svc-group__title">${label}</legend>
      <div class="svc-group__list">
        ${SERVICES.filter((s) => s.cat === key).map((s) => `
          <label class="svc-opt">
            <input class="visually-hidden" type="radio" name="service" value="${esc(s.name)}">
            <span class="svc-opt__mark" aria-hidden="true"></span><span>${esc(s.name)}</span>
          </label>`).join("")}
      </div>
    </fieldset>`).join("");
  picker.addEventListener("change", (e) => {
    if (e.target.name === "service") { state.service = e.target.value; refresh(); }
  });

  /* Krok 2 – kalendář */
  const calGrid = $("#cal-grid");
  const calPrev = $("#cal-prev");
  const calNext = $("#cal-next");
  const renderCal = () => {
    const y = viewMonth.getFullYear(), mo = viewMonth.getMonth();
    $("#cal-month").textContent = `${MONTHS[mo]} ${y}`;
    const first = new Date(y, mo, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(y, mo + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < offset; i++) html += `<span class="cal__day is-empty" aria-hidden="true"></span>`;
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, mo, d);
      const ok = isBookable(date);
      const sel = state.date && state.date.getTime() === date.getTime();
      const isToday = date.getTime() === today.getTime();
      const label = `${fmtDateLong(date)}${isToday ? ", dnes" : ""}${ok ? "" : ", nelze rezervovat"}`;
      html += `<button type="button" class="cal__day${isToday ? " is-today" : ""}" data-date="${date.getTime()}" aria-pressed="${sel}" aria-label="${label}" ${ok ? "" : "disabled"}>${d}</button>`;
    }
    calGrid.innerHTML = html;
    calPrev.disabled = viewMonth <= new Date(today.getFullYear(), today.getMonth(), 1);
    calNext.disabled = new Date(y, mo + 1, 1) > maxDate;
  };
  calGrid.addEventListener("click", (e) => {
    const b = e.target.closest(".cal__day");
    if (!b || b.disabled) return;
    const d = new Date(Number(b.dataset.date));
    if (!state.date || state.date.getTime() !== d.getTime()) state.time = null;
    state.date = d;
    $$(".cal__day", calGrid).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    refresh();
  });
  // šipky v mřížce kalendáře
  calGrid.addEventListener("keydown", (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map)) return;
    const btns = $$(".cal__day:not(.is-empty)", calGrid);
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    for (let j = i + map[e.key]; j >= 0 && j < btns.length; j += map[e.key]) {
      if (!btns[j].disabled) { btns[j].focus(); break; }
    }
  });
  calPrev.addEventListener("click", () => { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1); renderCal(); });
  calNext.addEventListener("click", () => { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1); renderCal(); });

  /* Krok 3 – čas */
  const timesEl = $("#times");
  const renderTimes = () => {
    const d = state.date;
    $("#time-day").textContent = d ? `${fmtDateLong(d)} · ${state.service}` : "";
    const free = new Set(freeSlots(d));
    timesEl.innerHTML = SLOTS.map((m) => {
      const ok = free.has(m);
      return `<label class="time${ok ? "" : " is-busy"}">
        <input class="visually-hidden" type="radio" name="time" value="${m}" ${ok ? "" : "disabled"} ${state.time === m ? "checked" : ""}>
        <span>${fmtTime(m)}</span>${ok ? "" : '<span class="visually-hidden"> – obsazeno</span>'}
      </label>`;
    }).join("");
  };
  timesEl.addEventListener("change", (e) => { state.time = Number(e.target.value); refresh(); });

  /* Krok 4 – formulář */
  const form = $("#booking-form");
  const fields = {
    name: { el: $("#f-name"), test: (v) => v.trim().length >= 3, msg: "Vyplňte prosím jméno a příjmení." },
    phone: { el: $("#f-phone"), test: (v) => /^(\+?\d{3})?\s?\d{3}\s?\d{3}\s?\d{3}$/.test(v.trim()), msg: "Zadejte telefon ve tvaru 777 123 456." },
    email: { el: $("#f-email"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "Zadejte platný e-mail." },
    terms: { el: $("#f-terms"), test: (_, el) => el.checked, msg: "Pro dokončení je potřeba souhlasit se storno podmínkami." },
  };
  Object.entries(fields).forEach(([k, f]) => {
    f.el.setAttribute("aria-describedby", `f-${k}-err`);
    f.el.addEventListener(f.el.type === "checkbox" ? "change" : "blur", () => validateField(k));
    f.el.addEventListener("input", () => { if (f.el.getAttribute("aria-invalid") === "true") validateField(k); });
  });
  const validateField = (k) => {
    const f = fields[k];
    const ok = f.test(f.el.value, f.el);
    f.el.setAttribute("aria-invalid", String(!ok));
    $(`#f-${k}-err`).textContent = ok ? "" : f.msg;
    return ok;
  };
  const validateForm = () => {
    const results = Object.keys(fields).map(validateField);
    const firstBad = Object.keys(fields).find((k, i) => !results[i]);
    if (firstBad) fields[firstBad].el.focus();
    return !firstBad;
  };
  form.addEventListener("submit", (e) => { e.preventDefault(); goNext(); });

  /* Objednací kartička – vyplňuje se průběžně (jako papírová kartička z recepce) */
  const SWOOSH = '<svg class="swoosh" viewBox="0 0 200 12" aria-hidden="true" focusable="false"><path d="M70 9.5C112 12.5 160 10 199 1.2 162 8.8 114 11 70 9.5Z"/></svg>';
  let lastAppt = {};
  const apptHTML = () => {
    const v = {
      service: state.service,
      day: state.date && `${fmtDateLong(state.date)}`,
      time: state.time != null && fmtTime(state.time),
      name: state.contact && state.contact.name,
    };
    const row = (key, label) => {
      const changed = v[key] && v[key] !== lastAppt[key];
      return `<div class="appt__row${changed ? " is-new" : ""}"><dt>${label}</dt><dd>${v[key] ? esc(v[key]) : ""}</dd></div>`;
    };
    const out = `
      <div class="appt__head">
        <span class="wordmark wordmark--small"><span class="wordmark__line"><span class="wordmark__salon">Salon</span> <span class="wordmark__name">Dominique</span></span>${SWOOSH}<span class="wordmark__tag">Best <b>for</b> Body</span></span>
        <span class="appt__kind">Objednací kartička</span>
      </div>
      <dl class="appt__rows">${row("service", "Služba")}${row("day", "Den")}${row("time", "Čas")}${row("name", "Jméno")}</dl>
      <p class="appt__note">Nemůžete-li přijít, omluvte se prosím alespoň 24&nbsp;h předem.</p>
      <p class="appt__addr">Široká 16/6, Říčany · 608 132 440</p>`;
    lastAppt = v;
    return out;
  };
  const renderAppt = () => { $("#appt-live").innerHTML = apptHTML(); };
  const renderSummary = () => { lastAppt = {}; $("#appt-done").innerHTML = apptHTML(); };

  $("#ics-btn").addEventListener("click", () => {
    const d = state.date, pad = (n) => String(n).padStart(2, "0");
    const stamp = (m) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(Math.floor(m / 60))}${pad(m % 60)}00`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Salon Dominique//Demo//CS", "BEGIN:VEVENT",
      `UID:${Date.now()}@salon-dominique-demo`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;TZID=Europe/Prague:${stamp(state.time)}`,
      `DTEND;TZID=Europe/Prague:${stamp(state.time + 60)}`,
      `SUMMARY:${state.service} – Salon Dominique`,
      "LOCATION:Široká 16/6\\, 251 01 Říčany u Prahy",
      "DESCRIPTION:Ukázková rezervace (demo). Tel. 608 132 440",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "rezervace-salon-dominique.ics" });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("#restart-btn").addEventListener("click", () => {
    Object.assign(state, { service: null, date: null, time: null, contact: null });
    form.reset();
    $$("input[name='service']", picker).forEach((i) => (i.checked = false));
    Object.values(fields).forEach((f) => f.el.removeAttribute("aria-invalid"));
    $$(".field__err", form).forEach((e) => (e.textContent = ""));
    viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    goTo(1);
  });

  /* Navigace mezi kroky */
  const canProceed = () => ({ 1: !!state.service, 2: !!state.date, 3: state.time != null, 4: true }[state.step]);

  const refresh = () => {
    nextBtn.disabled = !canProceed();
    const parts = [state.service, state.date && `${DAYS_SHORT[state.date.getDay()]} ${state.date.getDate()}. ${state.date.getMonth() + 1}.`, state.time != null && fmtTime(state.time)].filter(Boolean);
    pickEl.textContent = state.step < 5 ? parts.join(" · ") : "";
    renderAppt();
  };

  const goTo = (n, { focus = true } = {}) => {
    state.step = n;
    $$(".step", wizard).forEach((s) => {
      const on = Number(s.dataset.step) === n;
      s.hidden = !on;
      s.classList.toggle("is-active", on);
    });
    $$(".steps__item", wizard).forEach((li) => {
      const i = Number(li.dataset.stepInd);
      li.classList.toggle("is-current", i === n);
      li.classList.toggle("is-done", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (n === 2) {
      if (state.date) viewMonth = new Date(state.date.getFullYear(), state.date.getMonth(), 1);
      renderCal();
      // pokud v aktuálním měsíci není volno, přeskoč na další
      if (!state.date && !$$(".cal__day:not(:disabled):not(.is-empty)", calGrid).length && !calNext.disabled) calNext.click();
    }
    if (n === 3) renderTimes();
    if (n === 5) renderSummary();
    bookingSection.classList.toggle("is-done", n === 5);
    foot.hidden = n === 5;
    backBtn.hidden = n === 1;
    nextBtn.textContent = n === 4 ? "Potvrdit rezervaci" : "Pokračovat";
    refresh();
    if (focus) {
      const t = $(`.step[data-step="${n}"] .step__title`, wizard);
      t.focus({ preventScroll: true });
      const top = wizard.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        window.scrollTo({ top: window.scrollY + top - 80, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
  };

  const goNext = () => {
    if (state.step === 4) {
      if (!validateForm()) return;
      state.contact = { name: fields.name.el.value.trim(), phone: fields.phone.el.value.trim(), email: fields.email.el.value.trim() };
      // DEMO: nic se neodesílá, data zůstávají jen v prohlížeči
      goTo(5);
      return;
    }
    if (canProceed()) goTo(state.step + 1);
  };
  nextBtn.addEventListener("click", goNext);
  backBtn.addEventListener("click", () => goTo(Math.max(1, state.step - 1)));

  // Předvýběr služby z karet / sekce kryolipolýzy
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-preselect]");
    if (!a) return;
    e.preventDefault();
    const name = a.dataset.preselect;
    const input = $$("input[name='service']", picker).find((i) => i.value === name);
    if (input) { input.checked = true; state.service = name; }
    goTo(state.service ? 2 : 1, { focus: false });
    bookingSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(() => $(`.step[data-step="${state.step}"] .step__title`, wizard).focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  });

  goTo(1, { focus: false });

  /* ------------------------------------------------------------------
     GALERIE + LIGHTBOX
  ------------------------------------------------------------------ */
  const grid = $("#gallery-grid");
  grid.innerHTML = GALLERY.map((g, i) => `
    <li class="${i === 0 ? "is-feature" : g.tall ? "is-tall" : g.wide ? "is-wide" : ""}">
      <button type="button" class="g-item" data-index="${i}" aria-label="Zvětšit fotku: ${esc(g.alt)}">
        <img src="${i === 0 ? g.full : g.thumb}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async">
      </button>
    </li>`).join("");

  const moreBtn = $("#gallery-more");
  const allPhotos = $("#all-photos");
  moreBtn.addEventListener("click", () => {
    const expand = allPhotos.hidden;
    allPhotos.hidden = !expand;
    moreBtn.setAttribute("aria-expanded", String(expand));
    moreBtn.textContent = expand ? "Skrýt mřížku fotografií" : `Všechny fotografie v mřížce (${GALLERY.length})`;
  });

  // Prohlídka salonu
  const tourList = $("#tour-list");
  const tourTrack = $("#tour-track");
  const pad2 = (n) => String(n).padStart(2, "0");
  tourList.innerHTML = ROOMS.map((r, i) => {
    const g = GALLERY[byNo[r.photos[0]]];
    const count = r.photos.length;
    return `
    <li class="room">
      <button type="button" class="room__photo" data-room="${i}" aria-label="${esc(r.name)} – zobrazit ${count === 1 ? "fotografii" : `${count} fotografie`}">
        <img src="${g.full}" width="${g.w}" height="${g.h}" alt="${esc(g.alt)}" loading="lazy" decoding="async">
        ${count > 1 ? `<span class="room__count" aria-hidden="true">${count} foto</span>` : ""}
      </button>
      <p class="room__no" aria-hidden="true">${pad2(i + 1)}</p>
      <h3 class="room__name">${esc(r.name)}</h3>
      <p class="room__what">${esc(r.what)}</p>
    </li>`;
  }).join("");
  $("#tour-total").textContent = pad2(ROOMS.length);

  const rooms = $$(".room", tourList);
  const tourStep = (dir) => {
    const w = rooms[0].getBoundingClientRect().width + parseFloat(getComputedStyle(tourList).columnGap || 16);
    tourTrack.scrollBy({ left: dir * w, behavior: reduceMotion ? "auto" : "smooth" });
  };
  $("#tour-prev").addEventListener("click", () => tourStep(-1));
  $("#tour-next").addEventListener("click", () => tourStep(1));
  const onTour = () => {
    const max = tourTrack.scrollWidth - tourTrack.clientWidth;
    const p = max > 0 ? tourTrack.scrollLeft / max : 1;
    $("#tour-progress").style.transform = `scaleX(${Math.max(0.06, p)})`;
    const trackLeft = tourTrack.getBoundingClientRect().left;
    let idx = 0;
    rooms.forEach((r, i) => { if (r.getBoundingClientRect().left - trackLeft < r.offsetWidth * 0.5) idx = i; });
    if (p > 0.995) idx = rooms.length - 1;
    $("#tour-now").textContent = pad2(idx + 1);
    $("#tour-prev").disabled = tourTrack.scrollLeft < 4;
    $("#tour-next").disabled = tourTrack.scrollLeft > max - 4;
  };
  tourTrack.addEventListener("scroll", onTour, { passive: true });
  window.addEventListener("resize", onTour);
  onTour();

  // Lightbox – pracuje se sadou fotek (celá galerie nebo jedna místnost)
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  let lbSet = GALLERY.map((_, i) => i), lbPos = 0, lbTitle = "", lastFocus = null;
  const showLb = (pos) => {
    lbPos = (pos + lbSet.length) % lbSet.length;
    const g = GALLERY[lbSet[lbPos]];
    lbImg.src = g.full; lbImg.alt = g.alt;
    $("#lb-cap").textContent = g.alt;
    $("#lb-count").textContent = `${lbTitle ? lbTitle + " · " : ""}${lbPos + 1} / ${lbSet.length}`;
    const multi = lbSet.length > 1;
    $("#lb-prev").hidden = !multi; $("#lb-next").hidden = !multi;
    [lbPos + 1, lbPos - 1].forEach((j) => { new Image().src = GALLERY[lbSet[(j + lbSet.length) % lbSet.length]].full; });
  };
  const openLb = (set, pos, title, trigger) => {
    lbSet = set; lbTitle = title || ""; lastFocus = trigger;
    showLb(pos);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  };
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".g-item");
    if (b) openLb(GALLERY.map((_, i) => i), Number(b.dataset.index), "", b);
  });
  tourList.addEventListener("click", (e) => {
    const b = e.target.closest(".room__photo");
    if (!b) return;
    const r = ROOMS[Number(b.dataset.room)];
    openLb(r.photos.map((n) => byNo[n]), 0, r.name, b);
  });
  const closeLb = () => { if (lb.open) lb.close(); };
  lb.addEventListener("close", () => { document.body.style.overflow = ""; lastFocus && lastFocus.focus(); });
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", () => showLb(lbPos - 1));
  $("#lb-next").addEventListener("click", () => showLb(lbPos + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  lb.addEventListener("keydown", (e) => {
    if (lbSet.length < 2) return;
    if (e.key === "ArrowLeft") showLb(lbPos - 1);
    if (e.key === "ArrowRight") showLb(lbPos + 1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX == null || lbSet.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showLb(lbPos + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ------------------------------------------------------------------
     START
  ------------------------------------------------------------------ */
  requestAnimationFrame(() => root.classList.add("is-loaded"));
})();
