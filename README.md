✨ WishCraft — Premium Birthday Wish Studio

Create stunning, shareable birthday wish pages with themes, fonts, effects, photos, and a beautifully styled QR code — all hosted on GitHub Pages.

<p align="center"> <b>🎉 Design → Generate → Share → Celebrate</b> </p>
🌐 Live Demo

After enabling GitHub Pages:
https://syedsameer-xtech.github.io/wishcraft/

Generated wishes look like:
https://syedsameer-xtech.github.io/wishcraft/#wish=...

No backend. No database.
Everything runs directly in the browser.

🚀 Features
🎨 Premium Themes

Beautiful dual-tone gradient themes with intelligent QR color matching.

🧩 Templates

Multiple layout styles:

Premium Glow

Centered Minimal

Split Photo

Bold Poster

🔤 Font Styles

Luxury + modern typography:

Poppins

Montserrat

Raleway

Playfair Display

Cinzel

Pacifico

Auto mode (theme-based)

✨ Visual Effects

Glow

Sparkle

Neon

Glass

Auto

🖼 Cloud Photo Upload

Secure upload to Cloudinary

CDN-delivered images

Fast loading

Optional (works without photo)

🔗 Smart Share Link

Encodes the full design inside the URL hash:

No server storage

Fully static

Privacy friendly

📱 Themed QR Code

Auto-colored based on selected theme

Downloadable PNG

Shareable

Clipboard copy supported

🎊 Confetti Celebration

Animated confetti burst on wish open.

🛠 Tech Stack

HTML5

Modern CSS (Glassmorphism + Gradients)

Vanilla JavaScript

Cloudinary (Image Hosting)

QRServer API

GitHub Pages (Hosting)

Zero frameworks.
Zero build tools.
Pure performance.

📦 Project Structure

wishcraft/
│
├── index.html
├── style.css
├── script.js
├── Logo_0.png (optional logo)
└── README.md

⚙️ Setup Guide
1️⃣ Upload to GitHub

Push the repository to GitHub.

2️⃣ Enable GitHub Pages

Go to:
Settings → Pages
Under Source:

Select: Deploy from a branch

Branch: main

Folder: / (root)

Click Save

Your site will go live within 1 minute.

🖼 Cloudinary Setup (Required for Photo Upload)

In script.js:
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";
const CLOUDINARY_UNSIGNED_PRESET = "your_unsigned_preset";

Create Unsigned Upload Preset:

Cloudinary Dashboard

Settings → Upload

Enable "Unsigned uploads"

Create preset

Copy preset name

🔐 Privacy & Architecture

No backend

No cookies

No user tracking

No database

No stored user content

All wish data is encoded in the URL hash:
#wish=BASE64_ENCODED_DATA

This means:

The server never sees the wish content

Everything runs client-side

Fully static hosting compatible

🎯 How It Works

User enters:

Name

Message

Theme

Template

Font

Effect

Optional photo

Data is:

Sanitized

JSON encoded

Base64 encoded

Added to URL hash

QR code is generated using:

https://api.qrserver.com/

When link is opened:

Hash is decoded

UI renders player mode

Confetti plays 🎉

📱 Device Compatibility

Chrome

Safari

Firefox

Edge

Android browsers

iOS browsers

Responsive + Mobile Optimized.

🎨 Design Philosophy

WishCraft focuses on:

Clean dark luxury aesthetic

Subtle glow gradients

High readability

Premium visual hierarchy

Zero clutter UI

Smooth interactions

Elegant typography

Minimal but powerful.

⚠️ Usage Terms

By using this project:

You confirm rights to any uploaded content.

Do not upload illegal or copyrighted material.

Anyone with the link can access the wish.

The project is provided “as-is”.

❤️ Credits

Made with ChatGPT ♥
Designed & Built by Syed Sameer
