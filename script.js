const $ = (id) => document.getElementById(id);

const creator = $("creator");
const viewer = $("viewer");

const wishForm = $("wishForm");
const nameInput = $("nameInput");
const themeInput = $("themeInput");
const templateInput = $("templateInput");
const fontInput = $("fontInput");
const msgInput = $("msgInput");
const photoInput = $("photoInput");
const fileHint = $("fileHint");
const agreeTc = $("agreeTc");
const resetBtn = $("resetBtn");
const warn = $("warn");

const previewName = $("previewName");
const previewMsg = $("previewMsg");
const previewAvatar = $("previewAvatar");
const previewMeta = $("previewMeta");
const chipTemplate = $("chipTemplate");

const wishCardPreview = $("wishCardPreview");
const wishCard = $("wishCard");

const linkBox = $("linkBox");
const shareLink = $("shareLink");
const copyBtn = $("copyBtn");
const shareBtn = $("shareBtn");
const copyStatus = $("copyStatus");

const wishName = $("wishName");
const wishMsg = $("wishMsg");
const wishAvatar = $("wishAvatar");
const photoFrame = $("photoFrame");
const wishPhoto = $("wishPhoto");

const makeNewBtn = $("makeNewBtn");
const replayBtn = $("replayBtn");

const confettiCanvas = $("confetti");
const tcDate = $("tcDate");
if (tcDate) tcDate.textContent = new Date().toLocaleDateString();

let photoDataUrl = "";

/* THEMES (12) */
const THEMES = {
  sagewine:   { colors: ["#9e9a8d", "#80011f"], template: "t3", fonts: "editorial" },
  goldblack:  { colors: ["#b38f6f", "#161616"], template: "t2", fonts: "cinematic" },
  leather:    { colors: ["#301c1b", "#3f2a0d"], template: "t8", fonts: "serifLuxury" },
  roseice:    { colors: ["#64303d", "#c3dbe7"], template: "t1", fonts: "script" },

  mintnavy:   { colors: ["#c3fdb8", "#1d2545"], template: "t6", fonts: "modernSans" },
  ambercream: { colors: ["#c14a09", "#ffffc5"], template: "t5", fonts: "displayBold" },
  blushazure: { colors: ["#fff0f5", "#007fff"], template: "t4", fonts: "grotesk" },
  tealgold:   { colors: ["#00555a", "#ffca4b"], template: "t2", fonts: "displayBold" },

  champagnegraphite: { colors: ["#F8DE7E", "#39393F"], template: "t2", fonts: "caviar" },
  royalice:          { colors: ["#26538D", "#F0FFFF"], template: "t1", fonts: "walkway" },
  parchmentwine:     { colors: ["#DAD4B6", "#5C0120"], template: "t8", fonts: "okaluera" },
  forestlime:        { colors: ["#05472A", "#DFEF87"], template: "t6", fonts: "eightone" },
};

