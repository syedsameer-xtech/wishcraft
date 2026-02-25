WishCraft — Premium Birthday Wish Link + QR Generator
Overview

WishCraft is a professional-grade static web application for generating premium, shareable birthday wish pages. It is designed for GitHub Pages deployment and requires no backend infrastructure.

The system encodes all wish data directly into the URL hash using Base64, enabling:

Fully static hosting

Zero server storage

High performance

Privacy-friendly sharing

Instant QR generation

WishCraft combines modern UI design, theme-based customization, Cloudinary image hosting, and dynamic QR rendering to deliver a polished celebratory experience.

Features

Premium Theme Engine
Dual-tone gradient themes with dynamic CSS variables and auto QR color adaptation.

Multiple Layout Templates

Premium Glow

Centered Minimal

Split Photo

Bold Poster

Typography System

Poppins

Montserrat

Raleway

Playfair Display

Cinzel

Pacifico

Intelligent Auto mode

Visual Effects Engine

Glow

Sparkle

Neon

Glass

Auto mode

Cloudinary Image Upload

CDN-hosted image delivery

Fast loading

Optional photo support

Size validation (under 4MB)

Themed QR Code Generation

Color-matched QR codes

Downloadable PNG

Clipboard copy support

Native share API integration

Confetti Animation System
Canvas-powered animated celebration when wish is opened.

Fully Static Architecture
No database. No backend. No cookies.

Project Structure
wishcraft/
├── index.html          # Main UI + player view
├── style.css           # Complete theme & layout system
├── script.js           # Core engine (encoding, QR, upload, rendering)
├── Logo_0.png          # Optional logo
├── README.md
└── ...
Installation
1. Clone the Repository
git clone https://github.com/syedsameer-xtech/wishcraft.git
cd wishcraft
2. No Build Step Required

This is a fully static project.

Simply open:

index.html

Or deploy via GitHub Pages.

GitHub Pages Deployment

Go to:

Settings → Pages

Under Source:

Select Deploy from a branch

Branch: main

Folder: / (root)

Click Save

Your site will be available at:

https://syedsameer-xtech.github.io/wishcraft/
Usage
1. Create a Wish

Fill in:

Name

Birthday message

Theme

Template

Font

Visual effect

Optional photo

Click:

Generate Link + QR

The system:

Encodes data into Base64

Appends it to URL hash

Generates a themed QR

Enables download/share/copy

2. Open a Wish

When a link like:

#wish=BASE64_DATA

is opened:

Hash is decoded

JSON payload is parsed

Theme + template applied

Photo loaded (if exists)

Confetti animation triggered

How It Works (Technical Breakdown)
Encoding System
const payload = {
  v: 7,
  name,
  msg,
  theme,
  template,
  font,
  effect,
  photo
};

JSON serialized

UTF-safe Base64 encoded

Stored in URL hash

Server never sees data

QR Code Generation

Uses:

https://api.qrserver.com/v1/create-qr-code/

Parameters:

size

data

foreground color

background color

margin

format

QR image is fetched as a Blob for:

Download

Native share

Clipboard copy

Cloudinary Upload Flow

User selects image

File validated (<4MB)

Uploaded via unsigned preset

CDN URL returned

Stored inside payload

No server handling required.

Rendering Engine

When in Player Mode:

CSS variables updated dynamically

Body classes adjusted for effects

Template class applied

Font family switched

Photo container toggled

Canvas confetti rendered

All rendering is client-side.

Architecture Principles

Static-first design

No runtime dependencies

No build tools

CDN-based image hosting

Stateless architecture

URL-driven state

Clean separation of builder and player modes

Security & Privacy

No database storage

No cookies

No tracking

No backend logs

URL hash data never sent to server

User responsible for uploaded content

Performance Considerations

Images recommended under 4MB

QR generated at 640x640

Confetti optimized with requestAnimationFrame

No heavy frameworks

Minimal DOM updates

Troubleshooting

QR not generating?

Check internet connection (QR API required).

Photo upload failing?

Verify Cloudinary preset and cloud name.

Ensure file under 4MB.

Share API not working?

Some browsers do not support navigator.share().

Link too long?

Use smaller images.

Avoid extremely long messages.

Dependencies

External services used:

Cloudinary (image hosting)

QRServer API (QR generation)

Google Fonts

GitHub Pages (hosting)

No npm packages required.

Best Practices

Use high contrast themes for readability.

Keep messages concise for better layout.

Use square images for optimal cropping.

Avoid large file uploads.

Test the generated link before sharing.

Roadmap Ideas

Background music support

Video background templates

Countdown timer

Export as image

Multi-language support

Custom QR styling engine

Save design locally

Credits

Built with modern web standards.
Made with ChatGPT ♥
Designed & Developed by Syed Sameer

License

This project is provided for educational and personal use.

Users are responsible for:

Uploaded content

Generated links

Shared media
