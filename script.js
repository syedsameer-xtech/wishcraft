/* ============================================================
   WishCraft — script.js  (complete upgrade)
   ============================================================ */

const CLOUDINARY_CLOUD_NAME   = "danzponmi";
const CLOUDINARY_UNSIGNED_PRESET = "wishcraft";

let uploadedPhotoUrl = "";
let lastQrBlob       = null;
let lastQrObjectUrl  = "";
let lastShareUrl     = "";

// ── Theme Palette ────────────────────────────────────────────
const THEMES = [
  { id:"bronzenoir",      label:"Bronze Noir",      a:"#b38f6f", b:"#161616", qrFg:"111111", qrBg:"ffffff" },
  { id:"sandwine",        label:"Sand Wine",         a:"#9e9a8d", b:"#80011f", qrFg:"ffffff", qrBg:"111111" },
  { id:"earthoak",        label:"Earth Oak",         a:"#b57a4a", b:"#301c1b", qrFg:"ffffff", qrBg:"111111" },
  { id:"roseice",         label:"Rose Ice",          a:"#c3dbe7", b:"#64303d", qrFg:"111111", qrBg:"ffffff" },
  { id:"mintnavy",        label:"Mint Navy",         a:"#c3fdb8", b:"#1d2545", qrFg:"1d2545", qrBg:"c3fdb8" },
  { id:"burntcream",      label:"Burnt Cream",       a:"#c14a09", b:"#ffffc5", qrFg:"c14a09", qrBg:"ffffc5" },
  { id:"pinkazure",       label:"Pink Azure",        a:"#fff0f5", b:"#007fff", qrFg:"007fff", qrBg:"fff0f5" },
  { id:"tealgold",        label:"Teal Gold",         a:"#00555a", b:"#ffca4b", qrFg:"00555a", qrBg:"ffca4b" },
  { id:"buttergraphite",  label:"Butter Graphite",   a:"#F8DE7E", b:"#39393F", qrFg:"39393F", qrBg:"F8DE7E" },
  { id:"bluemist",        label:"Blue Mist",         a:"#26538D", b:"#F0FFFF", qrFg:"26538D", qrBg:"F0FFFF" },
  { id:"parchmentwine",   label:"Parchment Wine",    a:"#DAD4B6", b:"#5C0120", qrFg:"5C0120", qrBg:"DAD4B6" },
  { id:"forestlemon",     label:"Forest Lemon",      a:"#05472A", b:"#DFEF87", qrFg:"05472A", qrBg:"DFEF87" },
  { id:"midnightviolet",  label:"Midnight Violet",   a:"#7b2cff", b:"#0b0b14", qrFg:"ffffff", qrBg:"0b0b14" },
  { id:"auroracoral",     label:"Aurora Coral",      a:"#0a2239", b:"#ff6b6b", qrFg:"0a2239", qrBg:"fff0f5" },
  { id:"velvetrose",      label:"Velvet Rose",       a:"#e91e8c", b:"#1a0012", qrFg:"ffffff", qrBg:"1a0012" },
  { id:"slatecinnamon",   label:"Slate Cinnamon",    a:"#cf8c5a", b:"#2a2f3d", qrFg:"ffffff", qrBg:"2a2f3d" },
  { id:"olivecarbon",     label:"Olive Carbon",      a:"#8c9a3a", b:"#1c1e18", qrFg:"ffffff", qrBg:"1c1e18" },
  { id:"icefire",         label:"Ice Fire",          a:"#00c8ff", b:"#ff4200", qrFg:"ffffff", qrBg:"111111" },
];

const FONTS = [
  { id:"auto",      name:"Auto (by theme)",         css:"'Space Grotesk', system-ui, sans-serif" },
  { id:"poppins",   name:"Poppins — Modern",         css:"Poppins, system-ui, sans-serif" },
  { id:"montserrat",name:"Montserrat — Clean",       css:"Montserrat, system-ui, sans-serif" },
  { id:"raleway",   name:"Raleway — Elegant",        css:"Raleway, system-ui, sans-serif" },
  { id:"playfair",  name:"Playfair Display — Luxury",css:"'Playfair Display', serif" },
  { id:"cinzel",    name:"Cinzel — Royal",           css:"Cinzel, serif" },
  { id:"pacifico",  name:"Pacifico — Handwritten",   css:"Pacifico, cursive" },
  { id:"dms",       name:"DM Serif — Editorial",     css:"'DM Serif Display', serif" },
];

