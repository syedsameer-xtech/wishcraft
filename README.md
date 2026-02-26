# 🎂 WishCraft

<div align="center">

### ✨ Premium Birthday Wish Link + QR Generator  
Create beautiful, shareable birthday wishes in seconds —  
**No backend. No signup. Just magic.**

[🌐 Try It Live](https://wishcraft.live)  
⭐ Star this repo if you love it!

</div>

---

## 🚀 What is WishCraft?

**WishCraft** is a lightweight, fully client-side web app that lets you create stunning birthday wish pages and share them instantly via:

- 🔗 Shareable Link  
- 📱 QR Code  
- 📤 Native Share  

No database. No accounts. No tracking.  
Everything is encoded directly into the URL.

---

## ✨ Features

| Feature | Description |
|----------|-------------|
| 🎨 Themes | 4 beautiful layouts: Glow, Minimal, Split, Poster |
| 🔤 Fonts | Poppins, Montserrat, Playfair & more |
| 🌈 Effects | Glow, Sparkle, Neon, Glass animations |
| 🖼️ Photo Upload | Upload image (Cloudinary CDN hosted) |
| 📱 QR Code | Auto-generated, themed, downloadable QR |
| 🎊 Confetti | Celebration animation on open |
| 🔗 Shareable Link | All data encoded in URL hash |
| 📤 One-Click Share | Copy link or share natively |

---

## 🎯 Quick Start

### 🌐 Option 1: Use Online (Easiest)

1. Visit 👉 https://wishcraft.live  
2. Enter name & message  
3. Pick a theme  
4. Click **Generate Link + QR**  
5. Share the magic 🎉  

---

### 💻 Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/syedsameer-xtech/wishcraft.git

# Open project
cd wishcraft

# Open in browser
open index.html
```

Or simply double-click `index.html`.

---

### 🚀 Option 3: Deploy via GitHub Pages

1. Fork this repo  
2. Go to **Settings → Pages**  
3. Set Source to: `main` branch / root folder  
4. Save  

Your site will be live at:

```
https://yourusername.github.io/wishcraft/
```

---

## 📝 How It Works

WishCraft uses a simple but powerful flow:

```
User Input → JSON → Base64 Encode → URL Hash → Shareable Link
```

Example:

```
https://yoursite.com/#wish=eyJuYW1lIjoiQWxpY2UiLCJtc2ciOiJIYXBweSBCaXJ0aGRheSEifQ==
```

When opened:

- Browser reads `#wish=` hash  
- Decodes Base64 data  
- Applies theme, font & effects  
- Loads image (if included)  
- Plays confetti 🎊  
- Displays the wish  

✅ No server  
✅ No database  
✅ No stored data  
✅ 100% client-side  

---

## 🖼️ Photo Upload

- Max Size: **4MB**
- Formats: JPG, PNG, WebP
- Hosted via **Cloudinary CDN**
- Not stored on WishCraft servers

💡 Tip: Use square images for best layout results.

---

## 🎨 Themes

| Theme | Best For |
|-------|----------|
| Premium Glow | Elegant celebration wishes |
| Centered Minimal | Clean, modern style |
| Split Photo | Message + image layout |
| Bold Poster | Big, impactful announcements |

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| QR not showing | Check internet (QR API required) |
| Upload fails | Ensure image < 4MB |
| Link too long | Shorten message or image size |
| Share button missing | Use "Copy Link" |
| Confetti not playing | Refresh page |

---

## 🔐 Privacy & Security

- 🔒 No database  
- 🍪 No cookies  
- 🌐 No backend  
- 🗑️ No logs  
- 🚫 No tracking  

All content lives inside your URL.

You are responsible for the content you create and share.

---

## 🛠️ For Developers

### 📁 Project Structure

```
wishcraft/
├── index.html
├── style.css
├── script.js
├── Logo_0.png
└── README.md
```

### ⚙️ Built With

- Vanilla JavaScript
- CSS Variables
- Canvas API (Confetti)
- Cloudinary API (Image Upload)
- QRServer API (QR Generation)

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch  
   ```
   git checkout -b feature/your-feature
   ```
3. Commit changes  
   ```
   git commit -m "✨ Add feature"
   ```
4. Push & open a Pull Request  

Ideas welcome!

---

## 🗺️ Coming Soon

- 🎵 Background music
- ⏱️ Birthday countdown timer
- 🖼️ Export wish as image
- 🌍 Multi-language support
- 💾 Save design as JSON

Have an idea? Open an issue 💡

---

## 🙏 Credits

Built with ❤️ using modern web standards  

- Fonts via Google Fonts  
- QR via QRServer API  
- Image hosting via Cloudinary  

---

## 👨‍💻 Creator

Designed & Developed by **Syed Sameer**

Made with ❤️ by **ChatGPT**  
Prompted by **Syed Sameer**

---

## 📜 License

MIT License — Free for personal and educational use.

See the LICENSE file for full details.

---

<div align="center">

⭐ Star this repository if you loved WishCraft!  
🎂 Spread happiness. Share beautifully.

</div>
