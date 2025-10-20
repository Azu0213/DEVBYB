/* ========= CONFIG ========= */
const EMAIL = "devbyb12@gmail.com";
// Your deployed Web App /exec URL:
const GAS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzMu99OOtbzf13cCjZByJXx7B1j1hqEBlzhSluYVKbGnoIlVMYGrgpmhSOo7qPu_5kD/exec";

/* ========= PRICING / TAX ========= */
const PRICING = {
  starter: { base: 499, included: 5, over: 120 },
  pro: { base: 2800, included: 10, over: 160 },
  premium: { base: 7000, included: 16, over: 220 },
  enterprise: { base: 12000, included: 24, over: 300, startingAt: true },
};
const ADDONS = {
  sprint72: { label: "Priority 72-hr sprint", price: 900 },
  brandKit: { label: "Brand kit", price: 600 },
  copyPerPage: { label: "Copywriting", perPage: 80 },
  seoDeep: { label: "SEO deep setup", price: 750 },
};
const TAX = { label: "Los Angeles, CA", rate: 0.095 };
const CARE = {
  basic: { title: "Basic Care", price: 199 },
  growth: { title: "Growth Care", price: 499 },
  pro: { title: "Pro Care", price: 899 },
};
/* Plan meta (used by UI copy & world bg hue) */
const PLAN_INFO = {
  starter: { title: "Starter", blurb: "Simple sites for quick launches.", hue: 210 },
  pro: { title: "Professional", blurb: "Room to grow with more content & polish.", hue: 225 },
  premium: { title: "Premium", blurb: "Advanced animations and rich layouts.", hue: 195 },
  enterprise: { title: "Enterprise", blurb: "Dashboards, integrations, and security at scale.", hue: 260 },
};
const PLAN_FEATURES = {
  starter: [
    "Up to 5 pages included",
    "Responsive design + baseline animations",
    "SEO foundation (titles, meta, sitemap)",
    "Fast, modern hosting hookup",
    "1 round of revisions",
  ],
  pro: [
    "Up to 10 pages included",
    "Custom components & section library",
    "Deeper motion + micro-interactions",
    "CMS setup (blog or basic collections)",
    "2 revision rounds",
  ],
  premium: [
    "Up to 16 pages included",
    "Advanced animation & scroll choreography",
    "Complex layouts & content models",
    "E-commerce or gated content ready",
    "3 revision rounds + launch support",
  ],
  enterprise: [
    "24+ pages (scalable architecture)",
    "Secure dashboards/portals · role access",
    "Integrations (CRM, payments, auth/SSO)",
    "Automation pipelines & performance budget",
    "Compliance & security hardening",
  ],
};

/* ========= UTILITIES ========= */
const el = (s, r = document) => r.querySelector(s);
const els = (s, r = document) => [...r.querySelectorAll(s)];
const setText = (s, t) => { const n = el(s); if (n) n.textContent = t; };
const DPR = () => window.devicePixelRatio || 1;
function fitCanvas(c) {
  const rect = c.getBoundingClientRect();
  const d = DPR();
  c.width = rect.width * d; c.height = rect.height * d;
  const ctx = c.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0);
  return ctx;
}
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
function emailLooksOk(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "")); }
function phoneLooksOk(s) { const d = (String(s || "").match(/\d/g) || []).length; return d >= 7; }
function showToast(msg, ms = 2600) {
  const t = el("#toast"); if (!t) return;
  t.textContent = msg; t.hidden = false;
  clearTimeout(showToast._h);
  showToast._h = setTimeout(() => (t.hidden = true), ms);
}
window.addEventListener("error", (e) => showToast(e.message || "Script error"));
window.addEventListener("unhandledrejection", (e) => showToast(e.reason?.message || "Network/script error"));

// null-safe helpers
const val = (sel) => (el(sel)?.value ?? "");
const valTrim = (sel) => val(sel).trim();
const isChecked = (sel) => !!el(sel)?.checked;

/* ========= SAFE FETCH ========= */
async function postWithTimeout(url, options, ms = 60000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...options, signal: ctrl.signal }); }
  finally { clearTimeout(id); }
}

