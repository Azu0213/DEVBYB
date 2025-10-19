# 🌎 DEVBYB

**Custom websites built fast — pick a planet to launch your project.**

DEVBYB is a sleek, interactive one-page web experience that lets users choose a “planet” (plan tier) and submit a full creative brief for a custom website build.  
Each plan comes with unique features, pricing, and a one-week delivery timeline.

---

## 🚀 Live Demo
[https://devbyb7.netlify.app](https://devbyb7.netlify.app)

---

## 🧠 Features
- **Animated planet selector** — visually choose your build tier.
- **Live cost calculator** — instant price updates including tax.
- **Interactive intake form** — collects scope, add-ons, and design preferences.
- **File uploads** — attach design briefs or brand assets.
- **Integrated AI helper** — answers questions about pricing, timelines, and SEO.
- **Accessible & responsive** — works beautifully on desktop and mobile.
- **1-week delivery plans** — Starter, Professional, Premium, and Enterprise.

---

## 🛠️ Tech Stack
- **HTML5** — structure  
- **CSS3** — responsive layout and animation  
- **JavaScript (ES6)** — dynamic interactions and pricing logic  
- **Google Apps Script** — backend form handler  
- **Netlify** — hosting and deployment  

---

## 🧩 File Structure

---

## ⚙️ Deployment (Netlify)
This project is static — no frameworks or build steps required.

| Setting | Value |
|----------|--------|
| **Base directory** | `.` |
| **Build command** | *(leave blank)* |
| **Publish directory** | `.` |
| **Functions directory** | *(leave blank)* |

Ensure your **`netlify.toml`** includes:

```toml
[build]
  base = "."
  publish = "."
  command = ""

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
💬 Contact
📞 818-261-7850
✉️ devbyb12@gmail.com
🌐 GitHub Repository

---

After adding this file:

```bash
git add README.md
git commit -m "Add project README"
git push
