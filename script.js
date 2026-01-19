// script.js
// ================================
// WishCraft (GitHub Pages Ready)
// - Cloudinary unsigned upload (preset: wishcraft)
// - Short share URL (photo uses CDN URL, not base64)
// - Themed QR (uses qrserver API for reliability)
// - Player mode: opens wish from #wish=...
// ================================

// Cloudinary
const CLOUDINARY_CLOUD_NAME = "danzponmi";
const CLOUDINARY_UNSIGNED_PRESET = "wishcraft";

let uploadedPhotoUrl = "";

// Theme list (all your palettes + few premium additions)
const THEMES = [
  { id:"sandwine", name:"#9e9a8d + #80011f", a:"#9e9a8d", b:"#80011f", qrFg:"ffffff", qrBg:"111111" },
  { id:"bronzenoir", name:"#b38f6f + #161616", a:"#b38f6f", b:"#161616", qrFg:"111111", qrBg:"ffffff" },
  { id:"earthoak", name:"#301c1b + #3f2a0d", a:"#301c1b", b:"#3f2a0d", qrFg:"ffffff", qrBg:"111111" },
  { id:"roseice", name:"#64303d + #c3dbe7", a:"#64303d", b:"#c3dbe7", qrFg:"111111", qrBg:"ffffff" },

  { id:"mintnavy", name:"#c3fdb8 + #1d2545", a:"#c3fdb8", b:"#1d2545", qrFg:"1d2545", qrBg:"c3fdb8" },
  { id:"burntcream", name:"#c14a09 + #ffffc5", a:"#c14a09", b:"#ffffc5", qrFg:"c14a09", qrBg:"ffffc5" },
  { id:"pinkazure", name:"#fff0f5 + #007fff", a:"#fff0f5", b:"#007fff", qrFg:"007fff", qrBg:"fff0f5" },
  { id:"tealgold", name:"#00555a + #ffca4b", a:"#00555a", b:"#ffca4b", qrFg:"00555a", qrBg:"ffca4b" },

  { id:"buttergraphite", name:"#F8DE7E + #39393F", a:"#F8DE7E", b:"#39393F", qrFg:"39393F", qrBg:"F8DE7E" },
  { id:"bluemist", name:"#26538D + #F0FFFF", a:"#26538D", b:"#F0FFFF", qrFg:"26538D", qrBg:"F0FFFF" },
  { id:"parchmentwine", name:"#DAD4B6 + #5C0120", a:"#DAD4B6", b:"#5C0120", qrFg:"5C0120", qrBg:"DAD4B6" },
  { id:"forestlemon", name:"#05472A + #DFEF87", a:"#05472A", b:"#DFEF87", qrFg:"05472A", qrBg:"DFEF87" },

  // extra premium themes
  { id:"midnightviolet", name:"Midnight Violet", a:"#0b0b14", b:"#7b2cff", qrFg:"ffffff", qrBg:"0b0b14" },
  { id:"auroracoral", name:"Aurora Coral", a:"#0a2239", b:"#ff6b6b", qrFg:"0a2239", qrBg:"fff0f5" }
];

// Fonts (real fonts loaded via Google Fonts + a few system)
const FONTS = [
  { id:"auto", name:"Auto (by theme)", css:"Poppins, system-ui, sans-serif" },
  { id:"poppins", name:"Poppins (Modern)", css:"Poppins, system-ui, sans-serif" },
  { id:"montserrat", name:"Montserrat (Clean)", css:"Montserrat, system-ui, sans-serif" },
  { id:"raleway", name:"Raleway (Elegant)", css:"Raleway, system-ui, sans-serif" },
  { id:"playfair", name:"Playfair Display (Luxury)", css:"'Playfair Display', serif" },
  { id:"cinzel", name:"Cinzel (Royal)", css:"Cinzel, serif" },
  { id:"pacifico", name:"Pacifico (Handwritten)", css:"Pacifico, cursive" }
];

// Templates
const TEMPLATES = [
  { id:"t1", name:"Premium Glow" },
  { id:"t2", name:"Centered Minimal" },
  { id:"t3", name:"Split Photo" },
  { id:"t4", name:"Bold Poster" }
];

// ============ Helpers ============
const $ = (id) => document.getElementById(id);

function safeText(s, max=160){
  return String(s || "").replace(/\s+/g," ").trim().slice(0,max);
}

function toB64(obj){
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)));
}
function fromB64(b64){
  const json = decodeURIComponent(escape(atob(b64)));
  return JSON.parse(json);
}

function setCSSVars(themeId){
  const t = THEMES.find(x => x.id === themeId) || THEMES[1];
  document.documentElement.style.setProperty("--a", t.a);
  document.documentElement.style.setProperty("--b", t.b);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.b);
  return t;
}

function applyEffect(effect){
  document.body.classList.remove("fx-glow","fx-sparkle","fx-neon","fx-glass");
  if(effect && effect !== "auto"){
    document.body.classList.add("fx-" + effect);
  }
}