const TEMPLATES = [
  { id:"t1", name:"Premium Glow" },
  { id:"t2", name:"Centered Minimal" },
  { id:"t3", name:"Split Photo" },
  { id:"t4", name:"Bold Poster" },
];

const $ = (id) => document.getElementById(id);

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = "info") {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("show");
  // Force reflow so animation re-triggers
  void el.offsetWidth;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

// ── Status Badge ─────────────────────────────────────────────
function setStatus(state, text) {
  const el = $("statusBadge");
  if (!el) return;
  el.className = "status-badge " + (state || "");
  el.querySelector("span:last-child") && (el.querySelector("span:last-child").textContent = " " + text);
}

// ── Utils ────────────────────────────────────────────────────
function safeText(s, max = 220) {
  return String(s || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
}
function b64DecodeUnicode(b64) {
  const bin = atob(b64);
  let pct = "";
  for (let i = 0; i < bin.length; i++) pct += "%" + ("00" + bin.charCodeAt(i).toString(16)).slice(-2);
  return decodeURIComponent(pct);
}
function toB64(obj)  { return b64EncodeUnicode(JSON.stringify(obj)); }
function fromB64(b64){ return JSON.parse(b64DecodeUnicode(b64)); }

function isColorDark(hex) {
  const h = (hex || "#000").replace("#", "").trim();
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.45;
}

function calcAge(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  const dob = new Date(dateStr);
  if (isNaN(dob.getTime())) return null;
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 && age < 150 ? age : null;
}

function ordinalSuffix(n) {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── CSS Vars ─────────────────────────────────────────────────
function setCSSVars(themeId) {
  const t = THEMES.find(x => x.id === themeId) || THEMES[0];
  document.documentElement.style.setProperty("--a", t.a);
  document.documentElement.style.setProperty("--b", t.b);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.b);
  return t;
}

function applyEffect(effect) {
  document.body.classList.remove("fx-glow", "fx-sparkle", "fx-neon", "fx-glass", "fx-aurora");
  if (effect && effect !== "auto") document.body.classList.add("fx-" + effect);
}

function applyFont(fontId, themeId) {
  const font = FONTS.find(f => f.id === fontId);
  if (!font || fontId === "auto") {
    const theme = THEMES.find(t => t.id === themeId);
    const dark  = isColorDark(theme?.b || "#000");
    document.body.style.fontFamily = dark ? "Montserrat, system-ui, sans-serif" : "Poppins, system-ui, sans-serif";
    return;
  }
  document.body.style.fontFamily = font.css;
}

// ── Background Stars ─────────────────────────────────────────
function initStars() {
  const c = $("bgStars");
  if (!c) return;
  const ctx = c.getContext("2d");
  function draw() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    const count = Math.floor((c.width * c.height) / 8000);
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const r = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * .5 + .1})`;
      ctx.fill();
    }
  }
  draw();
  window.addEventListener("resize", draw);
}

// ── Stage Particles (live preview) ───────────────────────────
function initStageParticles() {
  const c = $("stageParticles");
  if (!c) return;
  const ctx = c.getContext("2d");
  const particles = [];
  let raf;

  function resize() {
    c.width  = c.parentElement.offsetWidth;
    c.height = c.parentElement.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(c.parentElement);

  // seed particles
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random(), y: Math.random() + .5,
      vx: (Math.random() - .5) * .0003,
      vy: -(Math.random() * .0005 + .0002),
      r: Math.random() * 2 + 1,
      a: Math.random(),
    });
  }

  function frame() {
    ctx.clearRect(0, 0, c.width, c.height);
    const computed = getComputedStyle(document.documentElement);
    const colorA = computed.getPropertyValue("--a").trim() || "#b38f6f";
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -.01) p.y = 1.01;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x * c.width, p.y * c.height, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colorA + "55";
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  frame();
}

// ── Char Counter ─────────────────────────────────────────────
function updateCharCount() {
  const ta = $("msgInput");
  const cc = $("charCount");
  if (ta && cc) cc.textContent = ta.value.length;
}

// ── Swatch Bar ───────────────────────────────────────────────
function buildSwatchBar() {
  const bar = $("swatchBar");
  if (!bar) return;
  bar.innerHTML = "";
  for (const t of THEMES) {
    const sw = document.createElement("div");
    sw.className = "swatch";
    sw.title = t.label;
    sw.dataset.themeId = t.id;
    sw.innerHTML = `<div class="swatch-inner"><div class="swatch-half" style="background:${t.a}"></div><div class="swatch-half" style="background:${t.b}"></div></div>`;
    sw.addEventListener("click", () => {
      $("themeSelect") && ($("themeSelect").value = t.id);
      updateLive();
      updateActiveSwatch(t.id);
    });
    bar.appendChild(sw);
  }
}

function updateActiveSwatch(themeId) {
  document.querySelectorAll(".swatch").forEach(sw => {
    sw.classList.toggle("active", sw.dataset.themeId === themeId);
  });
}

// ── Theme Preview Strip ───────────────────────────────────────
function buildThemeStrip() {
  const strip = $("themePreviewStrip");
  if (!strip) return;
  strip.innerHTML = "";
  for (const t of THEMES) {
    const mini = document.createElement("div");
    mini.className = "theme-swatch-mini";
    mini.style.background = `linear-gradient(90deg, ${t.a}, ${t.b})`;
    mini.title = t.label;
    strip.appendChild(mini);
  }
}

// ── Live Preview Update ───────────────────────────────────────
function updateLive() {
  const name     = safeText($("nameInput")?.value || "Friend", 32);
  const msg      = safeText($("msgInput")?.value  || "Wishing you a day full of joy, laughter, and love. Happy Birthday! 🎉", 220);
  const themeId  = $("themeSelect")?.value  || "bronzenoir";
  const fontId   = $("fontSelect")?.value   || "auto";
  const effect   = $("accentToggle")?.value || "auto";
  const template = $("templateSelect")?.value || "t1";
  const dateVal  = $("dateInput")?.value || "";

  setCSSVars(themeId);
  applyFont(fontId, themeId);
  applyEffect(effect);
  updateActiveSwatch(themeId);
  updateCharCount();

  $("liveName") && ($("liveName").textContent = name);
  $("liveMsg")  && ($("liveMsg").textContent  = msg);

  const ageEl = $("liveAge");
  if (ageEl) {
    const age = calcAge(dateVal);
    if (age !== null) {
      ageEl.textContent = `Turning ${ordinalSuffix(age + 1)}`;
      ageEl.style.display = "";
    } else {
      ageEl.style.display = "none";
    }
  }

  const liveStage = $("liveStage");
  if (liveStage) liveStage.className = "stage " + template;

  const livePhoto = $("livePhoto");
  const fallback  = document.querySelector(".photoFrame .phFallback");
  if (uploadedPhotoUrl && livePhoto) {
    livePhoto.src = uploadedPhotoUrl;
    livePhoto.style.display = "block";
    if (fallback) fallback.style.display = "none";
  } else if (livePhoto) {
    livePhoto.removeAttribute("src");
    livePhoto.style.display = "none";
    if (fallback) fallback.style.display = "block";
  }
}

// ── Cloudinary Upload ─────────────────────────────────────────
async function uploadToCloudinary(file) {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET);
  form.append("folder", "wishcraft");
  const res = await fetch(endpoint, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary upload failed: " + await res.text().catch(() => ""));
  return res.json();
}

// ── QR Code ───────────────────────────────────────────────────
function qrApiUrl(shareUrl, theme) {
  const fg     = (theme.qrFg || "111111").replace("#", "");
  const bg     = (theme.qrBg || "ffffff").replace("#", "");
  const params = new URLSearchParams({
    size: "640x640", data: shareUrl,
    color: fg, bgcolor: bg,
    margin: "12", qzone: "2", format: "png",
  });
  return "https://api.qrserver.com/v1/create-qr-code/?" + params.toString();
}

function cleanupQrObjectUrl() {
  if (lastQrObjectUrl) { URL.revokeObjectURL(lastQrObjectUrl); lastQrObjectUrl = ""; }
}

async function buildQrBlob(shareUrl, themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const url   = qrApiUrl(shareUrl, theme);
  const res   = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("QR fetch failed");

  const blob = await res.blob();
  cleanupQrObjectUrl();
  lastQrBlob       = blob;
  lastQrObjectUrl  = URL.createObjectURL(blob);

  const wrap = $("qrWrap");
  if (wrap) {
    wrap.innerHTML = "";
    const img = document.createElement("img");
    img.alt      = "QR Code";
    img.decoding = "async";
    img.src      = lastQrObjectUrl;
    wrap.appendChild(img);
  }

  [$("downloadQrBtn"), $("shareQrBtn"), $("copyQrBtn")].forEach(btn => {
    if (btn) btn.disabled = false;
  });
}

// ── Confetti ──────────────────────────────────────────────────
function confettiBurst(durationMs = 2600) {
  const c = $("confetti");
  if (!c) return;
  const ctx = c.getContext("2d");
  if (!ctx) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  c.width  = Math.floor(c.clientWidth  * dpr);
  c.height = Math.floor(c.clientHeight * dpr);

  const colors = ["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8"];
  const pieces = Array.from({ length: 200 }).map(() => ({
    x: Math.random() * c.width,
    y: -Math.random() * c.height * .25,
    vx: (Math.random() - .5) * 3 * dpr,
    vy: (Math.random() * 3 + 1.5) * dpr,
    r: (Math.random() * 7 + 2) * dpr,
    a: Math.random() * Math.PI * 2,
    va: (Math.random() - .5) * .22,
    g: (Math.random() * .07 + .03) * dpr,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: Math.random() > .5 ? "rect" : "circle",
  }));

  const t0 = performance.now();
  function frame(t) {
    const elapsed = t - t0;
    const alpha = elapsed > durationMs - 600 ? Math.max(0, 1 - (elapsed - (durationMs - 600)) / 600) : 1;
    ctx.clearRect(0, 0, c.width, c.height);

    for (const p of pieces) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.a += p.va;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      }
      ctx.restore();
    }

    if (elapsed < durationMs) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, c.width, c.height);
  }
  requestAnimationFrame(frame);
}

// ── Player ────────────────────────────────────────────────────
function showBuilder() { $("builder")?.classList.remove("hidden"); $("player")?.classList.add("hidden"); }
function showPlayer()  { $("builder")?.classList.add("hidden");    $("player")?.classList.remove("hidden"); }

function renderPlayer(payload) {
  const name     = safeText(payload.name   || "Friend", 32);
  const msg      = safeText(payload.msg    || "Wishing you a day full of joy, laughter, and love. Happy Birthday! 🎉", 220);
  const themeId  = payload.theme    || "bronzenoir";
  const fontId   = payload.font     || "auto";
  const effect   = payload.effect   || "auto";
  const template = payload.template || "t1";
  const photo    = payload.photo    || "";
  const anim     = payload.anim     || "fade";
  const dateVal  = payload.date     || "";

  setCSSVars(themeId);
  applyFont(fontId, themeId);
  applyEffect(effect);

  $("pName") && ($("pName").textContent = name);
  $("pMsg")  && ($("pMsg").textContent  = msg);

  const pAgeEl = $("pAge");
  if (pAgeEl) {
    const age = calcAge(dateVal);
    if (age !== null) {
      pAgeEl.textContent  = `Turning ${ordinalSuffix(age + 1)} 🎂`;
      pAgeEl.style.display = "";
    } else {
      pAgeEl.style.display = "none";
    }
  }

  const stage = $("playerStage");
  if (stage) stage.className = "playerStage " + template + " anim-" + anim;

  const img       = $("pPhoto");
  const fallback  = document.querySelector(".playerPhoto .phFallback");
  const photoWrap = document.querySelector(".playerPhoto");

  if (photo && img) {
    img.src = photo;
    img.style.display = "block";
    if (fallback)  fallback.style.display  = "none";
    if (photoWrap) photoWrap.style.display = "";
    stage?.classList.remove("no-photo");
  } else if (img) {
    img.removeAttribute("src");
    img.style.display = "none";
    if (fallback)  fallback.style.display  = "block";
    if (photoWrap) photoWrap.style.display = "none";
    stage?.classList.add("no-photo");
  }

  document.title = `Happy Birthday, ${name}! — WishCraft`;
  confettiBurst(2800);
}

// ── Populate Selects ──────────────────────────────────────────
function fillThemes() {
  const el = $("themeSelect");
  if (!el) return;
  el.innerHTML = "";
  for (const t of THEMES) {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.label}`;
    el.appendChild(opt);
  }
}

