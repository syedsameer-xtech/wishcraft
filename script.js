// (only the file header omitted — full file replacing previous script.js)
const CLOUDINARY_CLOUD_NAME = "danzponmi";
const CLOUDINARY_UNSIGNED_PRESET = "wishcraft";

let uploadedPhotoUrl = "";

// We store the latest QR PNG as a Blob so Download/Share/Copy works reliably
let lastQrBlob = null;
let lastQrObjectUrl = "";
let lastShareUrl = "";

const THEMES = [
  { id:"sandwine", label:"Sand Wine", a:"#9e9a8d", b:"#80011f", qrFg:"ffffff", qrBg:"111111" },
  { id:"bronzenoir", label:"Bronze Noir", a:"#b38f6f", b:"#161616", qrFg:"111111", qrBg:"ffffff" },
  { id:"earthoak", label:"Earth Oak", a:"#301c1b", b:"#3f2a0d", qrFg:"ffffff", qrBg:"111111" },
  { id:"roseice", label:"Rose Ice", a:"#64303d", b:"#c3dbe7", qrFg:"111111", qrBg:"ffffff" },
  { id:"mintnavy", label:"Mint Navy", a:"#c3fdb8", b:"#1d2545", qrFg:"1d2545", qrBg:"c3fdb8" },
  { id:"burntcream", label:"Burnt Cream", a:"#c14a09", b:"#ffffc5", qrFg:"c14a09", qrBg:"ffffc5" },
  { id:"pinkazure", label:"Pink Azure", a:"#fff0f5", b:"#007fff", qrFg:"007fff", qrBg:"fff0f5" },
  { id:"tealgold", label:"Teal Gold", a:"#00555a", b:"#ffca4b", qrFg:"00555a", qrBg:"ffca4b" },
  { id:"buttergraphite", label:"Butter Graphite", a:"#F8DE7E", b:"#39393F", qrFg:"39393F", qrBg:"F8DE7E" },
  { id:"bluemist", label:"Blue Mist", a:"#26538D", b:"#F0FFFF", qrFg:"26538D", qrBg:"F0FFFF" },
  { id:"parchmentwine", label:"Parchment Wine", a:"#DAD4B6", b:"#5C0120", qrFg:"5C0120", qrBg:"DAD4B6" },
  { id:"forestlemon", label:"Forest Lemon", a:"#05472A", b:"#DFEF87", qrFg:"05472A", qrBg:"DFEF87" },
  { id:"midnightviolet", label:"Midnight Violet", a:"#0b0b14", b:"#7b2cff", qrFg:"ffffff", qrBg:"0b0b14" },
  { id:"auroracoral", label:"Aurora Coral", a:"#0a2239", b:"#ff6b6b", qrFg:"0a2239", qrBg:"fff0f5" }
];

const FONTS = [
  { id:"auto", name:"Auto (by theme)", css:"Poppins, system-ui, sans-serif" },
  { id:"poppins", name:"Poppins (Modern)", css:"Poppins, system-ui, sans-serif" },
  { id:"montserrat", name:"Montserrat (Clean)", css:"Montserrat, system-ui, sans-serif" },
  { id:"raleway", name:"Raleway (Elegant)", css:"Raleway, system-ui, sans-serif" },
  { id:"playfair", name:"Playfair Display (Luxury)", css:"'Playfair Display', serif" },
  { id:"cinzel", name:"Cinzel (Royal)", css:"Cinzel, serif" },
  { id:"pacifico", name:"Pacifico (Handwritten)", css:"Pacifico, cursive" }
];

const TEMPLATES = [
  { id:"t1", name:"Premium Glow" },
  { id:"t2", name:"Centered Minimal" },
  { id:"t3", name:"Split Photo" },
  { id:"t4", name:"Bold Poster" }
];

const $ = (id) => document.getElementById(id);

function toast(msg){
  const el = $("toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1200);
}

function safeText(s, max=160){
  return String(s || "").replace(/\s+/g," ").trim().slice(0,max);
}

// Unicode-safe base64
function b64EncodeUnicode(str){
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1,16))));
}
function b64DecodeUnicode(b64){
  const bin = atob(b64);
  let pct = "";
  for(let i=0;i<bin.length;i++) pct += "%" + ("00" + bin.charCodeAt(i).toString(16)).slice(-2);
  return decodeURIComponent(pct);
}
function toB64(obj){ return b64EncodeUnicode(JSON.stringify(obj)); }
function fromB64(b64){ return JSON.parse(b64DecodeUnicode(b64)); }

