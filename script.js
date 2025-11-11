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
  update: { base: 0, included: 0, over: 0, isUpdate: true },
};
const ADDONS = {
  sprint72: { label: "Priority 72-hr sprint", price: 900 },
  brandKit: { label: "Brand kit", price: 600 },
  copyPerPage: { label: "Copywriting", perPage: 80 },
  seoDeep: { label: "SEO deep setup", price: 750 },
  aiChat: { label: "AI Chat / Chatbot", price: null, priceLabel: "Custom (scope-dependent)" },
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
  update: { title: "Update Website", blurb: "Improve, enhance, or refresh your existing website.", hue: 180 },
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
  update: [
    "Audit your existing website",
    "Custom quote based on your upgrade needs",
    "Can include: redesign, new features, performance optimization, SEO improvements, AI integration, mobile optimization, etc.",
    "Flexible scope - tell us what you want upgraded",
    "Same quality standards as new builds",
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
  
  // Generate stars with relative positions (0-1 range) instead of fixed pixels
  const stars = Array.from({ length: 200 }, () => ({
    xRatio: Math.random(), // Position as ratio 0-1
    yRatio: Math.random(), // Position as ratio 0-1
    r: Math.random() * 1.6 + 0.2,
    a: Math.random() * 0.7 + 0.25,
  }));
  
  (function draw() {
    ctx.fillStyle = "#020615";
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
    stars.forEach((s) => {
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      // Calculate actual position based on current canvas size
      const x = s.xRatio * c.clientWidth;
      const y = s.yRatio * c.clientHeight;
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
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
    { plan: "update", cls: "p-update", price: "N/A — Custom" },
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
  
  // Special handling for update plan
  if (PRICING[plan]?.isUpdate) {
    setText("#plan-price", "N/A — Custom quote based on your upgrade needs");
  } else {
    setText("#plan-price", PRICING[plan]?.startingAt ? "Starting at $12,000+" : `$${PRICING[plan].base.toLocaleString()}`);
  }
  
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
  
  // Special handling for update plan
  if (P.isUpdate) {
    const list = [["Base Quote", "Custom — based on upgrades selected below"]];
    
    if (addons.sprint72) { list.push([ADDONS.sprint72.label, `$${ADDONS.sprint72.price}`]); }
    if (addons.brandKit) { list.push([ADDONS.brandKit.label, `$${ADDONS.brandKit.price}`]); }
    if (addons.seoDeep)  { list.push([ADDONS.seoDeep.label,  `$${ADDONS.seoDeep.price}`]); }
    if (addons.aiChat)   { list.push([ADDONS.aiChat.label, ADDONS.aiChat.priceLabel]); }
    if (addons.copyPerPage) { list.push([`${ADDONS.copyPerPage.label}`, "Custom quote"]); }
    
    list.push(["", "— Describe your upgrade needs in the form below —"]);
    list.push(["", "— We'll provide a detailed quote within 24 hours —"]);
    
    return { total: 0, breakdown: list, tax: 0, totalWithTax: 0, isCustom: true };
  }
  
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
  if (addons.aiChat)   { list.push([ADDONS.aiChat.label, ADDONS.aiChat.priceLabel]); }
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
    aiChat: isChecked("#addonAIChat"),
  };
  const { total, breakdown, tax, totalWithTax, isCustom } = computeEstimate(currentPlan, pages, addons);
  
  if (isCustom) {
    setText("#estTotal", "Custom Quote");
    setText("#estTotalTax", "We'll provide a detailed quote within 24 hours based on your needs");
  } else {
    setText("#estTotal", `$${total.toLocaleString()}`);
    setText("#estTotalTax", `$${totalWithTax.toLocaleString()} (incl. ~$${tax.toLocaleString()} tax)`);
  }
  
  const ul = el("#breakList");
  if (ul) ul.innerHTML = breakdown.map(([k, v]) => `<li><strong>${k}</strong> — ${v}</li>`).join("");
  const care = val("#maintenance");
  setText("#estMonthly", CARE[care] ? `$${CARE[care].price}/mo` : "—");
  const tn = el("#taxNote");
  if (tn) tn.textContent = `Tax estimated for ${TAX.label} (${(TAX.rate * 100).toFixed(1)}%).`;
}
["#pages","#addonSprint","#addonBrand","#addonCopy","#addonSEO","#addonAIChat","#maintenance"]
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
const COMPREHENSIVE_KNOWLEDGE = {
  // Core business info
  pricing: {
    starter: { base: 499, pages: 5, extra: 120, features: ["Responsive design", "Baseline animations", "SEO foundation", "Modern hosting", "1 revision round"] },
    pro: { base: 2800, pages: 10, extra: 160, features: ["Custom components", "Deep animations", "CMS setup", "Blog ready", "2 revision rounds"] },
    premium: { base: 7000, pages: 16, extra: 220, features: ["Advanced scroll effects", "Complex layouts", "E-commerce ready", "Gated content", "3 revision rounds"] },
    enterprise: { base: 12000, pages: 24, extra: 300, features: ["Secure dashboards", "Integrations (CRM, SSO)", "Automation pipelines", "Compliance ready", "Dedicated support"] },
    update: { base: "Custom", description: "For existing websites that need improvements, upgrades, or redesigns. Pricing is custom based on scope." }
  },
  addons: {
    sprint72: { price: 900, description: "Priority 72-hour sprint delivery for urgent projects" },
    brandKit: { price: 600, description: "Complete brand identity including logo, colors, and typography" },
    copywriting: { price: 80, description: "Professional copywriting per page" },
    seoDeep: { price: 750, description: "Advanced SEO setup with sitemaps, schema markup, and analytics" },
    aiChat: { price: "Custom", description: "AI chatbot/assistant for your website - pricing depends on complexity, features, and training scope" }
  },
  care: {
    basic: { price: 199, features: ["Monthly updates", "Bug fixes", "Security patches"] },
    growth: { price: 499, features: ["Content updates", "Performance optimization", "Monthly analytics"] },
    pro: { price: 899, features: ["Feature additions", "A/B testing", "Priority support", "Strategic consulting"] }
  },
  // Business rules & policies
  rules: {
    deposit: "25% upfront to start",
    finalPayment: "75% before launch",
    delivery: "1 week standard, 72-hour sprint available",
    revisions: { starter: 1, pro: 2, premium: 3, enterprise: "unlimited" },
    ownership: "Client owns all code and assets",
    hosting: "Setup included, ongoing hosting optional",
    support: "Post-launch support via Care plans (optional)",
    paymentMethods: ["Credit card", "Bank transfer", "Business check", "ACH"],
    projectMinimum: "$499 (Starter plan)",
    customQuotes: "Enterprise and complex projects get custom quotes after consultation"
  },
  contact: { phone: "818-261-7850", email: "devbyb12@gmail.com", timezone: "Los Angeles (PST/PDT)" },
  delivery: { standard: "1 week", sprint: "72 hours (with add-on)" },
  tax: { location: "Los Angeles, CA", rate: 9.5 }
};

const QA = [
  // Update/Existing Website questions
  [/(update|upgrade|improve|existing|already have|current website|redesign|refresh|modify|enhance|fix|revamp)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.match(/how much|cost|price|pricing/i)) {
      return `For existing website updates, we offer the **Update Website plan** with **custom pricing (N/A until we assess your needs)**.\n\n**How it works:**\n1. Select the "Update Website" planet above\n2. Tell us what you want upgraded in the form\n3. We'll audit your current site\n4. You'll receive a detailed custom quote within 24 hours\n\n**Common upgrades we do:**\n• Complete redesigns\n• New feature additions (AI chat, e-commerce, booking, etc.)\n• Performance & speed optimization\n• Mobile responsiveness fixes\n• SEO improvements\n• Security updates\n• CMS migration\n• Integration additions\n• Accessibility compliance\n\nPricing depends on scope - could be anywhere from $500 for minor fixes to $8,000+ for major overhauls. Click the "Update Website" planet to get started!`;
    }
    return `Already have a website that needs improvement? Perfect! We offer the **Update Website plan**:\n\n**What we can do:**\n✨ Complete redesigns & refreshes\n🚀 Performance & speed optimization\n📱 Mobile responsiveness fixes\n🤖 Add AI chat or new features\n🛒 Add e-commerce capabilities\n🔍 SEO improvements & analytics\n🔒 Security updates & compliance\n💼 CMS setup or migration\n🔗 New integrations (CRM, payments, etc.)\n\n**Pricing:** Custom (N/A) - based on what you need upgraded\n\n**Process:**\n1. Select "Update Website" plan above\n2. Describe current issues & desired improvements\n3. We audit your site & provide detailed quote (24 hrs)\n4. Approve quote → we get to work!\n\nSame quality & speed as new builds. What needs upgrading?`;
  }],
  
  // Pricing questions (handles many variations)
  [/(price|pricing|cost|costs|charge|fee|rate|expensive|cheap|affordable|budget|how much|what.*pay|quote)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.match(/update|upgrade|existing|improve|current/i)) return `For existing website updates, pricing is **custom (N/A)** until we assess your needs. Could range from $500 for minor fixes to $8,000+ for major redesigns. Select the "Update Website" planet above and describe what you need - we'll provide a detailed quote within 24 hours!`;
    if (lower.match(/starter|simple|basic|small|cheapest|minimum/i)) return `Starter plan is $${COMPREHENSIVE_KNOWLEDGE.pricing.starter.base} for up to ${COMPREHENSIVE_KNOWLEDGE.pricing.starter.pages} pages. Additional pages are $${COMPREHENSIVE_KNOWLEDGE.pricing.starter.extra} each. Great for simple sites and quick launches. 25% deposit ($${Math.round(COMPREHENSIVE_KNOWLEDGE.pricing.starter.base * 0.25)}) to start!`;
    if (lower.match(/pro|professional|medium|mid|middle/i)) return `Professional plan is $${COMPREHENSIVE_KNOWLEDGE.pricing.pro.base} for up to ${COMPREHENSIVE_KNOWLEDGE.pricing.pro.pages} pages. Extra pages are $${COMPREHENSIVE_KNOWLEDGE.pricing.pro.extra} each. Includes CMS setup and deeper animations. 25% deposit ($${Math.round(COMPREHENSIVE_KNOWLEDGE.pricing.pro.base * 0.25)}) to start!`;
    if (lower.match(/premium|advanced|high-end|top tier/i)) return `Premium plan is $${COMPREHENSIVE_KNOWLEDGE.pricing.premium.base} for up to ${COMPREHENSIVE_KNOWLEDGE.pricing.premium.pages} pages. Extra pages are $${COMPREHENSIVE_KNOWLEDGE.pricing.premium.extra} each. Perfect for advanced animations and e-commerce. 25% deposit ($${Math.round(COMPREHENSIVE_KNOWLEDGE.pricing.premium.base * 0.25)}) to start!`;
    if (lower.match(/enterprise|complex|large|corporate|biggest/i)) return `Enterprise plan starts at $${COMPREHENSIVE_KNOWLEDGE.pricing.enterprise.base} for ${COMPREHENSIVE_KNOWLEDGE.pricing.enterprise.pages}+ pages. Includes secure dashboards, integrations, and compliance features. Custom quotes for complex needs. Let's discuss your specific requirements!`;
    return "Your live estimate updates above as you customize! Base price covers included pages, with transparent pricing for extras. Starter from $499, Pro $2,800, Premium $7,000, Enterprise from $12,000, Update Website (custom N/A). All plans deliver in 1 week. **25% deposit** to start, 75% before launch.";
  }],
  
  // Timeline questions (many ways to ask about time)
  [/(how long|how much time|timeline|timeframe|time frame|delivery|turnaround|fast|quick|quickly|speed|when.*done|when.*ready|when.*finish|when.*complete|deadline|urgent|duration)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.match(/rush|urgent|asap|emergency|immediate|72|three day|3 day|faster|fastest|quick/i)) {
      return `Need it faster? Our Priority 72-hour sprint add-on ($${COMPREHENSIVE_KNOWLEDGE.addons.sprint72.price}) delivers complete projects in 3 days. Perfect for launches, events, or time-sensitive needs. Just check the "Priority 72-hr sprint" box in Add-ons above!`;
    }
    return `Standard delivery is ${COMPREHENSIVE_KNOWLEDGE.delivery.standard} for all plans. We also offer a 72-hour priority sprint add-on for $${COMPREHENSIVE_KNOWLEDGE.addons.sprint72.price} if you need it faster. Consistent, reliable turnaround every time. Most projects: submit today → launch next week! 🚀`;
  }],
  
  // E-commerce questions (many shopping-related terms)
  [/(e-?comm|e-?commerce|shop|store|online store|checkout|payments|sell|selling|products|merchandise|cart|shopping cart|stripe|paypal|buy|purchase|transaction)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.match(/how much|cost|price|pricing/i)) {
      return `E-commerce sites work best with **Premium ($7,000)** or **Enterprise ($12k+)**.\n\n**Premium includes:**\n• Product catalogs & shopping cart\n• Stripe/PayPal integration\n• Checkout flow optimization\n• Basic inventory management\n• Order tracking\n\n**Enterprise adds:**\n• Complex pricing rules\n• Subscriptions & recurring billing\n• Multi-vendor support\n• Advanced inventory\n• CRM/ERP integration\n\nBoth can include AI Chat add-on for 24/7 sales assistance! Ready to start selling?`;
    }
    return "Absolutely! We specialize in e-commerce. Premium and Enterprise plans are optimized for online stores. We integrate Stripe, PayPal, or your preferred payment processor. Features include product catalogs, cart systems, checkout flows, inventory management, and order tracking. We can also add subscriptions, digital downloads, or complex pricing rules. Want to add AI sales assistant too?";
  }],
  
  // SEO & Performance questions
  [/(seo|search|google|ranking|traffic|performance|speed|fast|optimize|analytics)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('deep') || lower.includes('advanced') || lower.includes('comprehensive')) {
      return `The SEO Deep Setup add-on ($${COMPREHENSIVE_KNOWLEDGE.addons.seoDeep.price}) includes: advanced sitemap configuration, schema markup for rich results, comprehensive meta tags, Open Graph optimization, Google Analytics 4 setup, Search Console integration, and performance budgets. Perfect for serious organic growth.`;
    }
    return `Every site includes SEO foundations: clean semantic HTML, meta tags, mobile optimization, and fast loading. For advanced needs, our SEO Deep Setup ($${COMPREHENSIVE_KNOWLEDGE.addons.seoDeep.price}) adds schema markup, analytics, and comprehensive optimization. All sites score 90+ on Lighthouse by default.`;
  }],
  
  // Brand & Design questions
  [/(brand|logo|identity|design|style|colors|font|typography|visual)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('kit') || lower.includes('package') || lower.includes("don't have") || lower.includes('need')) {
      return `No brand assets yet? Our Brand Kit add-on ($${COMPREHENSIVE_KNOWLEDGE.addons.brandKit.price}) creates your complete visual identity: logo design, color palette, typography system, and brand guidelines. Everything you need for consistent, professional branding.`;
    }
    return "Every project is custom-designed to match your brand. We work with your existing assets or create new ones. The Brand Kit add-on ($600) provides complete logo design, color systems, and typography. All designs are responsive and optimized for modern devices.";
  }],
  
  // Hosting & Technical questions
  [/(host|domain|server|deploy|launch|ssl|https|cdn|uptime)/i, (q) => {
    return "We handle all technical setup: domain connection, modern hosting (Vercel, Netlify, or your preference), SSL certificates, CDN configuration, and DNS setup. Sites are blazing fast with global edge deployment. Ongoing hosting/maintenance is optional through our Care plans starting at $199/month.";
  }],
  
  // Contact questions
  [/(contact|email|phone|call|reach|talk|speak|message)/i, (q) => {
    return `Let's talk! Call us at ${COMPREHENSIVE_KNOWLEDGE.contact.phone} or email ${COMPREHENSIVE_KNOWLEDGE.contact.email}. We're based in ${COMPREHENSIVE_KNOWLEDGE.contact.timezone} and typically respond within a few hours during business days.`;
  }],
  
  // Content & Copywriting questions
  [/(content|copy|writing|write|text|words|blog|article)/i, (q) => {
    return `Need help with content? Our copywriting add-on provides professional, SEO-optimized writing at $${COMPREHENSIVE_KNOWLEDGE.addons.copywriting.price} per page. We craft compelling copy that converts. Pro+ plans also include CMS setup for blogs and dynamic content.`;
  }],
  
  // Maintenance & Support questions
  [/(maintenance|support|updates|care|monthly|ongoing|help)/i, (q) => {
    return `We offer three Care tiers for ongoing support:\n• Basic Care ($${COMPREHENSIVE_KNOWLEDGE.care.basic.price}/mo): Updates, bug fixes, security\n• Growth Care ($${COMPREHENSIVE_KNOWLEDGE.care.growth.price}/mo): Content updates, optimization, analytics\n• Pro Care ($${COMPREHENSIVE_KNOWLEDGE.care.pro.price}/mo): Feature additions, A/B testing, strategic consulting\n\nAll optional—choose what fits your needs.`;
  }],
  
  // CMS & Admin questions
  [/(cms|admin|dashboard|edit|manage|backend|login|update content)/i, (q) => {
    return "Pro and higher plans include CMS setup so you can easily manage content without code. We typically use modern headless CMS options (Sanity, Contentful, or Strapi) or WordPress if preferred. You get a clean admin interface, media management, and user roles. Enterprise plans include secure dashboards with custom workflows.";
  }],
  
  // Integration questions
  [/(integrat|api|connect|crm|salesforce|hubspot|mailchimp|zapier|webhook)/i, (q) => {
    return "Enterprise plans specialize in integrations! We connect your site to CRMs (Salesforce, HubSpot), email platforms (Mailchimp, SendGrid), payment processors, analytics tools, and custom APIs. We build secure webhooks, automation pipelines, and SSO authentication. Tell us what you need to connect!";
  }],
  
  // Revision & Changes questions
  [/(revision|change|edit|modify|redo|adjust|fix)/i, (q) => {
    return "Revisions are included in every plan: Starter (1 round), Professional (2 rounds), Premium (3 rounds), Enterprise (dedicated support). We iterate based on your feedback until you're happy. After launch, Care plans handle ongoing changes and updates.";
  }],
  
  // Mobile & Responsive questions
  [/(mobile|responsive|phone|tablet|ipad|android|ios|device)/i, (q) => {
    return "Every site is fully responsive and mobile-optimized by default. We design mobile-first, test on real devices, and ensure perfect display across all screen sizes. Touch interactions, swipe gestures, and mobile performance are prioritized. Your site will look stunning on any device.";
  }],
  
  // Animation & Effects questions
  [/(animation|motion|scroll|effect|interactive|transition|parallax)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('advanced') || lower.includes('complex') || lower.includes('premium')) {
      return "Premium plans feature advanced scroll choreography, parallax effects, custom SVG animations, and micro-interactions that bring your site to life. We use GSAP and modern CSS for buttery-smooth 60fps animations. Perfect for portfolios, showcases, and brands that want to make an impact.";
    }
    return "All plans include baseline animations: smooth transitions, hover effects, and fade-ins. Professional plans add deeper motion and micro-interactions. Premium plans deliver advanced scroll effects and custom animations. Everything is performance-optimized and accessible.";
  }],
  
  // Security questions
  [/(security|secure|safe|protection|hack|ssl|encrypt)/i, (q) => {
    return "Security is built-in: SSL certificates, secure hosting, encrypted data transmission, and protection against common vulnerabilities. Enterprise plans add authentication systems (SSO, OAuth), role-based access, compliance features (GDPR, HIPAA), security audits, and advanced protection. Your data and users are safe.";
  }],
  
  // Technology & Stack questions
  [/(technology|stack|framework|react|next|vue|wordpress|code|language)/i, (q) => {
    return "We use modern, performant technologies: React, Next.js, Vue, or vanilla JavaScript depending on your needs. For CMS sites, we offer WordPress or headless solutions. Everything is custom-coded (no page builders), version-controlled with Git, and built with clean, maintainable code. You own all source code.";
  }],
  
  // Plan comparison questions
  [/(compare|difference|between|which plan|best|recommend|should I)/i, (q) => {
    return "Let me help you choose:\n• **Starter** ($499): Simple sites, 5 pages, perfect for startups & landing pages\n• **Professional** ($2,800): 10 pages, CMS, animations—ideal for growing businesses\n• **Premium** ($7,000): 16 pages, e-commerce ready, advanced effects for established brands\n• **Enterprise** ($12k+): 24+ pages, dashboards, integrations, custom systems\n\nWhat's your main goal for the site?";
  }],
  
  // Process & Workflow questions
  [/(process|how it works|workflow|steps|what happens|next)/i, (q) => {
    return "Here's how it works:\n1. **Choose your plan** and fill out the brief above\n2. **Pay 25% deposit** to reserve your spot\n3. **Kick-off call** within 24 hours to align on vision\n4. **Design & build** phase (we send preview links)\n5. **Revisions** based on your feedback\n6. **Final payment** (remaining 75%)\n7. **Launch** 🚀\n\nTotal timeline: 1 week (or 72 hours with sprint add-on).";
  }],
  
  // Payment questions
  [/(payment|pay|deposit|installment|financing|card|invoice|how much.*upfront|how much.*start)/i, (q) => {
    return "Payment is simple: **25% deposit** to start, remaining **75% before launch**. We accept credit cards, bank transfers, and business checks. Invoices provided for each payment. Monthly Care plans are billed automatically. Need custom payment terms? Contact us at devbyb12@gmail.com.";
  }],
  
  // Refund & Guarantee questions
  [/(refund|guarantee|satisfaction|money back|unhappy)/i, (q) => {
    return "Your satisfaction is our priority. We iterate through revisions until you're happy. If we can't deliver what was promised, we'll make it right. Contact us at devbyb12@gmail.com to discuss any concerns—we're reasonable people who care about your success.";
  }],
  
  // Portfolio & Examples questions
  [/(portfolio|example|sample|work|previous|showcase|demo)/i, (q) => {
    return "We've built sites for SaaS companies, e-commerce brands, professional services, nonprofits, and more. Each project is custom, so we focus on your unique needs rather than templates. The samples above show our range. Want to see something specific to your industry? Email devbyb12@gmail.com!";
  }],
  
  // AI Chat / Chatbot specific questions
  [/(ai chat|chatbot|chat bot|chat feature|live chat|customer chat|conversational|ai assistant|customer service|virtual assistant)/i, (q) => {
    const lower = q.toLowerCase();
    
    // If asking about capabilities/types of AI - EXPANDED triggers
    if (lower.includes('capable') || lower.includes('capabil') || lower.includes('type') || lower.includes('types') || 
        lower.includes('kind') || lower.includes('kinds') || lower.includes('what can') || lower.includes('what ai') ||
        lower.includes('achieve') || lower.includes('achieving') || lower.includes('build') || lower.includes('make') ||
        lower.includes('create') || lower.includes('do you do') || lower.includes('do you offer') || 
        lower.includes('understand which') || lower.includes('help me understand') || lower.includes('what are')) {
      return `🤖 **We can build VIRTUALLY ANY TYPE of AI chat system you can imagine!** Here's our complete capabilities:\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n**📋 AI CHAT TYPES WE BUILD:**\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n**1️⃣ Customer Service AI**\n   • Answers support questions 24/7\n   • Troubleshoots technical issues\n   • Handles returns, refunds, exchanges\n   • Escalates complex issues to humans\n   • Multi-language support (50+ languages)\n   • **Example:** "Where's my order?" → Instantly tracks & responds\n\n**2️⃣ Sales Assistant AI**\n   • Qualifies leads with smart questions\n   • Recommends products based on needs\n   • Upsells & cross-sells intelligently\n   • Guides purchase decisions\n   • Handles objections in real-time\n   • **Example:** Asks budget, needs, timeline → Suggests perfect product\n\n**3️⃣ Lead Capture AI**\n   • Engages visitors immediately\n   • Collects contact info naturally\n   • Schedules demos/appointments automatically\n   • Integrates with your CRM\n   • Follows up via email/SMS\n   • **Example:** Chat converts 3x more than static forms\n\n**4️⃣ FAQ Bot (Simple)**\n   • Instant answers to common questions\n   • Hours, policies, shipping, pricing\n   • Reduces support tickets by 60-80%\n   • Perfect for small businesses\n   • **Example:** "What are your hours?" → Instant response\n\n**5️⃣ E-commerce Shopping Assistant**\n   • Product recommendations\n   • Size/fit guidance\n   • Comparison shopping help\n   • Real-time inventory checks\n   • Cart recovery (abandoned cart nudges)\n   • **Example:** "Looking for red dress, size 8" → Shows options, helps decide\n\n**6️⃣ Booking/Scheduling Bot**\n   • Takes appointments automatically\n   • Syncs with Google/Outlook calendars\n   • Sends reminders via SMS/email\n   • Handles rescheduling & cancellations\n   • Multi-location & staff scheduling\n   • **Example:** "Book haircut Tuesday 2pm" → Done instantly\n\n**7️⃣ Educational/Tutorial AI**\n   • Teaches how to use your product\n   • Provides step-by-step guidance\n   • Interactive onboarding\n   • Knowledge base integration\n   • **Example:** "How do I reset password?" → Shows tutorial\n\n**8️⃣ Data Collection AI**\n   • Conversational surveys\n   • Feedback collection\n   • Quiz funnels for marketing\n   • Medical intake forms (HIPAA-compliant)\n   • **Example:** Asks questions naturally vs boring forms\n\n**9️⃣ Voice-Enabled AI**\n   • Text-to-speech responses\n   • Speech-to-text input\n   • Phone integration possible\n   • Accessibility-focused\n   • **Example:** Users can speak instead of type\n\n**🔟 Personality-Driven AI**\n   • Custom brand voice (professional, friendly, witty, casual)\n   • Industry-specific language\n   • Emoji usage control\n   • Tone matching your audience\n   • **Example:** Law firm = professional, Skate shop = casual/fun\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n**🔧 ADVANCED FEATURES:**\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n✅ **CRM Integration** - Salesforce, HubSpot, Pipedrive, Zoho\n✅ **Payment Processing** - Take payments IN the chat (Stripe/PayPal)\n✅ **Context Memory** - Remembers conversation history across sessions\n✅ **Sentiment Analysis** - Detects frustrated/happy customers, adjusts tone\n✅ **Analytics Dashboard** - Track conversations, conversion rates, common questions\n✅ **Human Handoff** - Seamlessly transfers to live agent when needed\n✅ **Custom Training** - Trained on YOUR specific products, services, policies\n✅ **Multi-channel** - Same AI works on website, WhatsApp, Facebook Messenger\n✅ **API Connections** - Connect to inventory, order systems, databases\n✅ **A/B Testing** - Test different conversation flows\n✅ **Lead Scoring** - Automatically rates lead quality\n✅ **White-label** - Looks 100% like your brand\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n**💡 REAL EXAMPLES:**\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n**E-commerce Store:**\n"Looking for running shoes under $100"\n→ AI shows 5 options, asks about terrain, recommends best fit\n→ User adds to cart, AI offers socks (upsell), completes purchase\n\n**Law Firm:**\n"I need help with a divorce"\n→ AI asks qualifying questions (state, kids, assets)\n→ Determines case type, schedules consultation\n→ Sends intake forms, syncs to CRM\n\n**Restaurant:**\n"Table for 4 tonight at 7pm"\n→ AI checks availability, books table\n→ Asks dietary restrictions, sends confirmation\n→ Sends reminder 2 hours before\n\n**SaaS Company:**\n"How do I export my data?"\n→ AI shows tutorial, offers demo booking\n→ If frustrated, transfers to support agent\n→ Logs issue for product team\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n**💰 PRICING RANGES:**\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n• **Simple FAQ Bot:** $1,200 - $2,000\n• **Customer Service AI:** $2,500 - $4,000  \n• **Sales/Lead Capture AI:** $3,000 - $5,000\n• **E-commerce Assistant:** $4,000 - $6,000\n• **Advanced CRM Integration:** $5,000 - $8,000\n• **Enterprise Multi-channel:** $8,000 - $15,000+\n\n*Pricing depends on complexity, integrations, and training scope*\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n**🚀 HOW TO ADD IT:**\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n1. Check the **"AI Chat / Chatbot"** box in Add-ons section above\n2. In the form, describe:\n   • What you want it to do (customer service, sales, bookings, etc.)\n   • What it needs to know (FAQs, product catalog, etc.)\n   • Any integrations needed (CRM, calendar, payment)\n3. We'll provide exact pricing within 24 hours based on your needs!\n\n**Available as an add-on to ANY plan** (Starter, Pro, Premium, Enterprise)\n\n**━━━━━━━━━━━━━━━━━━━━━━**\n\n**❓ Need help deciding?** Tell me:\n• What's your business/industry?\n• What's your main goal? (more sales, less support tickets, more bookings?)\n• What should the AI do for visitors?\n\nI'll recommend the perfect AI solution for you! 💬`;
    }
    
    return "Yes! AI Chat is available as an **add-on to ANY plan** (Starter, Pro, Premium, or Enterprise). 🤖\n\n**Just check the \"AI Chat / Chatbot\" box in the Add-ons section above!**\n\n**What we build:**\nCustom AI trained specifically for YOUR business - like this chatbot you're talking to right now, but tailored to answer questions about YOUR products, services, and processes.\n\n**Common uses:**\n• 24/7 customer support automation\n• Product recommendations & sales assistance  \n• Lead qualification & contact capture\n• Appointment booking & scheduling\n• FAQ automation\n• E-commerce shopping assistance\n• Multi-language customer service\n\n**Pricing:** Custom (depends on complexity)\n• Simple FAQ bot: ~$1,200-2,000\n• Customer service AI: ~$2,500-4,000\n• Advanced sales/CRM integration: ~$4,000-8,000+\n\nWe'll discuss exact pricing based on your needs after you submit!\n\n**To add it:** Check the AI Chat box above and describe what you want it to do in the \"Additional notes\" section.\n\n**💡 Want to see ALL the types of AI we can build?**\nAsk me: 'What types of AI chat can you guys make?' or 'What AI chat are you capable of achieving?'";
  }],
  
  // Wow factor / Sales optimization questions
  [/(wow|impress|stand out|increase sales|boost sales|convert|conversion|engaging|grab attention|hook|opener)/i, (q) => {
    const lower = q.toLowerCase();
    return "Want to WOW visitors and boost sales? Here's what works:\n\n**🎯 Premium Plan Features:**\n• **Advanced scroll animations** - Sites that move and react create 3x more engagement\n• **AI chat** - Answer questions instantly, guide purchases 24/7\n• **Micro-interactions** - Every hover, click, scroll delights users\n• **Strategic CTAs** - Perfectly timed calls-to-action based on scroll behavior\n• **Video backgrounds** - Cinematic intros that stop scrollers\n\n**💰 Proven conversion boosters:**\n• Interactive product demos\n• Social proof animations (reviews, testimonials)\n• Scarcity triggers (limited time offers)\n• Smooth checkout flows (reduce cart abandonment by 40%)\n• Mobile-first design (80% of traffic is mobile)\n\n**The secret?** Combine stunning visuals with strategic psychology. Premium animations + AI chat + optimized UX = sites that convert 2-5x better.\n\nWhat's your product/service? I'll suggest the perfect wow-factor features!";
  }],
  
  // Interactive/Custom feature requests
  [/(interactive|custom|unique|special|different|feature|functionality|specific)/i, (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('can you') || lower.includes('possible') || lower.includes('able to')) {
      return "Yes! We love custom challenges. Here's what we can build:\n\n**Interactive Features:**\n• Custom calculators & configurators\n• Interactive product showcases\n• 3D models & AR experiences\n• Real-time data visualizations\n• Gamification elements\n• Quiz funnels\n• AI-powered tools\n\n**Smart Integrations:**\n• CRM automation (Salesforce, HubSpot)\n• Payment systems (Stripe, PayPal, subscriptions)\n• Booking & scheduling systems\n• Inventory management\n• Email marketing automation\n• Analytics & tracking\n\nCustom features typically fit Premium ($7k) or Enterprise ($12k+) plans. The more unique and complex, the more value it adds to conversions.\n\nDescribe your dream feature—let's see if we can build it!";
    }
    return "Custom features are our specialty! Premium and Enterprise plans include advanced interactivity, custom animations, and unique functionality tailored to your business. What specific feature are you imagining?";
  }],
  
  // Conversion & Sales optimization
  [/(increase|boost|improve|grow|more sales|more customers|more leads|more conversions)/i, (q) => {
    return "Let's optimize your site for maximum conversions! Here's what drives sales:\n\n**🚀 High-Converting Elements:**\n1. **Speed** - Sites that load in <2 seconds convert 2.5x more\n2. **Trust signals** - Testimonials, reviews, case studies, security badges\n3. **Clear CTAs** - Prominent, action-oriented buttons\n4. **AI Chat** - Answer objections instantly, guide purchases\n5. **Mobile perfection** - 80% of traffic, must be flawless\n6. **Social proof** - Real-time purchase notifications, customer counts\n7. **Urgency** - Limited time offers, countdown timers\n8. **Simplified checkout** - Every extra field loses 10% of customers\n\n**Best Plans for Conversion:**\n• **Pro ($2,800)** - Solid foundation with CMS for content marketing\n• **Premium ($7,000)** - AI chat + advanced UX for serious growth\n• **Enterprise ($12k+)** - Full funnel optimization with analytics\n\nWant a conversion audit? Tell me about your offer and I'll recommend the perfect setup!";
  }],
  
  // Ownership & Rights questions
  [/(own|ownership|who owns|rights|intellectual property|source code|copyright)/i, (q) => {
    return `**You own everything!** 📜\n\n${COMPREHENSIVE_KNOWLEDGE.rules.ownership} - You get:\n• All source code\n• All design files\n• All content & assets\n• Full intellectual property rights\n• No recurring licensing fees\n\nWe transfer everything to you at launch. It's YOUR website, YOUR code, YOUR property. You can take it anywhere, modify it, or hire anyone else to work on it.\n\nOptional: We offer Care plans ($199-899/mo) for ongoing updates, but that's completely your choice!`;
  }],
  
  // Rules & Policies questions
  [/(rules|policy|policies|terms|conditions|agreement|contract)/i, (q) => {
    return `Here are our key policies:\n\n**💰 Payment:** ${COMPREHENSIVE_KNOWLEDGE.rules.deposit} deposit, ${COMPREHENSIVE_KNOWLEDGE.rules.finalPayment} before launch\n**⏱️ Delivery:** ${COMPREHENSIVE_KNOWLEDGE.rules.delivery}\n**✏️ Revisions:** Starter (${COMPREHENSIVE_KNOWLEDGE.rules.revisions.starter}), Pro (${COMPREHENSIVE_KNOWLEDGE.rules.revisions.pro}), Premium (${COMPREHENSIVE_KNOWLEDGE.rules.revisions.premium}), Enterprise (${COMPREHENSIVE_KNOWLEDGE.rules.revisions.enterprise})\n**📦 Ownership:** ${COMPREHENSIVE_KNOWLEDGE.rules.ownership}\n**🖥️ Hosting:** ${COMPREHENSIVE_KNOWLEDGE.rules.hosting}\n**💳 Payment methods:** ${COMPREHENSIVE_KNOWLEDGE.rules.paymentMethods.join(', ')}\n**📞 Support:** ${COMPREHENSIVE_KNOWLEDGE.rules.support}\n\nWe're flexible and easy to work with. Questions about anything specific?`;
  }],
  
  // General help
  [/(help|question|ask|info|tell me|know|wonder)/i, (q) => {
    return "I'm here to help with anything about DEVBYB! Ask me about:\n• Pricing & plans\n• Timeline & delivery\n• Features & capabilities\n• Process & workflow\n• Technical questions\n• Design & branding\n• Payment & policies\n• Or anything else!\n\nWhat would you like to know?";
  }],
];