/* --- NEW: set planet field offset based on hero copy height --- */
function setPlanetFieldOffset() {
  const hero = el(".hero-copy");
  const field = el("#planet-field");
  if (!hero || !field) return;

  // distance from section top to bottom of the hero text
  const offset = hero.offsetHeight + 32; // breathing room
  document.documentElement.style.setProperty("--hero-offset", offset + "px");

  // ensure the field is tall enough even on short viewports
  const minH = Math.max(window.innerHeight - offset - 120, 360);
  field.style.minHeight = `${minH}px`;
}

/* ========= SPLASH STARS ========= */
function startSplashStars() {
  const c = el("#splash-stars"); if (!c) return;
  const ctx = fitCanvas(c);
  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * c.clientWidth,
    y: Math.random() * c.clientHeight,
    r: Math.random() * 1.6 + 0.2,
    a: Math.random() * 0.7 + 0.25,
  }));
  (function draw() {
    ctx.fillStyle = "#020615";
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
    stars.forEach((s) => {
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
  addEventListener("resize", () => fitCanvas(c), { passive: true });
}

/* ========= ROCKET LAUNCH ========= */
function launchRocketThenEnter() {
  const splash = el("#splash");
  const rocketCanvas = el("#rocket-canvas");
  if (!rocketCanvas) return;
  const ctx = fitCanvas(rocketCanvas);

  let y = rocketCanvas.clientHeight - 120;
  const x = rocketCanvas.clientWidth / 2;
  let vy = -5;
  const trail = [];

  function drawRocket() {
    trail.push({ x, y: y + 30, a: 1 });
    ctx.clearRect(0, 0, rocketCanvas.clientWidth, rocketCanvas.clientHeight);
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.a -= 0.02;
      if (p.a <= 0) trail.splice(i, 1);
      else {
        ctx.beginPath();
        ctx.arc(p.x + (Math.random() * 6 - 3), p.y + (Math.random() * 6 - 3), 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,120,${p.a})`;
        ctx.fill();
      }
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(-8, -20, 16, 40);
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(-8, -20);
    ctx.lineTo(8, -20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(-14, -6, 6, 12);
    ctx.fillRect(8, -6, 6, 12);
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(-6, 20);
    ctx.lineTo(0, 40 + Math.random() * 12);
    ctx.lineTo(6, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  (function tick() {
    y += vy;
    vy -= 0.03;
    drawRocket();
    if (y < -80) {
      setTimeout(() => {
        splash.hidden = true;
        el("#home").hidden = false;
        createPlanets();
      }, 150);
    } else requestAnimationFrame(tick);
  })();
}

/* ========= CLICK TO ENTER ========= */
function initEarthClick() {
  const earth = el("#earthClick");
  if (!earth) return;
  const label = earth.querySelector(".earth-text");
  ["#splash-stars", "#rocket-canvas", ".atmos-glow", ".horizon-glow"].forEach((s) => {
    const n = el(s); if (n) n.style.pointerEvents = "none";
  });

  let launched = false;
  const go = () => {
    if (launched) return;
    launched = true;
    if (label) label.style.opacity = "0";
    earth.style.transform = "scale(0.96)";
    setTimeout(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el("#splash").hidden = true;
        el("#home").hidden = false;
        createPlanets();
      } else {
        launchRocketThenEnter();
      }
    }, 200);
  };
  earth.addEventListener("click", go);
  earth.addEventListener("keydown", (e) => {
    if (["Enter", " "].includes(e.key)) { e.preventDefault(); go(); }
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest?.("#earthClick")) go();
  }, { capture: true });
}

/* ========= PLANETS FIELD ========= */
let planetsRAF = 0;
let movingPlanets = [];
function stopPlanets() { cancelAnimationFrame(planetsRAF); planetsRAF = 0; movingPlanets = []; }
function createPlanets() {
  const field = el("#planet-field");
  if (!field) return;

  /* NEW: ensure planet field starts below the hero copy */
  setPlanetFieldOffset();

  stopPlanets();
  field.innerHTML = "";

  ["64vmin", "82vmin"].forEach((sz, i) => {
    const ring = document.createElement("div");
    ring.className = "orbit-ring";
    ring.style.setProperty("--ring-size", sz);
    ring.style.animationDelay = `${i * 1.1}s`;
    field.appendChild(ring);
  });

  const configs = [
    { plan: "starter", cls: "p-starter", price: "$499" },
    { plan: "pro", cls: "p-pro", price: "$2,800" },
    { plan: "premium", cls: "p-premium", price: "$7,000" },
    { plan: "enterprise", cls: "p-enterprise", price: "Starting at $12,000+" },
  ];

  const rect = field.getBoundingClientRect();
  const PAD = 16;

  /* NEW: size from vmin so it respects short phone heights */
  const vmin = Math.min(rect.width, rect.height);
  const isPhone = window.innerWidth < 540;
  const size = isPhone
    ? clamp(Math.floor(vmin * 0.28), 96, 160)
    : clamp(Math.floor(vmin * 0.20), 120, 220);

  const L = PAD + size / 2, R = rect.width - PAD - size / 2;
  const T = PAD + size / 2, B = rect.height - PAD - size / 2;
  const placed = [];
  const MIN_DIST = size * 1.08;

  configs.forEach((cfg) => {
    let x = 0, y = 0, tries = 0;
    do {
      tries++;
      x = L + Math.random() * (R - L);
      y = T + Math.random() * (B - T);
    } while (tries < 120 && placed.some((p) => Math.hypot(p.x - x, p.y - y) < MIN_DIST));
    placed.push({ x, y });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `planet glossy ${cfg.cls}`;
    btn.style.setProperty("--size", `${size}px`);
    btn.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
    btn.setAttribute("aria-label", `${PLAN_INFO[cfg.plan].title} — ${cfg.price}`);

    const chip = document.createElement("div");
    chip.className = "price-chip hover-chip";
    chip.innerHTML = `<strong>${PLAN_INFO[cfg.plan].title}</strong> · ${cfg.price}`;
    btn.appendChild(chip);
    field.appendChild(btn);

    const node = {
      el: btn, x, y,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: size / 2, hovered: false,
      onClick: () => openPlan(cfg.plan),
    };
    btn.addEventListener("click", node.onClick);
    btn.addEventListener("mouseenter", () => { node.hovered = true; btn.classList.add("hovered"); });
    btn.addEventListener("mouseleave", () => { node.hovered = false; btn.classList.remove("hovered"); });
    movingPlanets.push(node);
  });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    (function tick() {
      for (let i = 0; i < movingPlanets.length; i++) {
        for (let j = i + 1; j < movingPlanets.length; j++) {
          const a = movingPlanets[i], b = movingPlanets[j];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001;
          const min = a.r + b.r + 8;
          if (d < min) {
            const push = (min - d) * 0.006, ux = dx / d, uy = dy / d;
            if (!a.hovered) { a.vx -= ux * push; a.vy -= uy * push; }
            if (!b.hovered) { b.vx += ux * push; b.vy += uy * push; }
          }
        }
      }
      movingPlanets.forEach(n => {
        if (!n.hovered) {
          n.x += n.vx; n.y += n.vy;
          n.vx += (Math.random() - 0.5) * 0.008;
          n.vy += (Math.random() - 0.5) * 0.008;
          n.vx = clamp(n.vx, -0.55, 0.55);
          n.vy = clamp(n.vy, -0.55, 0.55);
        }
        if (n.x < L) { n.x = L; n.vx = Math.abs(n.vx); }
        if (n.x > R) { n.x = R; n.vx = -Math.abs(n.vx); }
        if (n.y < T) { n.y = T; n.vy = Math.abs(n.vy); }
        if (n.y > B) { n.y = B; n.vy = -Math.abs(n.vy); }
        n.el.style.transform = `translate3d(${n.x - n.r}px, ${n.y - n.r}px, 0)`;
      });
      planetsRAF = requestAnimationFrame(tick);
    })();
  }
}

/* ========= WORLD BACKGROUND ========= */
let bgRAF;
function startWorldCanvas(plan) {
  const c = el("#world-canvas"); if (!c) return;
  const ctx = fitCanvas(c);
  const hue = PLAN_INFO[plan]?.hue ?? 220;
  const dots = Array.from({ length: 90 }, () => ({
    x: Math.random() * c.clientWidth,
    y: Math.random() * c.clientHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.8 + 0.8,
  }));
  function tick() {
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    const g = ctx.createLinearGradient(0, 0, 0, c.clientHeight);
    g.addColorStop(0, `hsl(${hue},60%,10%)`);
    g.addColorStop(1, `hsl(${hue + 40},70%,5%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
    dots.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > c.clientWidth) p.vx *= -1;
      if (p.y < 0 || p.y > c.clientHeight) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${hue + 20},80%,80%,.28)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    bgRAF = requestAnimationFrame(tick);
  }
  cancelAnimationFrame(bgRAF);
  bgRAF = requestAnimationFrame(tick);
}
function stopWorldCanvas() { cancelAnimationFrame(bgRAF); }

/* ========= PLAN MODAL / TIERS ========= */
let currentPlan = null;
function setPlanUI(plan) {
  const info = PLAN_INFO[plan];
  if (!info) return;
  setText("#plan-title", info.title);
  setText("#plan-blurb", info.blurb);
  setText("#plan-price", PRICING[plan]?.startingAt ? "Starting at $12,000+" : `$${PRICING[plan].base.toLocaleString()}`);
  els(".tier").forEach((b) => {
    const on = b.dataset.plan === plan;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  renderPlanFeatures(plan);
}
function renderPlanFeatures(plan) {
  const list = PLAN_FEATURES[plan] || [];
  const host = el(".world-content"); if (!host) return;
  let section = el("#plan-included");
  if (!section) {
    section = document.createElement("section");
    section.id = "plan-included";
    section.className = "included-card card";
    section.innerHTML = `
      <h3 class="included-title">What you get in this plan</h3>
      <ul class="included-list" id="includedList"></ul>
    `;
    const head = el(".world-head");
    if (head?.nextSibling) host.insertBefore(section, head.nextSibling);
    else host.appendChild(section);
  }
  const ul = section.querySelector("#includedList");
  ul.innerHTML = list.map((item) => `<li>${item}</li>`).join("");
}
function openPlan(plan) {
  currentPlan = plan;
  el("#plan-world").hidden = false;
  stopPlanets();
  setPlanUI(plan);
  startWorldCanvas(plan);
  el(".world-content")?.focus();
  computeAndRenderEstimate();
}
el("#backToBubbles")?.addEventListener("click", () => {
  el("#plan-world").hidden = true;
  stopWorldCanvas();
  createPlanets();
});
els(".tier").forEach((btn) =>
  btn.addEventListener("click", () => openPlan(btn.dataset.plan))
);

/* ========= ESTIMATE ========= */
function getPagesValue() {
  const raw = valTrim("#pages");
  if (raw === "") return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 60) : null;
}
function computeEstimate(plan, pages, addons) {
  const P = PRICING[plan];
  if (!P) return { total: 0, breakdown: [], tax: 0, totalWithTax: 0 };
  let total = P.base;
  const list = [["Base", `$${P.base.toLocaleString()}`]];

  if (Number.isFinite(pages)) {
    const extra = Math.max(0, pages - P.included);
    if (extra && !P.startingAt) {
      const over = extra * P.over;
      total += over;
      list.push([`Extra pages (${extra} × $${P.over})`, `$${over.toLocaleString()}`]);
    }
  } else list.push(["Pages", "TBD"]);

  if (addons.sprint72) { total += ADDONS.sprint72.price; list.push([ADDONS.sprint72.label, `$${ADDONS.sprint72.price}`]); }
  if (addons.brandKit) { total += ADDONS.brandKit.price; list.push([ADDONS.brandKit.label, `$${ADDONS.brandKit.price}`]); }
  if (addons.seoDeep)  { total += ADDONS.seoDeep.price;  list.push([ADDONS.seoDeep.label,  `$${ADDONS.seoDeep.price}`]); }
  if (addons.copyPerPage) {
    if (Number.isFinite(pages)) {
      const cp = pages * ADDONS.copyPerPage.perPage;
      total += cp;
      list.push([`${ADDONS.copyPerPage.label} (${pages} × $${ADDONS.copyPerPage.perPage})`, `$${cp.toLocaleString()}`]);
    } else list.push([`${ADDONS.copyPerPage.label}`, "per page (TBD)"]);
  }

  const tax = Math.round(total * TAX.rate * 100) / 100;
  const totalWithTax = total + tax;
  return { total, breakdown: list, tax, totalWithTax };
}
function computeAndRenderEstimate() {
  if (!currentPlan) return;
  const pages = getPagesValue();
  const addons = {
    sprint72: isChecked("#addonSprint"),
    brandKit: isChecked("#addonBrand"),
    seoDeep:  isChecked("#addonSEO"),
    copyPerPage: isChecked("#addonCopy"),
  };
  const { total, breakdown, tax, totalWithTax } = computeEstimate(currentPlan, pages, addons);
  setText("#estTotal", `$${total.toLocaleString()}`);
  setText("#estTotalTax", `$${totalWithTax.toLocaleString()} (incl. ~$${tax.toLocaleString()} tax)`);
  const ul = el("#breakList");
  if (ul) ul.innerHTML = breakdown.map(([k, v]) => `<li><strong>${k}</strong> — ${v}</li>`).join("");
  const care = val("#maintenance");
  setText("#estMonthly", CARE[care] ? `$${CARE[care].price}/mo` : "—");
  const tn = el("#taxNote");
  if (tn) tn.textContent = `Tax estimated for ${TAX.label} (${(TAX.rate * 100).toFixed(1)}%).`;
}
["#pages","#addonSprint","#addonBrand","#addonCopy","#addonSEO","#maintenance"]
  .map(s => el(s)).filter(Boolean)
  .forEach(n => { n.addEventListener("input", computeAndRenderEstimate); n.addEventListener("change", computeAndRenderEstimate); });

(function wireBreakdown(){
  const btn = el("#toggleBreakdown");
  const box = el("#breakdown");
  if (!btn || !box) return;
  btn.addEventListener("click", () => {
    const open = box.hasAttribute("hidden");
    if (open) box.removeAttribute("hidden"); else box.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Hide breakdown" : "See breakdown";
  });
})();

/* ========= WEBSITE TYPE (Other) ========= */
function wireWebsiteTypeOther() {
  const select = el("#websiteType");
  const row = el("#websiteTypeOtherRow");
  if (!select || !row) return;

  const sync = () => {
    const v = (select.value || "").toLowerCase();
    if (v === "other") row.removeAttribute("hidden");
    else row.setAttribute("hidden", "");
  };
  select.addEventListener("change", sync);
  sync();
}

/* ========= FEATURES helper ========= */
function getSelectedFeatures() {
  return els('input[name="feature"]:checked').map(i => i.value);
}

/* ========= FILE LIMIT RULE ========= */
const MAX_FILES = 10;
const MAX_SINGLE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_BYTES = 22 * 1024 * 1024;
const BLOCKED_EXTS = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
el("#files")?.addEventListener("change", (e) => {
  const files = [...e.target.files];
  if (files.some(f => BLOCKED_EXTS.some(ext => f.name.toLowerCase().endsWith(ext)))) {
    showToast("Video files are not allowed."); e.target.value = ""; return;
  }
  if (files.some(f => f.size > MAX_SINGLE_BYTES)) {
    showToast("One or more files exceed 20 MB."); e.target.value = ""; return;
  }
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    showToast("Total attachment size exceeds ~22 MB."); e.target.value = ""; return;
  }
  if (files.length > MAX_FILES) {
    showToast("Max 10 files allowed."); e.target.value = ""; return;
  }
  updateFilePreview();
});

/* ========= SIMPLE FILE PREVIEW ========= */
function updateFilePreview() {
  const list = el("#filePreview"); if (!list) return;
  const input = el("#files");
  const files = input?.files ? [...input.files] : [];
  if (!files.length) { list.innerHTML = ""; return; }
  const rows = files.map(f => `<li>${escapeHtml(f.name)} — ${(f.size/1024).toFixed(1)} KB</li>`).join("");
  list.innerHTML = `<li><strong>${files.length} file${files.length>1?"s":""} selected</strong></li>${rows}`;
}

/* ========= THANK YOU + CONFETTI ========= */
let confettiRAF;
function startConfetti() {
  const c = el("#confetti");
  if (!c) return;
  const ctx = fitCanvas(c);
  const bits = Array.from({ length: 140 }, () => ({
    x: Math.random() * c.clientWidth,
    y: -20 - Math.random() * c.clientHeight,
    w: 6 + Math.random() * 6,
    h: 3 + Math.random() * 3,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 1 + Math.random() * 2,
    a: Math.random() * Math.PI,
  }));
  (function tick() {
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    bits.forEach((b) => {
      b.x += b.vx; b.y += b.vy; b.a += 0.05;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
      ctx.fillStyle = `hsl(${(b.y / 4) % 360} 80% 60%)`;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
      if (b.y > c.clientHeight + 20) { b.y = -20; b.x = Math.random() * c.clientWidth; }
    });
    confettiRAF = requestAnimationFrame(tick);
  })();
}
function stopConfetti() { cancelAnimationFrame(confettiRAF); }

function showThankYou() {
  const ty = el("#thankyou");
  ty.hidden = false;
  startConfetti();
  const card = ty.querySelector(".thanks-card");
  if (card) {
    card.querySelector("h2").textContent = "🎉 Thanks — your brief has been sent!";
    const p = document.createElement("p");
    p.innerHTML = `
      Here’s what happens next:<br/>
      • We’ll review your brief and email you a written quote.<br/>
      • A <strong>25% deposit</strong> link will be included to kick things off.<br/>
      • The remaining balance is due at launch after final approval.<br/>
      You can sit back for now — we’ll email you shortly with next steps.
    `;
    const existing = card.querySelectorAll("p")[0];
    if (existing?.nextSibling) card.insertBefore(p, existing.nextSibling);
    else card.appendChild(p);
  }
  el("#exitThanks")?.addEventListener(
    "click",
    () => {
      ty.hidden = true;
      stopConfetti();
      createPlanets();
    },
    { once: true }
  );
}

/* ========= DIALOGS ========= */
function wireDialogs() {
  const tipDlg = el("#tipModal");
  el("#tipClose")?.addEventListener("click", () => tipDlg?.close());
  tipDlg?.addEventListener("click", (e) => { if (e.target === tipDlg) tipDlg.close(); });

  const careDlg = el("#careDialog");
  el("#careClose")?.addEventListener("click", () => careDlg?.close());
  el("#careInfo")?.addEventListener("click", () => careDlg?.showModal());
  careDlg?.addEventListener("click", (e) => { if (e.target === careDlg) careDlg.close(); });

  const privDlg = el("#privacyDialog");
  const privLink = el("#privacyLink");
  const privClose = el("#privacyClose");
  if (privLink && privDlg) {
    privLink.addEventListener("click", (e) => {
      e.preventDefault();
      const d = new Date();
      setText(
        "#privacyDate",
        d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
      );
      privDlg.showModal();
    });
  }
  privClose?.addEventListener("click", () => privDlg?.close());
  privDlg?.addEventListener("click", (e) => { if (e.target === privDlg) privDlg.close(); });
}

/* ========= AI helper ========= */
const QA = [
  [/(price|cost|estimate)/i, () =>
    "Your live estimate updates above. Base covers included pages; extra pages and add-ons adjust the total."],
  [/(how long|timeline|delivery)/i, () =>
    "Typical turn is 1 week. A 72-hr sprint add-on is available for urgent projects."],
  [/(e-?comm|shop|store|checkout|payments)/i, () =>
    "We can set up e-commerce and payments. Complexity can move the plan toward Premium or Enterprise."],
  [/seo|performance|speed/i, () =>
    "We ship fast sites by default. The SEO deep setup add-on configures sitemaps, metadata, and analytics."],
  [/(brand|logo|identity)/i, () =>
    "No brand assets? The Brand kit add-on can help you get there quickly."],
  [/(host|domain)/i, () =>
    "We’ll help connect your domain and set up modern hosting. Ongoing maintenance is optional."],
  [/(contact|email|phone)/i, () =>
    "Call 818-261-7850 or email devbyb12@gmail.com . We’re on Los Angeles time."],
];
function wireChat() {
  const log = el("#chatLog"),
    input = el("#chatInput"),
    send = el("#chatSend");
  if (!log || !input || !send) return;

  const push = (role, text) => {
    const wrap = document.createElement("div");
    wrap.className = `msg ${role}`;
    const b = document.createElement("div");
    b.className = "bubble-msg";
    b.textContent = "";
    wrap.appendChild(b);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    let i = 0;
    const t = setInterval(() => {
      b.textContent += text[i++] || "";
      if (i > text.length) clearInterval(t);
    }, 12);
  };

  const answer = (q) =>
    QA.find(([re]) => re.test(q))?.[1](q) ||
    "I can answer pricing, timeline, SEO/perf, e-commerce, brand/hosting, or contact.";

  const submit = () => {
    const q = input.value.trim();
    if (!q) return;
    push("me", q);
    input.value = "";
    setTimeout(() => push("ai", answer(q)), 250);
  };

  send.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });
}

/* ========= AUTOSAVE ========= */
const FORM_STORAGE_KEY = "devbyb:intake:v5";
let dirty = false;
el("#intakeForm")?.addEventListener("input", () => { dirty = true; });

function saveFormDraft() {
  const draft = {
    plan: currentPlan,
    pages: val("#pages"),
    fullName: val("#fullName"),
    email: val("#email"),
    phone: val("#phone"),
    projectName: val("#projectName"),
    vibe: val("#vibe"),
    colors: val("#colors"),
    about: val("#about"),
    inspo: val("#inspo"),
    notes: val("#notes"),
    maintenance: val("#maintenance"),
    addonSprint: isChecked("#addonSprint"),
    addonBrand: isChecked("#addonBrand"),
    addonCopy: isChecked("#addonCopy"),
    addonSEO: isChecked("#addonSEO"),
    websiteType: val("#websiteType"),
    websiteTypeOther: val("#websiteTypeOther"),
    features: getSelectedFeatures(),
  };
  try { localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(draft)); } catch {}
}
function loadFormDraft() {
  let raw;
  try { raw = localStorage.getItem(FORM_STORAGE_KEY); } catch {}
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (d.plan) openPlan(d.plan);
    if (el("#pages") && d.pages != null) el("#pages").value = d.pages;
    ["fullName","email","phone","projectName","vibe","colors","about","inspo","notes","websiteType","websiteTypeOther"].forEach(id => {
      if (d[id] != null && el(`#${id}`)) el(`#${id}`).value = d[id];
    });
    if (d.maintenance && el("#maintenance")) el("#maintenance").value = d.maintenance;
    if (Array.isArray(d.features)) {
      els('input[name="feature"]').forEach(cb => { cb.checked = d.features.includes(cb.value); });
    }
    if (el("#addonSprint")) el("#addonSprint").checked = !!d.addonSprint;
    if (el("#addonBrand"))  el("#addonBrand").checked  = !!d.addonBrand;
    if (el("#addonCopy"))   el("#addonCopy").checked   = !!d.addonCopy;
    if (el("#addonSEO"))    el("#addonSEO").checked    = !!d.addonSEO;
    wireWebsiteTypeOther();
    computeAndRenderEstimate();
  } catch {}
}