function isColorDark(hex){
  const h = (hex || "#000").replace("#","").trim();
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const L = (0.2126*r + 0.7152*g + 0.0722*b)/255;
  return L < 0.45;
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
  if(effect && effect !== "auto") document.body.classList.add("fx-" + effect);
}

function applyFont(fontId, themeId){
  if(fontId === "auto"){
    const darkish = (THEMES.find(t=>t.id===themeId)?.b || "#000").toLowerCase();
    document.body.style.fontFamily = isColorDark(darkish)
      ? "Poppins, system-ui, sans-serif"
      : "Montserrat, system-ui, sans-serif";
    return;
  }
  const font = FONTS.find(f => f.id === fontId) || FONTS[0];
  document.body.style.fontFamily = font.css;
}

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

  $("liveName") && ($("liveName").textContent = name);
  $("liveMsg") && ($("liveMsg").textContent = msg);

  const liveStage = $("liveStage");
  if(liveStage) liveStage.className = "stage " + template;

  const livePhoto = $("livePhoto");
  const fallback = document.querySelector(".photoFrame .phFallback");

  if(uploadedPhotoUrl && livePhoto){
    livePhoto.src = uploadedPhotoUrl;
    livePhoto.style.display = "block";
    if(fallback) fallback.style.display = "none";
  }else if(livePhoto){
    livePhoto.removeAttribute("src");
    livePhoto.style.display = "none";
    if(fallback) fallback.style.display = "block";
  }
}

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

/* QR: fetch PNG as Blob (reliable download/share/copy) */
function qrApiUrl(shareUrl, theme){
  const fg = (theme.qrFg || "111111").replace("#","");
  const bg = (theme.qrBg || "ffffff").replace("#","");
  const params = new URLSearchParams({
    size: "640x640",
    data: shareUrl,
    color: fg,
    bgcolor: bg,
    margin: "12",
    qzone: "2",
    format: "png"
  });
  return "https://api.qrserver.com/v1/create-qr-code/?" + params.toString();
}

function cleanupQrObjectUrl(){
  if(lastQrObjectUrl){
    URL.revokeObjectURL(lastQrObjectUrl);
    lastQrObjectUrl = "";
  }
}

async function buildQrBlob(shareUrl, themeId){
  const theme = THEMES.find(t => t.id === themeId) || THEMES[1];
  const url = qrApiUrl(shareUrl, theme);

  const res = await fetch(url, { cache:"no-store" });
  if(!res.ok) throw new Error("QR fetch failed");
  const blob = await res.blob();

  cleanupQrObjectUrl();
  lastQrBlob = blob;
  lastQrObjectUrl = URL.createObjectURL(blob);

  const wrap = $("qrWrap");
  if(wrap){
    wrap.innerHTML = "";
    const img = document.createElement("img");
    img.alt = "QR Code";
    img.decoding = "async";
    img.src = lastQrObjectUrl; // local blob URL
    wrap.appendChild(img);
  }

  // enable buttons
  $("downloadQrBtn") && ($("downloadQrBtn").disabled = false);
  $("shareQrBtn") && ($("shareQrBtn").disabled = false);
  $("copyQrBtn") && ($("copyQrBtn").disabled = false);
}

/* Confetti */
function confettiBurst(durationMs = 2200){
  const c = $("confetti");
  if(!c) return;
  const ctx = c.getContext && c.getContext("2d");
  if(!ctx) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const resize = () => {
    c.width = Math.floor(c.clientWidth * dpr);
    c.height = Math.floor(c.clientHeight * dpr);
  };
  resize();

  const t0 = performance.now();
  const pieces = Array.from({length: 170}).map(() => ({
    x: Math.random()*c.width,
    y: -Math.random()*c.height*0.2,
    vx: (Math.random()-0.5)*2.4*dpr,
    vy: (Math.random()*2.4+1.4)*dpr,
    r: (Math.random()*6+2)*dpr,
    a: Math.random()*Math.PI*2,
    va: (Math.random()-0.5)*0.2,
    g: (Math.random()*0.06+0.03)*dpr
  }));

  function frame(t){
    const elapsed = t - t0;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "rgba(255,255,255,.88)";

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

    if(elapsed < durationMs) requestAnimationFrame(frame);
    else ctx.clearRect(0,0,c.width,c.height);
  }
  requestAnimationFrame(frame);
}