function applyFont(fontId, themeId){
  const font = FONTS.find(f => f.id === fontId) || FONTS[0];
  if(fontId === "auto"){
    // theme-based defaults
    const darkish = (THEMES.find(t=>t.id===themeId)?.b || "#000").toLowerCase();
    const isDark = isColorDark(darkish);
    document.body.style.fontFamily = isDark ? "Poppins, system-ui, sans-serif" : "Montserrat, system-ui, sans-serif";
    return;
  }
  document.body.style.fontFamily = font.css;
}

function isColorDark(hex){
  const h = hex.replace("#","").trim();
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  // perceived luminance
  const L = (0.2126*r + 0.7152*g + 0.0722*b)/255;
  return L < 0.45;
}

function renderQR(url, themeId){
  const qrWrap = $("qrWrap");
  if(!qrWrap) return;

  const t = THEMES.find(x => x.id === themeId) || THEMES[1];
  const fg = t.qrFg.replace("#","");
  const bg = t.qrBg.replace("#","");

  const img = document.createElement("img");
  img.alt = "QR Code";
  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?" +
    new URLSearchParams({
      size: "420x420",
      data: url,
      color: fg,
      bgcolor: bg,
      margin: "12",
      qzone: "2",
      format: "png"
    }).toString();

  qrWrap.innerHTML = "";
  qrWrap.appendChild(img);
}

// Simple live preview
function updateLive(){
  const name = safeText($("nameInput")?.value || "Friend", 32);
  const msg  = safeText($("msgInput")?.value || "Wish you a very happy birthday! 🎉", 160);
  const themeId = $("themeSelect")?.value || "bronzenoir";
  const fontId = $("fontSelect")?.value || "auto";
  const effect = $("accentToggle")?.value || "auto";
  const template = $("templateSelect")?.value || "t1";

  setCSSVars(themeId);
  applyFont(fontId, themeId);
  applyEffect(effect);

  $("liveName").textContent = name;
  $("liveMsg").textContent = msg;
  $("liveStage").className = "stage " + template;

  // photo
  const livePhoto = $("livePhoto");
  const phFallback = document.querySelector(".photoFrame .phFallback");
  if(uploadedPhotoUrl){
    livePhoto.src = uploadedPhotoUrl;
    livePhoto.style.display = "block";
    if(phFallback) phFallback.style.display = "none";
    document.querySelector(".photoFrame img").style.display = "block";
  } else {
    livePhoto.removeAttribute("src");
    livePhoto.style.display = "none";
    if(phFallback) phFallback.style.display = "block";
    document.querySelector(".photoFrame img").style.display = "none";
  }
}

// ============ Cloudinary Upload ============
async function uploadToCloudinary(file){
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET);
  form.append("folder", "wishcraft");

  const res = await fetch(endpoint, { method:"POST", body: form });
  if(!res.ok){
    const err = await res.text().catch(()=> "");
    throw new Error("Cloudinary upload failed: " + err);
  }
  return await res.json();
}

// ============ Confetti (lightweight canvas) ============
function confettiBurst(durationMs = 2000){
  const c = $("confetti");
  if(!c) return;
  const ctx = c.getContext("2d");
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const resize = () => {
    c.width = Math.floor(c.clientWidth * dpr);
    c.height = Math.floor(c.clientHeight * dpr);
  };
  resize();

  const t0 = performance.now();
  const pieces = Array.from({length: 160}).map(() => ({
    x: Math.random()*c.width,
    y: -Math.random()*c.height*0.3,
    vx: (Math.random()-0.5)*2.2*dpr,
    vy: (Math.random()*2.4+1.2)*dpr,
    r: (Math.random()*6+2)*dpr,
    a: Math.random()*Math.PI*2,
    va: (Math.random()-0.5)*0.18,
    g: (Math.random()*0.06+0.03)*dpr
  }));

  function frame(t){
    const elapsed = t - t0;
    ctx.clearRect(0,0,c.width,c.height);

    // do not set fixed colors (requirement) => we draw with current fillStyle default,
    // BUT we can vary alpha only. To still look good, use current theme via CSS vars in DOM? Not possible in canvas.
    // So we keep it minimal + classy with white confetti.
    ctx.fillStyle = "rgba(255,255,255,.85)";

    for(const p of pieces){
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.a += p.va;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
      ctx.restore();
    }

    if(elapsed < durationMs){
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0,0,c.width,c.height);
    }
  }
  requestAnimationFrame(frame);

  window.addEventListener("resize", resize, { once:true });
}

// ============ App Mode Switching ============
function showBuilder(){
  $("builder").classList.remove("hidden");
  $("player").classList.add("hidden");
}
function showPlayer(){
  $("builder").classList.add("hidden");
  $("player").classList.remove("hidden");
}