/* FONT PACKS */
const FONT_PACKS = {
  displayBold: {
    display: `"CustomDisplay","Futura","Trebuchet MS","Segoe UI",system-ui,sans-serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
  },
  serifLuxury: {
    display: `"Georgia","Times New Roman",serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
  },
  modernSans: {
    display: `"Avenir Next","Segoe UI",system-ui,sans-serif`,
    body: `"Avenir","Segoe UI",system-ui,sans-serif`,
    accent: `"Avenir","Segoe UI",system-ui,sans-serif`,
  },
  cinematic: {
    display: `"Copperplate","Garamond","Georgia",serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `"Garamond","Georgia",serif`,
  },
  grotesk: {
    display: `"Franklin Gothic Medium","Arial Narrow","Segoe UI",system-ui,sans-serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
  },
  tech: {
    display: `"SFMono-Regular","Consolas","Liberation Mono",monospace`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `"SFMono-Regular","Consolas","Liberation Mono",monospace`,
  },
  street: {
    display: `"Impact","Arial Black",system-ui,sans-serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
  },
  script: {
    display: `"CustomDisplay","Futura","Trebuchet MS","Segoe UI",system-ui,sans-serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `"CustomScript","Pacifico","Segoe Script",cursive`,
  },
  editorial: {
    display: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `"Palatino Linotype","Book Antiqua",Palatino,serif`,
  },

  /* Your requested packs */
  caviar: {
    display: `"CaviarDreams","Montserrat","Segoe UI",system-ui,sans-serif`,
    body: `"CaviarDreams","Segoe UI",system-ui,sans-serif`,
    accent: `"CaviarDreams","Segoe UI",system-ui,sans-serif`,
  },
  walkway: {
    display: `"Walkway","Avenir Next","Segoe UI",system-ui,sans-serif`,
    body: `"Walkway","Segoe UI",system-ui,sans-serif`,
    accent: `"Walkway","Segoe UI",system-ui,sans-serif`,
  },
  coolvetika: {
    display: `"Coolvetika","Poppins","Segoe UI",system-ui,sans-serif`,
    body: `"Poppins","Segoe UI",system-ui,sans-serif`,
    accent: `"Poppins","Segoe UI",system-ui,sans-serif`,
  },
  eightone: {
    display: `"EightOne","Oswald","Segoe UI",system-ui,sans-serif`,
    body: `"Oswald","Segoe UI",system-ui,sans-serif`,
    accent: `"Oswald","Segoe UI",system-ui,sans-serif`,
  },
  okaluera: {
    display: `"Okaluera","Playfair Display","Georgia",serif`,
    body: `"Playfair Display","Georgia",serif`,
    accent: `"Okaluera","Playfair Display","Georgia",serif`,
  },

  custom: {
    display: `"CustomDisplay","Tusker","Bone Slayer","Hype 1400","Futura","Segoe UI",system-ui,sans-serif`,
    body: `system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,
    accent: `"CustomScript","Pacifico","Kirana","Segoe Script",cursive`,
  },
};

function setVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function applyTheme(themeName, templateChoice, fontChoice) {
  const theme = THEMES[themeName] || THEMES.roseice;
  const [p1, p2] = theme.colors;

  setVar("--p1", p1);
  setVar("--p2", p2);

  const template = templateChoice || theme.template || "t1";
  if (wishCardPreview) wishCardPreview.dataset.template = template;
  if (wishCard) wishCard.dataset.template = template;
  if (chipTemplate) chipTemplate.textContent = `🪄 ${template}`;

  const fontKey = (fontChoice && fontChoice !== "auto") ? fontChoice : (theme.fonts || "displayBold");
  const fp = FONT_PACKS[fontKey] || FONT_PACKS.displayBold;

  setVar("--fontDisplay", fp.display);
  setVar("--fontBody", fp.body);
  setVar("--fontAccent", fp.accent);

  if (previewMeta) previewMeta.textContent = `${themeName} • ${template} • ${fontChoice || "auto"}`;
}

function setAvatar(div, dataUrl, emoji = "🎂") {
  if (!div) return;
  div.innerHTML = "";
  if (!dataUrl) {
    const span = document.createElement("span");
    span.className = "avatarEmoji";
    span.textContent = emoji;
    div.appendChild(span);
    return;
  }
  const img = document.createElement("img");
  img.src = dataUrl;
  img.alt = "Photo";
  div.appendChild(img);
}

function updatePreview() {
  if (previewName) previewName.textContent = (nameInput?.value || "").trim() || "Friend";
  if (previewMsg) previewMsg.textContent = (msgInput?.value || "").trim();
  setAvatar(previewAvatar, photoDataUrl, "🎂");
  applyTheme(themeInput?.value || "roseice", templateInput?.value || "", fontInput?.value || "auto");
}

/* URL (GitHub Pages safe: hash) */
function encodeData(obj) {
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)));
}
function decodeData(b64) {
  const json = decodeURIComponent(escape(atob(b64)));
  return JSON.parse(json);
}
function buildShareUrl(payloadB64) {
  const base = `${location.origin}${location.pathname}`;
  return `${base}#wish=${payloadB64}`;
}
function readWishFromUrl() {
  const hash = location.hash || "";
  const match = hash.match(/wish=([^&]+)/);
  if (!match) return null;
  try { return decodeData(match[1]); } catch { return null; }
}

/* Image compression */
async function fileToCompressedDataURL(file, maxSize = 900, quality = 0.80) {
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let { width, height } = img;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

/* Confetti */
function fitCanvas(canvas) {
  if (!canvas || !viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  canvas.width = Math.floor(rect.width * devicePixelRatio);
  canvas.height = Math.floor(rect.height * devicePixelRatio);
}

let confettiRAF = null;
function launchConfetti(durationMs = 2400) {
  if (!confettiCanvas) return;
  cancelAnimationFrame(confettiRAF);
  fitCanvas(confettiCanvas);

  const ctx = confettiCanvas.getContext("2d");
  const w = confettiCanvas.width, h = confettiCanvas.height;
  if (!w || !h) return;

  const p1 = getComputedStyle(document.documentElement).getPropertyValue("--p1").trim() || "#fff";
  const p2 = getComputedStyle(document.documentElement).getPropertyValue("--p2").trim() || "#fff";

  const count = 260;
  const parts = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -Math.random() * h * 0.6,
    vx: (Math.random() - 0.5) * 2.4 * devicePixelRatio,
    vy: (Math.random() * 4.2 + 2.0) * devicePixelRatio,
    r: (Math.random() * 7 + 3) * devicePixelRatio,
    a: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 0.22,
    life: Math.random() * 0.7 + 0.3,
    c: Math.random() > 0.5 ? p1 : p2,
  }));

  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    const elapsed = t - start;
    const fade = Math.max(0, 1 - elapsed / durationMs);

    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02 * devicePixelRatio;
      p.a += p.va;

      ctx.save();
      ctx.globalAlpha = fade * p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r * 0.55, p.r * 2, p.r * 1.1);
      ctx.restore();
    }

    if (elapsed < durationMs) confettiRAF = requestAnimationFrame(frame);
  }
  confettiRAF = requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
  if (viewer && !viewer.classList.contains("hidden")) fitCanvas(confettiCanvas);
});