function fillSelect(el, items) {
  if (!el) return;
  el.innerHTML = "";
  for (const it of items) {
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = it.name;
    el.appendChild(opt);
  }
}

// ── Drag & Drop Upload ────────────────────────────────────────
function setupDragDrop() {
  const zone = $("uploadZone");
  if (!zone) return;

  zone.addEventListener("click", (e) => {
    if (e.target === $("removePhotoBtn")) return;
    $("photoInput")?.click();
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", async (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) await handlePhotoFile(file);
  });
}

async function handlePhotoFile(file) {
  if (file.size > 4 * 1024 * 1024) { toast("Please upload under 4 MB ⚠️"); return; }

  const stateEl = $("uploadState");
  if (stateEl) stateEl.textContent = "Uploading…";
  setStatus("uploading", "Uploading…");

  try {
    const data = await uploadToCloudinary(file);
    uploadedPhotoUrl = data.secure_url;

    const prev = $("photoPreview");
    const wrap = document.querySelector(".upload-preview-wrap");
    if (prev) {
      prev.src = uploadedPhotoUrl;
      prev.style.display = "block";
    }
    if (wrap) wrap.classList.add("visible");
    if (stateEl) stateEl.textContent = "Uploaded ✓";
    setStatus("", "Ready");
    updateLive();
    toast("Photo uploaded ✅");
  } catch (err) {
    console.error(err);
    if (stateEl) stateEl.textContent = "Upload failed ✗";
    setStatus("error", "Error");
    toast("Upload failed. Check your Cloudinary preset.");
  }
}