// ============ Player render ============
function renderPlayer(payload){
  const name = safeText(payload.name || "Friend", 32);
  const msg = safeText(payload.msg || "Wish you a very happy birthday! 🎉", 160);
  const themeId = payload.theme || "bronzenoir";
  const fontId = payload.font || "auto";
  const effect = payload.effect || "auto";
  const template = payload.template || "t1";
  const photo = payload.photo || "";

  const t = setCSSVars(themeId);
  applyFont(fontId, themeId);
  applyEffect(effect);

  $("pName").textContent = name;
  $("pMsg").textContent = msg;
  $("playerStage").className = "playerStage " + template;

  const img = $("pPhoto");
  const fallback = document.querySelector(".playerPhoto .phFallback");
  if(photo){
    img.src = photo;
    img.style.display = "block";
    if(fallback) fallback.style.display = "none";
    document.querySelector(".playerPhoto img").style.display = "block";
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
    if(fallback) fallback.style.display = "block";
    document.querySelector(".playerPhoto img").style.display = "none";
  }

  // burst confetti
  confettiBurst(2400);

  // Update page title
  document.title = `Happy Birthday, ${name}! — WishCraft`;

  // Theme color meta
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.b);
}

// ============ Init builder selects ============
function fillSelect(el, items, placeholder){
  el.innerHTML = "";
  if(placeholder){
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    el.appendChild(opt);
  }
  for(const it of items){
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = it.name;
    el.appendChild(opt);
  }
}

// ============ Events ============
function wireEvents(){
  $("nameInput")?.addEventListener("input", updateLive);
  $("msgInput")?.addEventListener("input", updateLive);
  $("themeSelect")?.addEventListener("change", updateLive);
  $("templateSelect")?.addEventListener("change", updateLive);
  $("fontSelect")?.addEventListener("change", updateLive);
  $("accentToggle")?.addEventListener("change", updateLive);

  $("resetBtn")?.addEventListener("click", () => {
    $("nameInput").value = "";
    $("msgInput").value = "Wish you a very happy birthday! 🎉";
    $("themeSelect").value = "bronzenoir";
    $("templateSelect").value = "t1";
    $("fontSelect").value = "auto";
    $("accentToggle").value = "auto";
    uploadedPhotoUrl = "";

    const prev = $("photoPreview");
    prev.removeAttribute("src");
    prev.style.display = "none";
    $("uploadState").textContent = "No photo uploaded";

    $("shareLink").value = "";
    $("qrWrap").innerHTML = "";
    updateLive();
  });

  $("copyBtn")?.addEventListener("click", async () => {
    const val = $("shareLink").value.trim();
    if(!val) return alert("Generate a link first.");
    try{
      await navigator.clipboard.writeText(val);
      $("copyBtn").textContent = "Copied!";
      setTimeout(()=> $("copyBtn").textContent = "Copy", 900);
    }catch{
      alert("Copy failed. Select link and copy manually.");
    }
  });

  $("photoInput")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;

    if(file.size > 4 * 1024 * 1024){
      alert("Please upload an image under 4MB.");
      e.target.value = "";
      return;
    }

    $("uploadState").textContent = "Uploading to Cloudinary…";
    try{
      const data = await uploadToCloudinary(file);
      uploadedPhotoUrl = data.secure_url;

      // show preview
      const prev = $("photoPreview");
      prev.src = uploadedPhotoUrl;
      prev.style.display = "block";

      $("uploadState").textContent = "Uploaded ✓ (Cloudinary CDN)";
      updateLive();
    }catch(err){
      console.error(err);
      $("uploadState").textContent = "Upload failed";
      alert("Upload failed. Please try again.");
    }
  });

  $("generateBtn")?.addEventListener("click", () => {
    const name = safeText($("nameInput")?.value || "Friend", 32);
    const msg  = safeText($("msgInput")?.value || "Wish you a very happy birthday! 🎉", 160);
    const themeId = $("themeSelect")?.value || "bronzenoir";
    const template = $("templateSelect")?.value || "t1";
    const fontId = $("fontSelect")?.value || "auto";
    const effect = $("accentToggle")?.value || "auto";

    // Short payload: photo is CDN URL, not base64
    const payload = {
      v: 6,
      name,
      msg,
      theme: themeId,
      template,
      font: fontId,
      effect,
      photo: uploadedPhotoUrl || ""
    };

    const hash = "#wish=" + toB64(payload);

    // Works on GitHub Pages
    const shareUrl = location.origin + location.pathname + hash;

    $("shareLink").value = shareUrl;
    renderQR(shareUrl, themeId);
  });

  $("replayBtn")?.addEventListener("click", () => {
    confettiBurst(2200);
  });
}

// ============ Boot from URL ============
function boot(){
  // Fill selects
  fillSelect($("themeSelect"), THEMES);
  fillSelect($("templateSelect"), TEMPLATES);
  fillSelect($("fontSelect"), FONTS);

  // Defaults
  $("themeSelect").value = "bronzenoir";
  $("templateSelect").value = "t1";
  $("fontSelect").value = "auto";
  $("accentToggle").value = "auto";

  // If opened from wish link
  const match = location.hash.match(/wish=([^&]+)/);
  if(match){
    try{
      const payload = fromB64(match[1]);
      showPlayer();
      renderPlayer(payload);
      return;
    }catch(e){
      console.error("Invalid wish payload", e);
      // fallback to builder
    }
  }

  showBuilder();
  updateLive();
  wireEvents();
}

boot();