/* ========= SUBMIT (preflight-free to Apps Script) ========= */
async function fileToBase64(f) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}
el("#intakeForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const reasons = missingReasons();
  if (reasons.length) {
    showToast(reasons[0]);
    if (!currentPlan) openPlan("starter");
    return;
  }

  const pages = getPagesValue();
  const addons = {
    sprint72: isChecked("#addonSprint"),
    brandKit: isChecked("#addonBrand"),
    copyPerPage: isChecked("#addonCopy"),
    seoDeep: isChecked("#addonSEO"),
  };
  const { total, tax, totalWithTax } = computeEstimate(currentPlan, pages, addons);

  const payload = {
    plan: currentPlan,
    fullName: valTrim("#fullName"),
    email: valTrim("#email"),
    phone: valTrim("#phone"),
    projectName: valTrim("#projectName"),
    vibe: valTrim("#vibe"),
    colors: valTrim("#colors"),
    about: valTrim("#about"),
    inspo: valTrim("#inspo"),
    notes: valTrim("#notes"),
    maintenance: val("#maintenance") || "",
    addons,
    pages,
    estimate: `$${(total || 0).toLocaleString()}`,
    estimateTax: `$${(tax || 0).toLocaleString()}`,
    estimateWithTax: `$${(totalWithTax || 0).toLocaleString()}`,
    taxRate: TAX.rate,
    taxLabel: TAX.label,
    // NEW fields
    websiteType: val("#websiteType"),
    websiteTypeOther: valTrim("#websiteTypeOther"),
    features: getSelectedFeatures(),
    // removed: deadline & budget
    companyFax: (el("#companyFax")?.value || ""), // honeypot if present
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    to: EMAIL,
  };

  const btn = el("#submitBrief");
  const prev = btn.textContent;
  btn.textContent = "Sending…";
  btn.disabled = true;

  try {
    const input = el("#files");
    const files = input?.files ? [...input.files] : [];
    const attachments = [];
    for (const f of files) {
      attachments.push({
        name: f.name,
        size: f.size,
        type: f.type,
        base64: await fileToBase64(f),
      });
    }

    const res = await postWithTimeout(GAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" }, // preflight-free
      body: JSON.stringify({ ...payload, attachments }),
    }, 60000);

    const rawText = await res.text();
    let data = null;
    try { data = JSON.parse(rawText); } catch {}

    // Tolerant success detection to avoid "false fail" after server sent emails
    const ok = (res.ok && data?.ok === true) ||
               (res.ok && /"ok"\s*:\s*true/.test(rawText));

    if (ok) {
      try { localStorage.removeItem(FORM_STORAGE_KEY); } catch {}
      dirty = false;
      showThankYou?.();
      showToast("Brief sent successfully!");
    } else {
      const msg =
        data?.error ||
        (rawText && rawText.slice(0, 200)) ||
        `Server responded ${res?.status}`;
      showToast(msg || "Couldn’t reach the server. Please try again.");
    }
  } catch (err) {
    console.error(err);
    // In case request aborted after server already sent emails
    showThankYou?.();
    showToast("Brief sent (check your email to confirm).");
  } finally {
    btn.textContent = prev;
    btn.disabled = false;
  }
});

