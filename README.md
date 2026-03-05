# Open UPI QR Generator

A privacy-first web tool to generate professional **UPI payment QR codes instantly**.

No login • No tracking • No server storage  
Everything runs completely inside your browser.

Built by **Charan Raj – CLP Studio**

---

# Overview

Open UPI QR Generator is a lightweight frontend-only tool that allows users to create clean and professional UPI QR codes for collecting payments.

This tool is designed for:

- Freelancers
- Small businesses
- Content creators
- Service providers
- Anyone who needs a simple payment QR

Unlike most QR generators, this project focuses on **privacy, simplicity, and real-world usability**.

All QR generation happens **locally in the user's browser**.

---

# Key Principles

### Privacy First
No analytics, no tracking scripts, and no user data collection.

### Frontend Only
The entire application runs without any backend server.

### Real-World Reliability
QR codes are designed to work properly with major UPI apps.

Tested with:

- Google Pay
- PhonePe
- Paytm
- FapApp
- Camera QR scanners

---

# Architecture

Application Type:

Static Single Page Application (SPA)

Tech Stack:

- HTML
- CSS
- Vanilla JavaScript

Design Approach:

- No backend server
- No database
- No API dependency
- All logic runs client-side

---

# UPI Deep Link Generation

The QR code encodes the official UPI payment URI format.

Example structure:

```
upi://pay?pa=upi-id&pn=name&am=amount&tn=note
```

Parameters used:

| Parameter | Description |
|----------|-------------|
| pa | Payee UPI ID |
| pn | Payee Name |
| am | Payment Amount |
| tn | Transaction Note |

---

# Dynamic QR Generation Rules

The app automatically constructs the payment link.

Rules:

- `pa` (UPI ID) is required
- `pn` added only when Payee Name is entered
- `am` added only when Amount is provided
- `tn` added only when Note is provided

This keeps the QR clean and compatible with UPI apps.

---

# Input Fields

Users can enter the following information:

UPI ID *(required)*  
Payee Name *(optional)*  
Amount *(optional)*  
Payment Note *(optional)*  
Payment Title / Label *(optional)*

Preset amount buttons are also available for quick selection.

---

# QR Customization

Users can customize how the QR code looks.

### Corner Style (Finder Patterns)

Controls the three corner markers of the QR code.

Available styles:

- Square (default)
- Smooth corners
- Rounded

These only affect **visual appearance**.

---

### QR Module Style

Controls the small blocks inside the QR code.

Available styles:

- Square
- Dots
- Rounded Square
- Soft Rounded
- Diamond

Important:

These styles **do not modify the encoded payment data**.

---

# Logo Upload

Users can upload a logo to place in the center of the QR code.

Features:

- Center logo placement
- Maintains QR scannability
- Preview before download

Logo size is limited to maintain reliable scanning.

---

# QR Card Styles

The preview card can be displayed in different styles:

- Minimal
- Bold Amount
- Boxed Card
- Centered

These styles change the **layout of the preview card**, not the QR itself.

---

# QR Download System

Users can export the QR code as a PNG image.

Features:

- High resolution export
- Clean margins for scanning
- Print friendly format

---

# Smart Download Fallback

When the user clicks **Download QR**:

1. The app tries to download the QR image
2. If the browser blocks downloads
3. The app automatically attempts **Share QR**

This ensures the user can still save the QR.

---

# QR Sharing

The app supports sharing using the **Web Share API**.

Users can share:

- QR image
- Payment details

Works best on mobile devices.

---

# Toast Notifications

Users receive feedback when actions occur.

Examples:

- QR downloaded successfully
- QR shared successfully
- Download failed, trying share
- Payment details copied

---

# QR History

Generated QR records are saved locally.

Stored data includes:

- UPI ID
- Payee name
- Amount
- Note
- Timestamp

Important:

QR history is stored **only in the user's browser using local storage**.

No server storage.

---

# Template System

Users can save reusable templates.

Templates store:

- UPI ID
- Payee Name

This allows quick QR generation for repeated payments.

---

# Reset System

Users can reset the entire app configuration.

Reset clears:

- QR history
- Saved templates
- Customization styles
- Beta settings
- Local preferences

A confirmation dialog prevents accidental reset.

---

# Beta Features

Experimental features are available through a **Beta toggle**.

Examples:

- QR appearance customization
- Advanced QR styles
- Experimental rendering

Beta features are disabled by default.

---

# Feature Request System

Users can submit suggestions directly from the app.

The feature request form collects:

- Name
- Email
- Phone
- Suggestion

Submissions are handled through **Google Forms**.

---

# UI / UX Design

Design philosophy:

- Minimal interface
- Mobile-first layout
- Fast interaction
- Clean hierarchy

---

# Theme System

The application includes:

- Light Mode
- Dark Mode
- Smooth theme transition

Theme preference is stored locally.

---

# Privacy Model

This project follows a strict privacy-first approach.

The application does NOT:

- Track users
- Store personal data
- Send analytics
- Use cookies for tracking

All processing happens locally in the browser.

---

# Deployment

Since this is a static web application, it can be deployed on:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

No server setup required.

---

# Intended Use Cases

This tool works well for:

- Freelancers requesting payments
- Small businesses collecting UPI payments
- Event organizers
- Online service providers
- Personal payment requests

---

# Limitations

- Works only with UPI compatible apps
- Payment confirmation requires backend integration
- Some experimental styles may affect scanning on very old devices

---

# Developer

**Charan Raj – CLP Studio**

## Connect with the developer:

[![GitHub](https://img.shields.io/badge/GitHub-charanrajtechy-black?logo=github)](https://github.com/charanrajtechy)

[![Instagram](https://img.shields.io/badge/Instagram-charanrajtechy-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/charanrajtechy)

[![Arattai](https://img.shields.io/badge/Arattai-Profile-6C63FF)](https://aratt.ai/user/charanrajtechy)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-charanrajtechy-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/charanrajtechy)

[![Telegram](https://img.shields.io/badge/Telegram-Channel-26A5E4?logo=telegram&logoColor=white)](https://t.me/CharanRajTechy)

[![YouTube](https://img.shields.io/badge/YouTube-CLP%20Studio-FF0000?logo=youtube&logoColor=white)](https://youtube.com/@clpstudiobycharanraj)

[![X](https://img.shields.io/badge/X-CharanRajTechy-black?logo=x)](https://x.com/CharanRajTechy)

[![Threads](https://img.shields.io/badge/Threads-Profile-black?logo=threads)](https://www.threads.com/@charan_raj_panthula)

[![Snapchat](https://img.shields.io/badge/Snapchat-charanrajtechy-FFFC00?logo=snapchat&logoColor=black)](https://www.snapchat.com/add/charanrajtechy)

---

Built with simplicity, transparency, and real-world usability in mind.
