# 🎂 WishCraft — Birthday Wish Link + QR Generator

<div align="center">

### Create beautiful, personalised birthday wish pages  
**Photo • Themes • Countdown • QR Code • Compressed Share Link**

No backend. No database. No build tools.  
Just pure front-end magic.

<br>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-b38f6f?style=for-the-badge&logo=github)](https://syedsameer-xtech.github.io/wishcraft/)
[![GitHub Stars](https://img.shields.io/github/stars/syedsameer-xtech/wishcraft?style=for-the-badge&color=b38f6f)](https://github.com/syedsameer-xtech/wishcraft/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/No%20Build-Zero%20Dependencies-3ecf8e?style=for-the-badge)](#)

</div>

---

## ✨ What Is WishCraft?

WishCraft is a fully static web app that lets you generate **shareable birthday wish pages** with:

- 🎨 Elegant themes  
- 📸 Photo upload (Cloudinary CDN)  
- 🎉 Animations & confetti  
- ⏱️ Live countdown  
- 📱 Styled QR codes  
- 🔗 Compressed URL-based sharing  

All wish data is encoded directly in the **URL hash fragment**.  
No server stores your content. No accounts required.

---

# ⚙️ How It Works

```
User Input
   ↓
Strip defaults & shorten keys
   ↓
JSON stringify
   ↓
LZW compression
   ↓
Base64-URL encode
   ↓
Stored in #w= hash fragment
```

Example:

```
https://your-site.com/wishcraft/#w=zAB3xFg...
```

Because it uses the URL hash:

- ✅ No database  
- ✅ No backend  
- ✅ No cookies  
- ✅ No tracking  
- ✅ Works on any static host  

---

# 🎨 Feature Overview

## 🛠 Builder

| Category | Details |
|----------|----------|
| 🎨 20 Themes | Bronze Noir, Velvet Rose, Midnight Violet & more |
| 🖋️ 9 Fonts | Poppins, Cinzel, Pacifico, Playfair & more |
| 🗂️ 5 Layouts | Glow, Minimal, Split Photo, Poster, Photo First |
| ✨ 6 Effects | Glow, Neon, Glass, Aurora, Sparkle, Cinematic |
| 🎬 6 Animations | Fade, Slide, Zoom, Bounce, Float, Typewriter |
| 📸 Photo Upload | Cloudinary integration |
| 💬 Templates | Heartfelt, Funny, Professional, Poetic |
| 🔴 Live Preview | Instant preview while typing |
| ⏳ Expiry | Optional link expiration |

---

## 📱 QR Code System

| Feature | Description |
|----------|-------------|
| ✅ Fully scannable | Direct QR matrix access (not pixel sampling) |
| 🎨 4 Styles | Square, Rounded, Dots, Logo overlay |
| 🔒 Smart contrast | Ensures ≥ 4:1 scanner-safe ratio |
| 🔏 ECC Level H | 30% error correction for logo mode |
| ⬇️ Export | PNG download + Clipboard + Web Share |

---

## 🎉 Recipient Experience

| Feature | Description |
|----------|-------------|
| ⏱️ Countdown | Animated live flip timer |
| 🎂 Birthday Mode | Special shimmer effect on the day |
| 🎊 Confetti | Canvas particle animation |
| 💬 Emoji Reactions | Stored locally in browser |
| ⛶ Fullscreen Mode | One-tap immersive view |
| 🔔 Expiry Notice | Warning if link is expiring |

---

# 🚀 Deploy in 60 Seconds

## GitHub Pages

1. Fork this repository  
2. Go to **Settings → Pages**  
3. Select `main` branch / root  
4. Done  

Your site:
```
https://your-username.github.io/wishcraft/
```

---

## Works On

- Netlify (drag & drop)
- Vercel
- Cloudflare Pages
- Any Apache/Nginx server
- Even local `index.html`

No `npm install`.  
No bundlers.  
No frameworks.

---

# 🏗️ Project Structure

```
wishcraft/
├── index.html        # Main structure
├── style.css         # Themes, layouts, animations
├── script.js         # Compression, QR logic, builder, countdown
├── Logo_0.png        # App logo
└── README.md         # Documentation
```

The project is modular but remains fully static.

---

# 🔒 Privacy & Data Model

- All wish data lives in the URL hash
- Hash fragments are never sent to servers
- No backend logging
- No cookies
- No analytics
- Reaction counts stored in localStorage only

---

# ♿ Accessibility

- `prefers-reduced-motion` supported
- Keyboard navigation for all controls
- ARIA roles for UI elements
- High-contrast QR rendering
- Focus-visible styling

---

# 🛠 Configuration (Cloudinary)

Inside `script.js`, update:

```js
const CLOUDINARY_CLOUD  = "your_cloud_name";
const CLOUDINARY_PRESET = "your_preset_name";
```

Create a free account at cloudinary.com and generate an unsigned upload preset.

---

# 🧠 Why This Project Stands Out

- Zero-backend architecture
- Custom LZW compression implementation
- Advanced QR styling with guaranteed scannability
- Fully static but feature-rich
- Clean modular separation (HTML/CSS/JS)
- Production-ready without build tools

---

# 🤝 Contributing

Ideas welcome:

- WhatsApp share integration
- Additional QR styles
- Background music support
- Short URL serverless version
- Dark/light UI toggle

Open an issue or submit a PR.

---

# 📜 License

MIT — Free for personal & commercial use.

---

# 👨‍💻 Author

Built & Designed by **Syed Sameer**

---

## 🤖 AI Assistance

Developed with assistance from **Claude** and **ChatGPT**

---

<div align="center">

Made with ❤️ by Syed Sameer  
⭐ Star the repo if you love WishCraft!

</div>