// ── Wire Events ───────────────────────────────────────────────
function wireEvents() {

  // Reactive live preview
  ["nameInput","msgInput","themeSelect","templateSelect","fontSelect","accentToggle","dateInput"].forEach(id => {
    $(id)?.addEventListener("input",  updateLive);
    $(id)?.addEventListener("change", updateLive);
  });

  // Reset
  $("resetBtn")?.addEventListener("click", () => {
    $("nameInput")      && ($("nameInput").value      = "");
    $("msgInput")       && ($("msgInput").value       = "Wishing you a day full of joy, laughter, and love. Happy Birthday! 🎉");
    $("themeSelect")    && ($("themeSelect").value    = "bronzenoir");
    $("templateSelect") && ($("templateSelect").value = "t1");
    $("fontSelect")     && ($("fontSelect").value     = "auto");
    $("accentToggle")   && ($("accentToggle").value   = "auto");
    $("animSelect")     && ($("animSelect").value     = "fade");
    $("dateInput")      && ($("dateInput").value      = "");

    uploadedPhotoUrl = "";
    lastShareUrl     = "";
    lastQrBlob       = null;
    cleanupQrObjectUrl();

    const prev = $("photoPreview");
    if (prev) { prev.removeAttribute("src"); prev.style.display = "none"; }
    document.querySelector(".upload-preview-wrap")?.classList.remove("visible");
    $("uploadState") && ($("uploadState").textContent = "No photo selected");
    $("shareLink")   && ($("shareLink").value = "");
    $("qrWrap")      && ($("qrWrap").innerHTML = '<div class="qr-placeholder"><div class="qr-placeholder-icon">⬛</div><div>QR appears after generating</div></div>');
    $("openLinkBtn") && ($("openLinkBtn").style.display = "none");

    [$("downloadQrBtn"), $("shareQrBtn"), $("copyQrBtn")].forEach(b => b && (b.disabled = true));

    updateLive();
    toast("Reset ✓");
  });

  // Copy link
  $("copyBtn")?.addEventListener("click", async () => {
    const val = ($("shareLink")?.value || "").trim();
    if (!val) return toast("Generate a link first");
    try {
      await navigator.clipboard.writeText(val);
      toast("Link copied ✅");
    } catch {
      toast("Copy failed — select and copy manually");
    }
  });

  // File input change
  $("photoInput")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handlePhotoFile(file);
    e.target.value = "";
  });

  // Remove photo
  $("removePhotoBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    uploadedPhotoUrl = "";
    const prev = $("photoPreview");
    if (prev) { prev.removeAttribute("src"); prev.style.display = "none"; }
    document.querySelector(".upload-preview-wrap")?.classList.remove("visible");
    $("uploadState") && ($("uploadState").textContent = "No photo selected");
    updateLive();
    toast("Photo removed");
  });

  // Generate
  $("generateBtn")?.addEventListener("click", async () => {
    const btn = $("generateBtn");
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Generating…'; }

    const name     = safeText($("nameInput")?.value || "Friend", 32);
    const msg      = safeText($("msgInput")?.value  || "Wishing you a day full of joy, laughter, and love. Happy Birthday! 🎉", 220);
    const themeId  = $("themeSelect")?.value    || "bronzenoir";
    const template = $("templateSelect")?.value || "t1";
    const fontId   = $("fontSelect")?.value     || "auto";
    const effect   = $("accentToggle")?.value   || "auto";
    const anim     = $("animSelect")?.value     || "fade";
    const dateVal  = $("dateInput")?.value      || "";

    const payload = { v: 8, name, msg, theme: themeId, template, font: fontId, effect, anim, photo: uploadedPhotoUrl || "", date: dateVal };
    const hash     = "#wish=" + encodeURIComponent(toB64(payload));
    const shareUrl = location.origin + location.pathname + hash;

    lastShareUrl = shareUrl;
    $("shareLink") && ($("shareLink").value = shareUrl);

    const openBtn = $("openLinkBtn");
    if (openBtn) { openBtn.href = shareUrl; openBtn.style.display = ""; }

    try {
      await buildQrBlob(shareUrl, themeId);
      toast("Link + QR ready ✅");
    } catch (e) {
      console.error(e);
      toast("QR failed — check connection");
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<span class="btn-icon">🔗</span> Generate Link + QR'; }
  });

  // Download QR
  $("downloadQrBtn")?.addEventListener("click", () => {
    if (!lastQrBlob || !lastQrObjectUrl) return toast("Generate QR first");
    const a = document.createElement("a");
    a.href = lastQrObjectUrl;
    a.download = "wishcraft-qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Downloading QR ⬇");
  });

  // Share QR
  $("shareQrBtn")?.addEventListener("click", async () => {
    if (!lastQrBlob) return toast("Generate QR first");
    if (!navigator.share) return toast("Sharing not supported — use Download");
    try {
      const file = new File([lastQrBlob], "wishcraft-qr.png", { type: "image/png" });
      await navigator.share({ title: "WishCraft QR", text: "Scan to open the birthday wish.", files: [file], url: lastShareUrl || undefined });
      toast("Shared ✅");
    } catch { toast("Share cancelled"); }
  });

  // Copy QR
  $("copyQrBtn")?.addEventListener("click", async () => {
    if (!lastQrBlob) return toast("Generate QR first");
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": lastQrBlob })]);
        toast("QR image copied ✅");
      } else {
        toast("Copy not supported — use Download");
      }
    } catch { toast("Copy failed — use Download"); }
  });

  // Replay
  $("replayBtn")?.addEventListener("click", () => {
    confettiBurst(2800);
    const hero = $("playerHero");
    if (hero) { hero.classList.remove("replay-bounce"); void hero.offsetWidth; hero.classList.add("replay-bounce"); }
    toast("🎉 Happy Birthday!");
  });

  // Hash change
  window.addEventListener("hashchange", () => location.reload());

  // Keyboard: Enter on inputs
  ["nameInput","msgInput"].forEach(id => {
    $(id)?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && id === "nameInput") {
        e.preventDefault();
        $("msgInput")?.focus();
      }
    });
  });
}

// ── Boot ──────────────────────────────────────────────────────
function boot() {
  // Background
  initStars();

  // Populate selects
  fillThemes();
  fillSelect($("templateSelect"), TEMPLATES);
  fillSelect($("fontSelect"), FONTS);

  // Defaults
  $("themeSelect")    && ($("themeSelect").value    = "bronzenoir");
  $("templateSelect") && ($("templateSelect").value = "t1");
  $("fontSelect")     && ($("fontSelect").value     = "auto");
  $("accentToggle")   && ($("accentToggle").value   = "auto");
  $("animSelect")     && ($("animSelect").value     = "fade");

  // Build UI extras
  buildSwatchBar();
  buildThemeStrip();
  setupDragDrop();

  // Check URL for player mode
  const match = location.hash.match(/wish=([^&]+)/);
  if (match) {
    try {
      const payload = fromB64(decodeURIComponent(match[1]));
      showPlayer();
      renderPlayer(payload);
      wireEvents();
      return;
    } catch (e) {
      console.error("Invalid wish payload", e);
    }
  }

  // Builder mode
  showBuilder();
  updateLive();
  initStageParticles();
  wireEvents();
}

boot();