/* Typewriter */
async function typewriter(elm, text, speed = 14) {
  if (!elm) return;
  elm.textContent = "";
  if (!text) return;
  for (let i = 0; i < text.length; i++) {
    elm.textContent += text[i];
    await new Promise((r) => setTimeout(r, speed));
  }
}

/* Mode */
function setMode(mode) {
  if (!creator || !viewer) return;
  if (mode === "viewer") {
    creator.classList.add("hidden");
    viewer.classList.remove("hidden");
  } else {
    viewer.classList.add("hidden");
    creator.classList.remove("hidden");
  }
}

/* Tilt effect for template t6 (viewer only) */
function enableTiltIfNeeded() {
  if (!wishCard) return;
  const template = wishCard.dataset.template;
  if (template !== "t6") {
    wishCard.style.transform = "";
    wishCard.onmousemove = null;
    wishCard.onmouseleave = null;
    return;
  }
  wishCard.onmousemove = (e) => {
    const r = wishCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    wishCard.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  };
  wishCard.onmouseleave = () => {
    wishCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  };
}

/* Events */
nameInput?.addEventListener("input", updatePreview);
msgInput?.addEventListener("input", updatePreview);
templateInput?.addEventListener("change", updatePreview);
fontInput?.addEventListener("change", updatePreview);

themeInput?.addEventListener("change", () => {
  const t = THEMES[themeInput.value] || THEMES.roseice;
  if (templateInput) templateInput.value = t.template;
  if (fontInput) fontInput.value = "auto";
  updatePreview();
});

photoInput?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) {
    if (fileHint) fileHint.textContent = "PNG/JPG/WEBP • compressed for sharing";
    photoDataUrl = "";
    updatePreview();
    return;
  }

  if (fileHint) fileHint.textContent = `${file.name} • ${Math.round(file.size / 1024)} KB`;

  const quality = file.size > 2_000_000 ? 0.70 : 0.80;
  const maxSize = file.size > 3_000_000 ? 720 : 900;

  photoDataUrl = await fileToCompressedDataURL(file, maxSize, quality);
  updatePreview();
});

wishForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  warn?.classList.add("hidden");
  if (warn) warn.textContent = "";
  if (copyStatus) copyStatus.textContent = "";

  if (agreeTc && !agreeTc.checked) {
    if (warn) {
      warn.classList.remove("hidden");
      warn.textContent = "Please accept the Terms & Conditions.";
    }
    return;
  }

  const payload = {
    v: 5,
    name: (nameInput?.value || "").trim() || "Friend",
    msg: (msgInput?.value || "").trim(),
    theme: themeInput?.value || "roseice",
    template: templateInput?.value || "t1",
    font: fontInput?.value || "auto",
    photo: photoDataUrl || "",
  };

  const b64 = encodeData(payload);
  const url = buildShareUrl(b64);

  if (warn && url.length > 4500) {
    warn.classList.remove("hidden");
    warn.textContent = "⚠️ Link is long because the photo is large. Use a smaller photo for easier sharing.";
  }

  if (shareLink) shareLink.value = url;
  linkBox?.classList.remove("hidden");
  linkBox?.scrollIntoView({ behavior: "smooth", block: "start" });
});

resetBtn?.addEventListener("click", () => {
  if (nameInput) nameInput.value = "";
  if (msgInput) msgInput.value = "";
  if (themeInput) themeInput.value = "roseice";

  const t = THEMES.roseice;
  if (templateInput) templateInput.value = t.template;
  if (fontInput) fontInput.value = "auto";

  if (photoInput) photoInput.value = "";
  photoDataUrl = "";
  if (fileHint) fileHint.textContent = "PNG/JPG/WEBP • compressed for sharing";

  warn?.classList.add("hidden");
  linkBox?.classList.add("hidden");
  updatePreview();
});

copyBtn?.addEventListener("click", async () => {
  if (!shareLink) return;
  try {
    await navigator.clipboard.writeText(shareLink.value);
    if (copyStatus) copyStatus.textContent = "Copied ✅";
  } catch {
    shareLink.select();
    document.execCommand("copy");
    if (copyStatus) copyStatus.textContent = "Copied ✅";
  }
});

shareBtn?.addEventListener("click", async () => {
  if (!shareLink) return;
  const url = shareLink.value;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Birthday Wish", text: "Open this 🎉", url });
    } else {
      await navigator.clipboard.writeText(url);
      if (copyStatus) copyStatus.textContent = "Share not supported — link copied ✅";
    }
  } catch {}
});

makeNewBtn?.addEventListener("click", () => {
  history.replaceState(null, "", `${location.pathname}`);
  setMode("creator");
});

replayBtn?.addEventListener("click", async () => {
  const data = readWishFromUrl();
  if (!data) return;
  if (wishMsg) wishMsg.textContent = "";
  await renderWish(data);
});

/* Viewer render */
async function renderWish(data) {
  const theme = data.theme || "roseice";
  const template = data.template || (THEMES[theme]?.template || "t1");
  const font = data.font || "auto";

  applyTheme(theme, template, font);
  enableTiltIfNeeded();

  if (wishName) wishName.textContent = data.name || "Friend";
  setAvatar(wishAvatar, data.photo || "", "🎉");

  if (data.photo) {
    if (wishPhoto) wishPhoto.src = data.photo;
    photoFrame?.classList.remove("hidden");
  } else {
    photoFrame?.classList.add("hidden");
  }

  await typewriter(wishMsg, data.msg || "", 14);
  launchConfetti(2500);
}

/* Init */
(function init() {
  const currentTheme = themeInput?.value || "roseice";
  const t = THEMES[currentTheme] || THEMES.roseice;

  if (templateInput) templateInput.value = t.template;
  if (fontInput) fontInput.value = "auto";

  updatePreview();

  const data = readWishFromUrl();
  if (!data) {
    setMode("creator");
    return;
  }

  setMode("viewer");
  fitCanvas(confettiCanvas);
  renderWish(data);
})();