function showBuilder(){
  $("builder")?.classList.remove("hidden");
  $("player")?.classList.add("hidden");
}
function showPlayer(){
  $("builder")?.classList.add("hidden");
  $("player")?.classList.remove("hidden");
}

function renderPlayer(payload){
  const name = safeText(payload.name || "Friend", 32);
  const msg = safeText(payload.msg || "Wish you a very happy birthday! 🎉", 160);
  const themeId = payload.theme || "bronzenoir";
  const fontId = payload.font || "auto";
  const effect = payload.effect || "auto";
  const template = payload.template || "t1";
  const photo = payload.photo || "";

  setCSSVars(themeId);
  applyFont(fontId, themeId);
  applyEffect(effect);

  $("pName") && ($("pName").textContent = name);
  $("pMsg") && ($("pMsg").textContent = msg);

  const stage = $("playerStage");
  if(stage) stage.className = "playerStage " + template;

  const img = $("pPhoto");
  const fallback = document.querySelector(".playerPhoto .phFallback");
  const photoContainer = document.querySelector(".playerPhoto");

  if(photo && img){
    // show photo
    img.src = photo;
    img.style.display = "block";
    if(fallback) fallback.style.display = "none";
    if(photoContainer) photoContainer.style.display = "";
    if(stage) stage.classList.remove("no-photo");
  }else if(img){
    // hide photo container entirely so layout collapses
    img.removeAttribute("src");
    img.style.display = "none";
    if(fallback) fallback.style.display = "block";
    if(photoContainer) photoContainer.style.display = "none";
    if(stage) stage.classList.add("no-photo");
  }

  document.title = `Happy Birthday, ${name}! — WishCraft`;
  confettiBurst(2400);
}

