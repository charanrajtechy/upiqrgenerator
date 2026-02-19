# Open UPI QR Generator

A privacy-focused, frontend-only UPI QR generator built for freelancers and creators to generate dynamic UPI payment QR codes without backend infrastructure.

Built by **Charan Raj – Owner of CLP Studio**

---

## 📌 Overview

Open UPI QR Generator is a static, client-side web application that dynamically constructs valid UPI deep links and generates corresponding QR codes in real time.

The application does not use any backend services, databases, authentication systems, analytics tools, cookies, or persistent storage. All processing happens entirely in the browser memory.

This project is designed for lightweight deployment and maximum privacy.

---

## 🏗 Architecture

**Type:** Static Single Page Application (SPA)  
**Stack:**  
- TYPE SCRIPT  
- CSS 
- Client-side QR generation library  

**Data Handling Model:**
- No API calls
- No server communication
- No localStorage/sessionStorage usage
- No data persistence

All user inputs are processed temporarily in runtime memory.

---

## 🔗 UPI Deep Link Construction

The app dynamically builds a UPI deep link using the base format:

```
upi://pay?pa={UPI_ID}
```

Optional parameters are appended only if provided:

| Parameter | Description |
|-----------|------------|
| `pn` | Payee Name |
| `am` | Amount |
| `cu=INR` | Currency (required if amount is present) |
| `tn` | Transaction Note |

### Example (Full Parameters)

```
upi://pay?pa=9951238916@fam&pn=CLP%20Studio&am=200&cu=INR&tn=Advance
```

### Dynamic Rules

- Only include parameters with user input.
- URL-encode `pn` and `tn`.
- Append `&cu=INR` only when `am` is present.
- Trim whitespace before processing.

---

## ✅ Validation Logic

- UPI ID must match pattern: `name@bank`
- Amount must be a positive numeric value
- Empty fields are ignored (except UPI ID)
- All inputs are trimmed
- Proper URI encoding is enforced

---

## 🎨 UI/UX System

### Design Principles
- Minimal
- Professional
- Mobile-first
- Card-based layout

### Theme System
- Supports Light and Dark modes
- Defaults to `prefers-color-scheme`
- Manual toggle support
- Smooth theme transitions
- QR preview adapts to selected theme

### Preview Card Logic
- Sections auto-hide if data is absent
- No blank layout gaps
- Amount displayed prominently in ₹ format when present

---

## 📥 Features

- Dynamic UPI link generation
- Real-time QR code rendering
- Download QR as high-resolution PNG
- Direct `upi://` deep link testing
- Fully responsive design
- Zero external dependencies beyond QR library

---

## 🔒 Privacy Model

This project guarantees:

- No data collection
- No backend server
- No tracking scripts
- No analytics
- No cookies
- No database
- No authentication
- No third-party integrations

Everything runs entirely in the client browser.

---

## 🚀 Deployment

Since the app is fully static, it can be deployed on:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static hosting provider

No environment variables or configuration required.

---

## 🎯 Intended Use Cases

- Freelancers collecting advance payments
- Creators charging service fees
- Small businesses generating quick payment QR
- Client invoice-style payment requests

---

## 📂 Suggested Project Structure

```
/index.html
/style.css
/script.js
/README.md
```

---

## ⚠ Limitations

- UPI apps may allow users to edit amount before final confirmation.
- Fixed amount enforcement depends on individual UPI app behavior.
- No transaction verification system (frontend-only limitation).

---

## 📄 License

Open-source. Free to use and modify.

---

### Designed with simplicity, transparency, and real-world usability in mind.