/* ========= SHARED ANSWER FUNCTION ========= */
function answer(q) {
    const lower = q.toLowerCase();
    const words = lower.split(/\s+/);
    
    // ENHANCED: Normalize common phrasings before pattern matching
    let normalized = lower
      // Time/timeline variations
      .replace(/how long (does|will) it take/gi, 'timeline')
      .replace(/how (quick|fast)/gi, 'how long')
      .replace(/what('?s| is) the (turnaround|timeframe)/gi, 'timeline')
      // Cost/price variations
      .replace(/how much (does|will) (it|this) cost/gi, 'price')
      .replace(/what('?s| is) the (cost|price|rate)/gi, 'pricing')
      .replace(/what (do|will) (you|i) charge/gi, 'price')
      // Payment/deposit variations
      .replace(/how much (do i|to) pay (upfront|to start|initially)/gi, 'deposit')
      .replace(/what('?s| is) the (down payment|initial payment)/gi, 'deposit')
      // Capability variations
      .replace(/(are you|can you) (capable of|able to)/gi, 'can you')
      .replace(/do you (do|offer|provide|have)/gi, 'can you')
      .replace(/is it possible to/gi, 'can you')
      // AI chat variations
      .replace(/virtual assistant|conversational ai|smart chat/gi, 'ai chat')
      .replace(/customer support bot|help bot|support chat/gi, 'ai chatbot')
      // Plan/tier variations
      .replace(/which (plan|tier|package|option) (should|would|is best)/gi, 'recommend plan')
      .replace(/what('?s| is) (your )?best (plan|option|package)/gi, 'recommend');
    
    // Try to find matching Q&A pairs with normalized query
    for (const [regex, fn] of QA) {
      if (regex.test(normalized) || regex.test(lower)) {
        return fn(q);
      }
    }
    
    // ADVANCED NATURAL LANGUAGE UNDERSTANDING
    
    // Detect greetings/casual conversation
    if (/^(hi|hey|hello|yo|sup|what'?s up)/i.test(lower)) {
      return "Hey there! 👋 I'm your AI assistant for DEVBYB. I can help you with:\n\n• Choosing the perfect plan for your needs\n• Understanding pricing & features\n• Answering questions about AI chat, e-commerce, animations, etc.\n• Recommending solutions for your specific goals\n\nWhat brings you here today? What kind of website are you looking to build?";
    }
    
    // Detect thank you / positive feedback
    if (/(thanks|thank you|appreciate|helpful|great|awesome|perfect)/i.test(lower)) {
      return "You're very welcome! Happy to help! 😊\n\nIf you have any other questions about plans, features, pricing, or anything else, just ask. I'm here to make sure you get exactly what you need.\n\nReady to get started? Fill out the form above or call us at ${COMPREHENSIVE_KNOWLEDGE.contact.phone}!";
    }
    
    // Detect frustration or confusion
    if (/(confused|don't understand|not clear|frustrated|help me|stuck)/i.test(lower)) {
      return "I'm sorry for the confusion! Let me help clarify. 😊\n\nHere's the simple breakdown:\n1. **Choose a plan** - Starter ($499), Pro ($2,800), Premium ($7,000), or Enterprise ($12k+)\n2. **Add extras** - AI chat, branding, SEO, etc. (all optional)\n3. **Tell us your vision** - Fill the form\n4. **We build it** - 1 week delivery\n\nWhat specifically can I clarify for you? Or want to just hop on a call? ${COMPREHENSIVE_KNOWLEDGE.contact.phone}";
    }
    
    // Recommendation requests
    if (words.some(w => ['best', 'recommend', 'should', 'which', 'what'].includes(w)) && 
        words.some(w => ['plan', 'tier', 'package', 'option', 'choose', 'pick'].includes(w))) {
      
      // Context-aware recommendations
      if (lower.includes('ai') || lower.includes('chat') || lower.includes('bot')) {
        return "For AI chat, **any plan works** - it's an add-on! 🤖\n\n**My recommendation:**\n• **Starter + AI Chat** ($499 + custom) - Best if you just need basic site + smart chatbot\n• **Pro + AI Chat** ($2,800 + custom) - Perfect for businesses that want CMS, blog, and AI support\n• **Premium + AI Chat** ($7,000 + custom) - Ideal for e-commerce with AI sales assistant\n• **Enterprise + AI Chat** ($12k+ + custom) - For complex CRM integration & advanced analytics\n\nJust check the AI Chat box in Add-ons above and describe what you want it to do! What's your business about?";
      }
      
      if (lower.includes('small') || lower.includes('startup') || lower.includes('simple') || lower.includes('budget')) {
        return "For a small business/startup, I recommend **Starter ($499)** or **Pro ($2,800)**:\n\n**Starter** if you need:\n• Simple 5-page site\n• Clean, professional design\n• Mobile-responsive\n• Fast launch\n\n**Pro** if you also want:\n• 10 pages\n• Blog/CMS to publish content\n• Deeper animations & polish\n• Room to grow\n\nBoth deliver in 1 week! You can always add AI chat, SEO, or branding as extras. What's most important to you right now?";
      }
      
      if (words.some(w => ['sale', 'sales', 'ecommerce', 'shop', 'store', 'sell'].includes(w))) {
        return "For sales/e-commerce, go with **Premium ($7,000)** or **Enterprise ($12k+)**:\n\n**Premium** gives you:\n• E-commerce ready (Stripe, PayPal, etc.)\n• Product catalogs & cart system\n• Advanced checkout flow\n• Inventory management basics\n• Add AI Chat for 24/7 sales assistant!\n\n**Enterprise** adds:\n• Complex pricing rules\n• Multi-vendor support\n• CRM integration\n• Advanced analytics & reporting\n• Subscription management\n\nPremium is the sweet spot for most e-commerce! Want to add AI chat to automate sales?";
      }
      
      return "Let me help you choose! Tell me about:\n\n• **Your goal** - Sales? Leads? Brand awareness? Portfolio?\n• **Your business type** - E-commerce? Services? SaaS? Blog?\n• **Must-have features** - AI chat? CMS? E-commerce? Animations?\n• **Budget range** - Starting point to work with?\n\nThe more you share, the better I can recommend! Or just call: ${COMPREHENSIVE_KNOWLEDGE.contact.phone}";
    }
    
    // Capability questions
    if ((lower.includes('can you') || lower.includes('able to') || lower.includes('possible') || 
         lower.includes('do you') || lower.includes('does it')) && !lower.includes('contact')) {
      
      // Extract what they're asking about
      let capability = "";
      if (lower.includes('integrat')) capability = "integrations";
      else if (lower.includes('mobile') || lower.includes('app')) capability = "mobile";
      else if (lower.includes('multilingual') || lower.includes('language')) capability = "languages";
      else if (lower.includes('booking') || lower.includes('schedul')) capability = "booking";
      else if (lower.includes('member') || lower.includes('login') || lower.includes('account')) capability = "accounts";
      
      if (capability === "integrations") {
        return "Yes! We integrate with virtually anything:\n\n**CRM:** Salesforce, HubSpot, Pipedrive, Zoho\n**Email:** Mailchimp, SendGrid, Klaviyo, ConvertKit\n**Payments:** Stripe, PayPal, Square, Authorize.net\n**Analytics:** Google Analytics, Mixpanel, Segment\n**Booking:** Calendly, Acuity, custom systems\n**Automation:** Zapier, Make, custom webhooks\n**Chat:** Intercom, Drift, or custom AI chat\n\nEnterprise plans specialize in complex integrations. What do you need to connect?";
      }
      
      if (capability === "mobile") {
        return "Every site is **fully mobile-responsive** by default (all plans)! We design mobile-first.\n\nIf you need a **mobile app** (not just responsive site):\n• **Progressive Web App (PWA)** - Works like native app, Premium/Enterprise\n• **iOS/Android native** - Partnered with app developers, custom quote\n• **React Native** - Cross-platform apps, Enterprise plan\n\nMost clients find our mobile-responsive sites perform better than apps! What's your use case?";
      }
      
      if (capability === "languages") {
        return "Yes! Multi-language sites available:\n\n**Basic (Pro+):** Manual translation, language switcher\n**Advanced (Premium+):** Auto-translation API integration, RTL support for Arabic/Hebrew\n**AI-powered (with AI Chat add-on):** Chatbot that speaks 50+ languages automatically\n\nWhich languages do you need? We handle everything from Spanish/French to Chinese/Arabic!";
      }
      
      if (capability === "booking") {
        return "Absolutely! We can build booking/scheduling systems:\n\n**Options:**\n• **Integrate existing** (Calendly, Acuity) - Any plan\n• **Custom booking system** - Premium/Enterprise\n• **AI booking assistant** - Add AI Chat add-on, it takes bookings via conversation!\n\nCustom systems can include: calendar sync, reminders, payments, waitlists, multi-location, staff management.\n\nWhat type of bookings? (Appointments? Classes? Rentals? Events?)";
      }
      
      if (capability === "accounts") {
        return "Yes! Login/account systems available (check \"Login / accounts\" in capabilities above):\n\n**User Features:**\n• Registration & login\n• Profile management\n• Dashboard/portal access\n• Password reset\n• Email verification\n• Role-based permissions\n\n**Advanced (Enterprise):**\n• SSO / OAuth (Google, Facebook login)\n• Two-factor authentication\n• HIPAA/GDPR compliance\n• Custom user roles & permissions\n\nBest in Premium or Enterprise plans. What do users need to access?";
      }
      
      return "Most likely YES! We can build:\n\n🤖 AI chatbots\n🛒 E-commerce stores\n📊 Dashboards & portals\n🎨 Custom animations\n🔗 API integrations\n📱 Mobile-responsive (all plans)\n🔐 User authentication\n📈 Analytics & tracking\n🌐 Multi-language\n📅 Booking systems\n💳 Payment processing\n✉️ Email automation\n\nTell me exactly what you need - I'll let you know how we can build it and which plan works best!";
    }
    
    // Compare / difference questions
    if (lower.includes('difference') || lower.includes('compare') || (lower.includes('vs') || lower.includes('versus'))) {
      return "Here's how the plans compare:\n\n**Starter ($499)** - 5 pages, basic animations, 1 revision\n└─ *Best for:* Simple sites, landing pages, portfolios\n\n**Pro ($2,800)** - 10 pages, CMS/blog, deeper animations, 2 revisions  \n└─ *Best for:* Growing businesses, content marketing, professional services\n\n**Premium ($7,000)** - 16 pages, e-commerce ready, advanced effects, 3 revisions\n└─ *Best for:* Online stores, brands wanting to wow, complex sites\n\n**Enterprise ($12k+)** - 24+ pages, integrations, dashboards, dedicated support\n└─ *Best for:* Large companies, SaaS, custom systems, compliance needs\n\n**ALL plans** can add AI Chat, SEO, branding, etc. as extras!\n\nWhich features matter most to you?";
    }
    
    // Fallback with smart topic detection (expanded word lists)
    const topics = [];
    if (words.some(w => ['price', 'pricing', 'cost', 'costs', 'budget', 'expensive', 'cheap', 'dollar', 'afford', 'charge', 'fee', 'rate', 'quote', 'estimate', 'investment'].includes(w))) topics.push('💰 pricing');
    if (words.some(w => ['time', 'timing', 'long', 'duration', 'when', 'delivery', 'deliver', 'fast', 'quick', 'quickly', 'speed', 'deadline', 'turnaround', 'timeframe', 'timeline'].includes(w))) topics.push('⏱️ timeline');
    if (words.some(w => ['design', 'look', 'looks', 'style', 'styling', 'beautiful', 'modern', 'aesthetic', 'visual', 'appearance', 'ui', 'ux', 'interface'].includes(w))) topics.push('🎨 design');
    if (words.some(w => ['feature', 'features', 'include', 'included', 'functionality', 'capability', 'capabilities', 'does', 'function', 'functions', 'tool', 'tools'].includes(w))) topics.push('⚙️ features');
    if (words.some(w => ['start', 'starting', 'begin', 'beginning', 'process', 'procedure', 'work', 'works', 'how', 'steps', 'stage', 'phases'].includes(w))) topics.push('🚀 getting started');
    if (words.some(w => ['ai', 'artificial', 'chat', 'chatbot', 'bot', 'assistant', 'automat', 'automation', 'intelligent', 'smart', 'virtual'].includes(w))) topics.push('🤖 AI chat');
    if (words.some(w => ['pay', 'payment', 'paying', 'deposit', 'upfront', 'down', 'installment', 'financing', 'invoice', 'bill'].includes(w))) topics.push('💳 payment');
    if (words.some(w => ['revision', 'revisions', 'change', 'changes', 'edit', 'edits', 'modify', 'update', 'fix', 'fixes', 'redo'].includes(w))) topics.push('✏️ revisions');
    if (words.some(w => ['own', 'ownership', 'rights', 'property', 'code', 'source'].includes(w))) topics.push('📜 ownership');
    
    if (topics.length > 0) {
      return `I can help with ${topics.join(', ')}! Try asking:\n\n• "What plan is best for [your goal]?"\n• "Can you build [specific feature]?"\n• "How much does [thing] cost?"\n• "What types of AI can you make?"\n• "How does your process work?"\n\nOr describe your project and I'll guide you! What are you building?`;
    }
    
    // SMART CLARIFICATION SYSTEM - Detects vague questions and prompts for specifics
    const vagueIndicators = ['they', 'stuff', 'things', 'something', 'anything', 'everything', 'whatever'];
    const hasVagueWord = vagueIndicators.some(vague => words.includes(vague));
    
    if (hasVagueWord || words.length < 4) {
      // Question is too vague - ask for clarification with helpful prompts
      return `🤔 I want to give you the most helpful answer! To help me understand better, could you tell me:\n\n**📋 Quick Questions to Guide Me:**\n\n1️⃣ **What's your main goal?**\n   Examples: "Get more sales", "Book appointments", "Build brand awareness", "Collect leads"\n\n2️⃣ **What type of business do you have?**\n   Examples: "E-commerce store", "Restaurant", "Law firm", "SaaS company", "Freelancer"\n\n3️⃣ **What specific feature are you curious about?**\n   Examples: "AI chatbot", "Online booking", "E-commerce", "Blog/CMS", "Custom animations"\n\n4️⃣ **Or what's your biggest concern?**\n   Examples: "Cost", "Timeline", "Design quality", "Mobile responsiveness"\n\n**💬 Feel free to answer just ONE of these**, or rephrase your question with more details!\n\nExamples of great questions:\n• "Can you build an AI chat that handles customer support for a restaurant?"\n• "How much for an e-commerce site with 50 products?"\n• "What plan is best for a lawyer who wants to get more clients?"\n\nWhat would help you most? 😊`;
    }
    
    // Ultimate fallback - be helpful, not robotic
    return `🤖 I didn't quite catch that, but I'm here to help! Let me ask you a few quick questions:\n\n**Choose what applies to you:**\n\n🎯 **About Your Project:**\n• "I need a new website" → Tell me your business type and main goal\n• "I want to update my existing site" → Tell me what needs improvement\n• "I'm just exploring options" → Ask me about plans, pricing, or features!\n\n💡 **Common Questions I Can Answer:**\n• "What types of AI chat can you build?" (Detailed capabilities list)\n• "How much does [feature/plan] cost?" (Exact pricing)\n• "Can you build [specific thing]?" (Yes/no + details)\n• "What plan is best for [your goal]?" (Personalized recommendation)\n• "How long does it take?" (Timeline & delivery)\n• "Do you offer [specific feature]?" (Feature availability)\n\n📞 **Or Just Call Us:**\nIf you prefer talking vs typing, call ${COMPREHENSIVE_KNOWLEDGE.contact.phone}!\n\n**Try asking your question again with a bit more detail!** For example:\n❌ "What can you do?"\n✅ "What types of AI chatbots can you build for a real estate website?"\n\nWhat are you trying to build or learn about? 😊`;
}

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
      log.scrollTop = log.scrollHeight;
    }, 8);
  };

  const submit = () => {
    const q = input.value.trim();
    if (!q) return;
    push("me", q);
    input.value = "";
    setTimeout(() => push("ai", answer(q)), 300);
  };

  send.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });
  
  // Focus input on load
  input.focus();
}

/* ========= AUTOSAVE ========= */
/*
// REMOVED DUPLICATE QA SECTION - Using enhanced version above
const __skipQA = [
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
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  
  // Focus input on load
  input.focus();
}
*/

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
    addonAIChat: isChecked("#addonAIChat"),
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
    // DON'T auto-open plan on page load - let user select planet again
    // if (d.plan) openPlan(d.plan);
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
    if (el("#addonAIChat")) el("#addonAIChat").checked = !!d.addonAIChat;
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
  wireAlienChat();
}

/* ========= ALIEN CHAT ========= */
function wireAlienChat() {
  const alienShip = el("#alienShip");
  const alienDialog = el("#alienDialog");
  const alienClose = el("#alienClose");
  const alienChatLog = el("#alienChatLog");
  const alienChatInput = el("#alienChatInput");
  const alienChatSend = el("#alienChatSend");

  if (!alienShip || !alienDialog || !alienClose || !alienChatLog || !alienChatInput || !alienChatSend) return;

  let hasGreeted = false;
  let currentQuestion = 0;
  let questionnaireComplete = false;
  let userAnswers = {
    goal: "",
    businessType: "",
    targetAudience: "",
    mustHaveFeatures: "",
    websiteType: "",
    inspiration: "",
    timeline: ""
  };

  const pushAlienMessage = (role, text) => {
    const wrap = document.createElement("div");
    wrap.className = role === "user" ? "user-msg" : "bot-msg";
    wrap.textContent = "";
    alienChatLog.appendChild(wrap);
    alienChatLog.scrollTop = alienChatLog.scrollHeight;

    let i = 0;
    const t = setInterval(() => {
      wrap.textContent += text[i++] || "";
      if (i > text.length) clearInterval(t);
      alienChatLog.scrollTop = alienChatLog.scrollHeight;
    }, role === "user" ? 0 : 12);
  };

  const questions = [
    {
      key: "goal",
      question: "👽 Hi Earthling! Welcome aboard my spaceship! 🛸\n\nI'm here to help you build the PERFECT website. Instead of you trying to figure everything out, let ME guide you with a few questions.\n\n**Question 1 of 7:**\n\n🎯 **What's your main goal for this website?**\n\nFor example:\n• Get more customers and sales\n• Showcase my work/portfolio\n• Build trust and credibility\n• Collect leads and contact info\n• Sell products online\n• Something else (tell me!)\n\nWhat matters most to YOU?",
      followUp: (answer) => {
        userAnswers.goal = answer;
        return `🚀 Awesome! "${answer}" - I love that goal! This is going to help me recommend the perfect features.\n\nLet's keep going...`;
      }
    },
    {
      key: "businessType",
      question: "**Question 2 of 7:**\n\n💼 **What type of business or project is this?**\n\nFor example:\n• E-commerce / Online store\n• Service-based business (plumbing, consulting, agency, etc.)\n• Restaurant / Food business\n• Portfolio / Creative work\n• SaaS / Software product\n• Blog / Content site\n• Real estate\n• Non-profit\n• Something unique (tell me!)\n\nWhat describes YOUR business?",
      followUp: (answer) => {
        userAnswers.businessType = answer;
        return `✨ Got it! "${answer}" - This helps me understand what features you'll need.\n\nNext question...`;
      }
    },
    {
      key: "targetAudience",
      question: "**Question 3 of 7:**\n\n🎯 **Who are you trying to reach? (Your target audience)**\n\nFor example:\n• Local customers in my area\n• Business owners / B2B clients\n• Consumers / Regular people\n• Young adults / Millennials\n• Parents / Families\n• Tech-savvy professionals\n• Luxury buyers\n• Everyone!\n\nWho's your dream customer?",
      followUp: (answer) => {
        userAnswers.targetAudience = answer;
        return `🎨 Perfect! Knowing your audience helps me design the RIGHT experience to attract "${answer}".\n\nKeep going, you're doing great...`;
      }
    },
    {
      key: "mustHaveFeatures",
      question: "**Question 4 of 7:**\n\n⚙️ **What features MUST your website have?**\n\nCheck any that apply (or tell me in your own words):\n• AI Chatbot (24/7 customer support)\n• Online store / E-commerce\n• Booking/scheduling system\n• Contact forms / Lead capture\n• Blog / News section\n• Photo/video galleries\n• Customer reviews/testimonials\n• Live chat\n• Email signup\n• Member login area\n• Search functionality\n• Something else specific?\n\nWhat features are non-negotiable for you?",
      followUp: (answer) => {
        userAnswers.mustHaveFeatures = answer;
        return `💡 Excellent choices! "${answer}" - These features will make your site super functional.\n\nAlmost there...`;
      }
    },
    {
      key: "websiteType",
      question: "**Question 5 of 7:**\n\n🌐 **Is this a brand NEW website, or UPDATING an existing one?**\n\n• Brand new (starting from scratch)\n• Update/improve existing site\n• Redesign (complete makeover of current site)\n• Add features to existing site\n• Not sure yet\n\nWhich one?",
      followUp: (answer) => {
        userAnswers.websiteType = answer;
        const lower = answer.toLowerCase();
        if (lower.includes("update") || lower.includes("existing") || lower.includes("improve") || lower.includes("redesign")) {
          return `🔄 Got it! You want to improve what you already have. Smart move - we'll make it 10x better!\n\nContinuing...`;
        }
        return `🆕 Starting fresh - I love it! We'll build you something incredible from the ground up.\n\nNext...`;
      }
    },
    {
      key: "inspiration",
      question: "**Question 6 of 7:**\n\n✨ **Do you have any websites you LOVE as inspiration?**\n\nThink about sites that:\n• Look amazing visually\n• Have the vibe you want\n• Have features you want to copy\n• Make you say \"I want THIS!\"\n\nShare a few URLs, or just describe the style you're going for (modern, playful, professional, luxurious, minimal, bold, etc.)\n\nWhat inspires you?",
      followUp: (answer) => {
        userAnswers.inspiration = answer;
        return `🎨 Love it! This gives me a clear vision of what you're imagining: "${answer}".\n\nTwo more questions...`;
      }
    },
    {
      key: "timeline",
      question: "**Question 7 of 7 (Last one!):**\n\n⏰ **How soon do you need this website live?**\n\n• ASAP / Urgent (we have a 72-hour rush option!)\n• 1-2 weeks (our standard delivery)\n• 2-4 weeks (flexible timing)\n• No rush / whenever it's ready\n• I have a specific deadline (tell me when!)\n\nWhat's your timeline?",
      followUp: (answer) => {
        userAnswers.timeline = answer;
        const lower = answer.toLowerCase();
        if (lower.includes("asap") || lower.includes("urgent") || lower.includes("rush") || lower.includes("72")) {
          return `🚀 Got it - you need this FAST! We can definitely do a 72-hour priority sprint for urgent projects.\n\n🎉 **You did it, Earthling!** All 7 questions answered!\n\nNow let me analyze everything you told me and create your PERFECT custom estimate...`;
        }
        return `� Perfect! "${answer}" gives us the right timeline to plan everything.\n\n🎉 **You did it, Earthling!** All 7 questions answered!\n\nNow let me analyze everything you told me and create your PERFECT custom estimate...`;
      }
    }
  ];

  const askNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setTimeout(() => {
        pushAlienMessage("bot", questions[currentQuestion].question);
      }, 500);
    } else {
      // All questions answered - show summary and fill form
      setTimeout(() => {
        showFinalSummary();
      }, 1500);
    }
  };

  const showFinalSummary = () => {
    const summary = `🛸 **MISSION COMPLETE!** Here's what you told me:\n\n🎯 **Goal:** ${userAnswers.goal}\n💼 **Business:** ${userAnswers.businessType}\n👥 **Audience:** ${userAnswers.targetAudience}\n⚙️ **Features:** ${userAnswers.mustHaveFeatures}\n🌐 **Type:** ${userAnswers.websiteType}\n✨ **Inspiration:** ${userAnswers.inspiration}\n⏰ **Timeline:** ${userAnswers.timeline}\n💰 **Budget:** ${userAnswers.budget}\n\n---\n\n✅ **I'm now auto-filling your estimate form with ALL this information!**\n\nIn 3 seconds, I'll take you to your personalized estimate where you can:\n• Review everything\n• Make any tweaks\n• Add more details\n• **Hit "Send Brief" to get your quote!**\n\nGet ready... �`;
    
    pushAlienMessage("bot", summary);
    
    // Auto-fill the form
    setTimeout(() => {
      autoFillForm();
      closeAlienChat();
      
      // Determine which plan to open based on answers
      let suggestedPlan = determinePlan();
      openPlan(suggestedPlan);
      
      setTimeout(() => {
        const formSection = el("#plan-world");
        if (formSection) {
          formSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }, 3000);
  };

  const determinePlan = () => {
    // Create a combined text of all answers for keyword analysis
    const allText = JSON.stringify(userAnswers).toLowerCase();
    
    // Priority scoring system (most specific to least specific)
    let scores = {
      update: 0,
      premium: 0,
      enterprise: 0,
      starter: 0,
      pro: 0
    };
    
    // UPDATE PLAN - Check website type specifically
    if (userAnswers.websiteType.toLowerCase().includes("update") || 
        userAnswers.websiteType.toLowerCase().includes("existing") ||
        userAnswers.websiteType.toLowerCase().includes("improve") ||
        userAnswers.websiteType.toLowerCase().includes("redesign") ||
        userAnswers.websiteType.toLowerCase().includes("refresh")) {
      return "update"; // Immediate return for update
    }
    
    // E-COMMERCE - Premium Plan (Score based on multiple signals)
    if (allText.includes("ecommerce") || allText.includes("e-commerce") || 
        allText.includes("online store") || allText.includes("sell product") || 
        allText.includes("selling") || allText.includes("shopping") || 
        allText.includes("shop") || allText.includes("cart") || 
        allText.includes("checkout") || allText.includes("payment")) {
      scores.premium += 10;
    }
    
    // ENTERPRISE - Complex/Large Projects
    if (allText.includes("enterprise") || allText.includes("dashboard") || 
        allText.includes("integration") || allText.includes("crm") ||
        allText.includes("saas") || allText.includes("complex") ||
        allText.includes("multi-vendor") || allText.includes("subscription") ||
        allText.includes("large company") || allText.includes("compliance") ||
        allText.includes("hipaa") || allText.includes("security")) {
      scores.enterprise += 10;
    }
    
    // STARTER - Simple/Budget (check goal and business type)
    if (allText.includes("simple") || allText.includes("small") || 
        allText.includes("basic") || allText.includes("minimal") ||
        allText.includes("portfolio") || allText.includes("landing page")) {
      scores.starter += 5;
    }
    
    // PRO - Middle ground features
    if (allText.includes("blog") || allText.includes("cms") || 
        allText.includes("content") || allText.includes("professional") ||
        allText.includes("growing") || allText.includes("medium")) {
      scores.pro += 5;
    }
    
    // Additional scoring based on feature count complexity
    const featureLower = userAnswers.mustHaveFeatures.toLowerCase();
    const featureCount = (featureLower.match(/,/g) || []).length + 1;
    
    if (featureCount >= 5) {
      scores.premium += 3;
      scores.enterprise += 2;
    } else if (featureCount <= 2) {
      scores.starter += 3;
    }
    
    // Find highest score
    let selectedPlan = "pro"; // Default
    let maxScore = 0;
    
    for (const [plan, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        selectedPlan = plan;
      }
    }
    
    // If no clear winner (all zeros), use intelligent default
    if (maxScore === 0) {
      // Check business type for context
      const bizLower = userAnswers.businessType.toLowerCase();
      if (bizLower.includes("freelance") || bizLower.includes("personal")) {
        return "starter";
      } else if (bizLower.includes("restaurant") || bizLower.includes("service")) {
        return "pro";
      } else {
        return "pro"; // Safe default
      }
    }
    
    return selectedPlan;
  };

  const autoFillForm = () => {
    // Fill in the goal/notes section with structured data
    const notesField = el("#notes");
    if (notesField) {
      notesField.value = `ALIEN CHAT SUMMARY:\n\n🎯 Goal: ${userAnswers.goal}\n\n💼 Business: ${userAnswers.businessType}\n\n👥 Target Audience: ${userAnswers.targetAudience}\n\n⚙️ Must-Have Features: ${userAnswers.mustHaveFeatures}\n\n🌐 Website Type: ${userAnswers.websiteType}\n\n✨ Inspiration: ${userAnswers.inspiration}\n\n⏰ Timeline: ${userAnswers.timeline}`;
    }
    
    // Fill inspiration field
    const inspoField = el("#inspo");
    if (inspoField && userAnswers.inspiration) {
      inspoField.value = userAnswers.inspiration;
    }
    
    // SMART FEATURE DETECTION - Check across ALL answers, not just features field
    const allAnswersLower = JSON.stringify(userAnswers).toLowerCase();
    
    // E-commerce detection (check goal, business, features)
    if (allAnswersLower.includes("ecommerce") || allAnswersLower.includes("e-commerce") || 
        allAnswersLower.includes("online store") || allAnswersLower.includes("sell product") ||
        allAnswersLower.includes("selling") || allAnswersLower.includes("shop") ||
        allAnswersLower.includes("store") || allAnswersLower.includes("cart") ||
        allAnswersLower.includes("checkout") || allAnswersLower.includes("payment")) {
      const ecomCheck = el('input[name="feature"][value="ecommerce"]');
      if (ecomCheck) ecomCheck.checked = true;
    }
    
    // Blog/CMS detection
    if (allAnswersLower.includes("blog") || allAnswersLower.includes("news") ||
        allAnswersLower.includes("article") || allAnswersLower.includes("content") ||
        allAnswersLower.includes("post")) {
      const blogCheck = el('input[name="feature"][value="blog"]');
      if (blogCheck) blogCheck.checked = true;
    }
    
    // Booking/Scheduling detection
    if (allAnswersLower.includes("booking") || allAnswersLower.includes("schedul") ||
        allAnswersLower.includes("appointment") || allAnswersLower.includes("reservation") ||
        allAnswersLower.includes("calendar")) {
      const bookingCheck = el('input[name="feature"][value="booking"]');
      if (bookingCheck) bookingCheck.checked = true;
    }
    
    // Login/Auth detection
    if (allAnswersLower.includes("login") || allAnswersLower.includes("member") || 
        allAnswersLower.includes("account") || allAnswersLower.includes("user") ||
        allAnswersLower.includes("sign up") || allAnswersLower.includes("register") ||
        allAnswersLower.includes("authentication")) {
      const authCheck = el('input[name="feature"][value="auth"]');
      if (authCheck) authCheck.checked = true;
    }
    
    // Contact form detection (very common)
    if (allAnswersLower.includes("contact") || allAnswersLower.includes("form") ||
        allAnswersLower.includes("inquiry") || allAnswersLower.includes("get in touch")) {
      const contactCheck = el('input[name="feature"][value="contact"]');
      if (contactCheck) contactCheck.checked = true;
    }
    
    // ADDON DETECTION
    
    // AI Chat addon - be specific, don't trigger on "chat with customers"
    const featuresSpecific = userAnswers.mustHaveFeatures.toLowerCase();
    if (featuresSpecific.includes("ai") || featuresSpecific.includes("chatbot") || 
        featuresSpecific.includes("ai chat") || featuresSpecific.includes("virtual assistant") ||
        featuresSpecific.includes("automated chat")) {
      const aiChatCheck = el("#addonAIChat");
      if (aiChatCheck) aiChatCheck.checked = true;
    }
    
    // Sprint addon - check timeline specifically
    const timelineLower = userAnswers.timeline.toLowerCase();
    if (timelineLower.includes("asap") || timelineLower.includes("urgent") || 
        timelineLower.includes("rush") || timelineLower.includes("72") ||
        timelineLower.includes("72-hour") || timelineLower.includes("immediate") ||
        timelineLower.includes("emergency") || timelineLower.includes("quick")) {
      const sprintCheck = el("#addonSprint");
      if (sprintCheck) sprintCheck.checked = true;
    }
    
    // Brand kit addon - check if they mention needing logo/branding
    if (allAnswersLower.includes("logo") || allAnswersLower.includes("branding") ||
        allAnswersLower.includes("brand identity") || allAnswersLower.includes("no logo") ||
        allAnswersLower.includes("need logo")) {
      const brandCheck = el("#addonBrand");
      if (brandCheck) brandCheck.checked = true;
    }
    
    // SEO addon - check if they mention SEO or ranking
    if (allAnswersLower.includes("seo") || allAnswersLower.includes("search engine") ||
        allAnswersLower.includes("google rank") || allAnswersLower.includes("organic") ||
        allAnswersLower.includes("optimization")) {
      const seoCheck = el("#addonSEO");
      if (seoCheck) seoCheck.checked = true;
    }
    
    // Trigger estimate recalculation
    computeAndRenderEstimate();
  };

  const openAlienChat = () => {
    alienDialog.classList.add("active");
    alienChatInput.focus();
    
    if (!hasGreeted) {
      setTimeout(() => {
        pushAlienMessage("bot", questions[0].question);
        hasGreeted = true;
      }, 300);
    }
  };

  const closeAlienChat = () => {
    alienDialog.classList.remove("active");
  };

  const resetChat = () => {
    currentQuestion = 0;
    questionnaireComplete = false;
    userAnswers = {
      goal: "",
      businessType: "",
      targetAudience: "",
      mustHaveFeatures: "",
      websiteType: "",
      inspiration: "",
      timeline: ""
    };
    alienChatLog.innerHTML = "";
    pushAlienMessage("bot", "🔄 **Chat reset!** Starting fresh...\n\n" + questions[0].question);
  };

  const handleAlienQuestion = () => {
    const q = alienChatInput.value.trim();
    if (!q) return;
    
    pushAlienMessage("user", q);
    alienChatInput.value = "";
    
    setTimeout(() => {
      const lower = q.toLowerCase();
      
      // SPECIAL COMMANDS (work anytime)
      
      // Reset chat command
      if (/(^reset$|^reset chat|^start over|^restart)/i.test(lower)) {
        resetChat();
        return;
      }
      
      // Skip to free chat
      if (/(^skip$|^skip questions|^just chat)/i.test(lower) && currentQuestion < questions.length) {
        currentQuestion = questions.length;
        questionnaireComplete = true;
        pushAlienMessage("bot", "👽 No problem! Skipping the questionnaire. I still have what you told me so far!\n\nFeel free to ask me anything:\n• \"Show me cheaper options\"\n• \"What if I remove X feature?\"\n• Pricing, timelines, features, anything!\n\nWhat would you like to know?");
        return;
      }
      
      // QUESTIONNAIRE MODE (still asking questions)
      if (currentQuestion < questions.length && !questionnaireComplete) {
        const followUpMsg = questions[currentQuestion].followUp(q);
        pushAlienMessage("bot", followUpMsg);
        currentQuestion++;
        setTimeout(() => {
          askNextQuestion();
        }, 1500);
        return;
      }
      
      // FREE-FORM CHAT MODE (after questionnaire or skip)
      
      // Handle "cheaper option" requests
      if (/(cheap|cheaper|less expensive|lower cost|reduce cost|budget|save money|too expensive|can't afford)/i.test(lower)) {
        const suggestions = [];
        
        if (userAnswers.mustHaveFeatures) {
          suggestions.push("💡 **Remove some features** - Each feature adds cost. What can you live without for now?");
        }
        
        if (userAnswers.timeline.toLowerCase().includes("asap") || userAnswers.timeline.toLowerCase().includes("urgent")) {
          suggestions.push("⏰ **Standard delivery instead of rush** - Skip the 72-hour sprint ($900 savings)");
        }
        
        suggestions.push("📄 **Reduce page count** - Fewer pages = lower cost. Start with essentials.");
        suggestions.push("🎨 **Simpler design** - Basic animations instead of advanced effects saves money.");
        suggestions.push("📝 **DIY content** - Write your own copy instead of hiring us ($80/page savings).");
        
        const suggestionsText = suggestions.join("\n\n");
        
        pushAlienMessage("bot", `👽 I hear you - let's find ways to reduce the cost while keeping what matters!\n\n**Here's what we can do:**\n\n${suggestionsText}\n\n**Your current needs:**\n🎯 Goal: ${userAnswers.goal || "Not specified"}\n💼 Business: ${userAnswers.businessType || "Not specified"}\n⚙️ Features: ${userAnswers.mustHaveFeatures || "Not specified"}\n\nTell me what you want to adjust, and I'll recalculate! Or I can recommend the **Starter plan ($499)** if you want a simple, affordable option.`);
        return;
      }
      
      // Show current answers
      if (/(what did i say|my answers|show my info|what do you know|remind me)/i.test(lower)) {
        pushAlienMessage("bot", `👽 Here's everything you've told me so far:\n\n🎯 **Goal:** ${userAnswers.goal || "Not answered yet"}\n💼 **Business:** ${userAnswers.businessType || "Not answered yet"}\n👥 **Audience:** ${userAnswers.targetAudience || "Not answered yet"}\n⚙️ **Features:** ${userAnswers.mustHaveFeatures || "Not answered yet"}\n🌐 **Type:** ${userAnswers.websiteType || "Not answered yet"}\n✨ **Inspiration:** ${userAnswers.inspiration || "Not answered yet"}\n⏰ **Timeline:** ${userAnswers.timeline || "Not answered yet"}\n\nWant to change anything? Just tell me, or type 'reset' to start over!`);
        return;
      }
      
      // Take me to estimate
      if (/(take me to estimate|show estimate|go to form|fill form|done|ready|send me there)/i.test(lower)) {
        if (!userAnswers.goal && !userAnswers.businessType) {
          pushAlienMessage("bot", "👽 You haven't answered any questions yet! Let me ask you a few quick ones first, or type 'skip' to go directly to the form.");
          setTimeout(() => {
            askNextQuestion();
          }, 1500);
          return;
        }
        
        pushAlienMessage("bot", "👽 Perfect! Taking you to your personalized estimate now...\n\n🚀 Everything I know about your project will be pre-filled. Review it and hit **Send Brief** when ready!");
        
        setTimeout(() => {
          autoFillForm();
          closeAlienChat();
          let suggestedPlan = determinePlan();
          openPlan(suggestedPlan);
          setTimeout(() => {
            const formSection = el("#plan-world");
            if (formSection) {
              formSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 500);
        }, 2000);
        return;
      }
      
      // Greetings
      if (/(^hi$|^hey|^hello|^greetings|^howdy)/i.test(lower)) {
        if (questionnaireComplete) {
          pushAlienMessage("bot", "👽 Hey again, Earthling! Need help with anything?\n\n• \"Show me cheaper options\"\n• \"Take me to estimate\"\n• \"What did I say?\"\n• Or ask any question!\n\nWhat do you need?");
        } else {
          pushAlienMessage("bot", "👽 Hey! Ready to answer the next question? Or type 'skip' to chat freely!");
        }
        return;
      }

      // Thank you
      if (/(thank|thanks|thx|appreciate)/i.test(lower)) {
        pushAlienMessage("bot", "👽 You're welcome, Earthling! Anything else I can help with?");
        return;
      }

      // Use the answer function for other questions
      const response = answer(q);
      if (response && response !== "Hmm, I don't have that info yet—call 818-261-7850 or email devbyb12@gmail.com for details.") {
        pushAlienMessage("bot", "👽 " + response);
      } else {
        pushAlienMessage("bot", "👽 Interesting question! For detailed answers, contact us:\n📞 818-261-7850\n✉️ devbyb12@gmail.com");
      }
    }, 400);
  };

  // Event listeners
  alienShip.addEventListener("click", openAlienChat);
  alienClose.addEventListener("click", closeAlienChat);
  alienChatSend.addEventListener("click", handleAlienQuestion);
  
  alienChatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAlienQuestion();
    }
  });

  // Close on backdrop click
  alienDialog.addEventListener("click", (e) => {
    if (e.target === alienDialog) closeAlienChat();
  });
}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