function fillThemes(){
  const el = $("themeSelect");
  if(!el) return;
  el.innerHTML = "";
  for(const t of THEMES){
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.label} — ${t.a} / ${t.b}`;
    el.appendChild(opt);
  }
}
function fillSelect(el, items){
  if(!el) return;
  el.innerHTML = "";
  for(const it of items){
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = it.name;
    el.appendChild(opt);
  }
}

function wireEvents(){
  $("nameInput")?.addEventListener("input", updateLive);
  $("msgInput")?.addEventListener("input", updateLive);
  $("themeSelect")?.addEventListener("change", updateLive);
  $("templateSelect")?.addEventListener("change", updateLive);
  $("fontSelect")?.addEventListener("change", updateLive);
  $("accentToggle")?.addEventListener("change", updateLive);

  $("resetBtn")?.addEventListener("click", () => {
    $("nameInput") && ($("nameInput").value = "");
    $("msgInput") && ($("msgInput").value = "Wish you a very happy birthday! 🎉");
    $("themeSelect") && ($("themeSelect").value = "bronzenoir");
    $("templateSelect") && ($("templateSelect").value = "t1");
    $("fontSelect") && ($("fontSelect").value = "auto");
    $("accentToggle") && ($("accentToggle").value = "auto");

    uploadedPhotoUrl = "";
    lastShareUrl = "";
    lastQrBlob = null;
    cleanupQrObjectUrl();

    const prev = $("photoPreview");
    if(prev){ prev.removeAttribute("src"); prev.style.display = "none"; }
    $("uploadState") && ($("uploadState").textContent = "No photo uploaded");
    $("shareLink") && ($("shareLink").value = "");
    $("qrWrap") && ($("qrWrap").innerHTML = "");

    $("downloadQrBtn") && ($("downloadQrBtn").disabled = true);
    $("shareQrBtn") && ($("shareQrBtn").disabled = true);
    $("copyQrBtn") && ($("copyQrBtn").disabled = true);

    updateLive();
    toast("Reset done");
  });

  $("copyBtn")?.addEventListener("click", async () => {
    const val = ($("shareLink")?.value || "").trim();
    if(!val) return toast("Generate a link first");
    try{
      await navigator.clipboard.writeText(val);
      toast("Link copied ✅");
    }catch{
      toast("Copy failed - select and copy manually");
    }
  });

  $("photoInput")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;

    if(file.size > 4 * 1024 * 1024){
      toast("Upload under 4MB");
      e.target.value = "";
      return;
    }

    $("uploadState") && ($("uploadState").textContent = "Uploading to Cloudinary...");
    try{
      const data = await uploadToCloudinary(file);
      uploadedPhotoUrl = data.secure_url;

      const prev = $("photoPreview");
      if(prev){
        prev.src = uploadedPhotoUrl;
        prev.style.display = "block";
      }
      $("uploadState") && ($("uploadState").textContent = "Uploaded ✓ (Cloudinary CDN)");
      updateLive();
      toast("Photo uploaded ✅");
    }catch(err){
      console.error(err);
      $("uploadState") && ($("uploadState").textContent = "Upload failed");
      toast("Upload failed");
    }
  });

  $("generateBtn")?.addEventListener("click", async () => {
    const name = safeText($("nameInput")?.value || "Friend", 32);
    const msg  = safeText($("msgInput")?.value || "Wish you a very happy birthday! 🎉", 160);
    const themeId = $("themeSelect")?.value || "bronzenoir";
    const template = $("templateSelect")?.value || "t1";
    const fontId = $("fontSelect")?.value || "auto";
    const effect = $("accentToggle")?.value || "auto";

    const payload = {
      v: 7,
      name,
      msg,
      theme: themeId,
      template,
      font: fontId,
      effect,
      photo: uploadedPhotoUrl || ""
    };

    const b64 = toB64(payload);
    const hash = "#wish=" + encodeURIComponent(b64);
    const shareUrl = location.origin + location.pathname + hash;

    lastShareUrl = shareUrl;
    $("shareLink") && ($("shareLink").value = shareUrl);

    try{
      await buildQrBlob(shareUrl, themeId);
      toast("Link + QR generated ✅");
    }catch(e){
      console.error(e);
      toast("QR failed - try again");
    }
  });

  $("downloadQrBtn")?.addEventListener("click", () => {
    if(!lastQrBlob || !lastQrObjectUrl) return toast("Generate QR first");
    const a = document.createElement("a");
    a.href = lastQrObjectUrl;
    a.download = "wishcraft-qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("QR download started");
  });

  $("shareQrBtn")?.addEventListener("click", async () => {
    if(!lastQrBlob) return toast("Generate QR first");
    if(!navigator.share){
      toast("Share not supported here. Use Download QR.");
      return;
    }
    try{
      const file = new File([lastQrBlob], "wishcraft-qr.png", { type: "image/png" });
      await navigator.share({
        title: "WishCraft QR",
        text: "Scan this QR to open the birthday wish.",
        files: [file],
        url: lastShareUrl || undefined
      });
      toast("Shared ✅");
    }catch{
      toast("Share cancelled");
    }
  });

  $("copyQrBtn")?.addEventListener("click", async () => {
    if(!lastQrBlob) return toast("Generate QR first");
    try{
      if(navigator.clipboard && window.ClipboardItem){
        await navigator.clipboard.write([new ClipboardItem({ "image/png": lastQrBlob })]);
        toast("QR copied ✅");
      }else{
        toast("Copy QR not supported. Use Download QR.");
      }
    }catch{
      toast("Copy failed. Use Download QR.");
    }
  });

  $("replayBtn")?.addEventListener("click", () => {
    confettiBurst(2400);
    const hero = $("playerHero");
    if(hero){
      hero.classList.remove("replay-bounce");
      void hero.offsetWidth;
      hero.classList.add("replay-bounce");
    }
    toast("Replay 🎉");
  });

  window.addEventListener("hashchange", () => location.reload());
}

function boot(){
  fillThemes();
  fillSelect($("templateSelect"), TEMPLATES);
  fillSelect($("fontSelect"), FONTS);

  $("themeSelect") && ($("themeSelect").value = "bronzenoir");
  $("templateSelect") && ($("templateSelect").value = "t1");
  $("fontSelect") && ($("fontSelect").value = "auto");
  $("accentToggle") && ($("accentToggle").value = "auto");

  const match = location.hash.match(/wish=([^&]+)/);
  if(match){
    try{
      const decoded = decodeURIComponent(match[1]);
      const payload = fromB64(decoded);
      showPlayer();
      renderPlayer(payload);
      wireEvents();
      return;
    }catch(e){
      console.error("Invalid wish payload", e);
    }
  }

  showBuilder();
  updateLive();
  wireEvents();
}

boot();