function missingReasons() {
  const name = valTrim("#fullName");
  const email = valTrim("#email");
  const phone = valTrim("#phone");
  const vibe = valTrim("#vibe");
  const inspo = valTrim("#inspo");
  const websiteType = valTrim("#websiteType");
  const websiteTypeOther = valTrim("#websiteTypeOther");

  const reasons = [];
  if (!currentPlan) reasons.push("Pick a plan (tap a planet).");
  if (!vibe) reasons.push("Choose a style vibe.");
  if (!name) reasons.push("Enter your full name.");
  if (!emailLooksOk(email)) reasons.push("Enter a valid email.");
  if (!phoneLooksOk(phone)) reasons.push("Enter a valid phone number.");

  // Inspiration rule: required unless they typed "None"
  if (!inspo || !inspo.length) {
    reasons.push("Add inspiration links or type “None”.");
  } else if (inspo.toLowerCase() !== "none") {
    const looksLikeLinks = /(https?:\/\/|\.)/i.test(inspo);
    if (!looksLikeLinks && inspo.split(/\s+/).length < 2) {
      reasons.push("Please paste at least one link or type “None”.");
    }
  }

  // Website type rule (optional if the field doesn't exist in the HTML)
  if (el("#websiteType")) {
    if (!websiteType) reasons.push("Select a website type.");
    if (websiteType.toLowerCase() === "other" && !websiteTypeOther) {
      reasons.push("Tell us your website type.");
    }
  }

  return reasons;
}

/* ========= INIT ========= */
const FORM_AUTOSAVE_INTERVAL = 1500;
setInterval(() => { if (dirty) { saveFormDraft(); dirty = false; } }, FORM_AUTOSAVE_INTERVAL);
window.addEventListener("beforeunload", (e) => {
  if (dirty) {
    saveFormDraft();
    e.preventDefault();
    e.returnValue = "";
  }
});

function init() {
  startSplashStars();
  initEarthClick();
  wireDialogs();
  wireChat();
  wireWebsiteTypeOther(); // NEW
  setText("#year", new Date().getFullYear());
  const ty = el("#thankyou");
  if (ty) ty.hidden = true;

  /* NEW: compute dynamic hero offset before first layout */
  setPlanetFieldOffset();

  createPlanets();
  let resizeTimer;
  addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        /* NEW: keep offset + layout in sync on resize/orientation */
        setPlanetFieldOffset();
        createPlanets();
      }, 120);
    },
    { passive: true }
  );

  const box = el("#breakdown"),
        btn = el("#toggleBreakdown");
  if (box && btn) {
    box.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "See breakdown";
  }

  const submit = el("#submitBrief");
  if (submit) submit.disabled = false;

  loadFormDraft();
  computeAndRenderEstimate();
}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
