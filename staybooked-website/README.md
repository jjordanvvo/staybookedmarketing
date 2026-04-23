# Stay Booked — Website

**Online Advertising That Fills Your Calendar**  
staybookedonline.com

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete single-page site — all content and structure |
| `styles.css` | All styles, animations, and responsive layout |
| `script.js` | Navbar scroll, mobile menu, scroll reveals, stat counters, FAQ accordion, form handling |
| `netlify.toml` | Netlify deploy config + security headers |

---

## Deploy to Netlify (drag & drop — 60 seconds)

1. Go to [netlify.com](https://netlify.com) and log in (or create a free account)
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the entire `staybooked-website` folder into the deploy drop zone
4. Netlify assigns a URL instantly (e.g., `random-name.netlify.app`)
5. Go to **Site settings → Domain management** to add your custom domain (`staybookedonline.com`)

**That's it.** The contact form works automatically via Netlify Forms — no backend needed.

---

## Custom Domain Setup

1. In Netlify: Site settings → Domain management → Add custom domain
2. Enter `staybookedonline.com`
3. Update your DNS registrar (GoDaddy, Namecheap, etc.) to point to Netlify:
   - Add a CNAME record: `www` → `[your-netlify-subdomain].netlify.app`
   - Or use Netlify DNS for the simplest setup (they walk you through it)
4. SSL/HTTPS is provisioned automatically (free)

---

## Contact Form

The form uses **Netlify Forms** — submissions appear in your Netlify dashboard under **Forms**.

To add email notifications:
1. Netlify dashboard → Forms → contact → Form notifications
2. Add your email address for instant alerts on every submission

To test locally: the form won't submit via `file://` — deploy to Netlify first, or use the Netlify CLI:
```
npm install -g netlify-cli
netlify dev
```

---

## Customization

All colors are CSS custom properties in `styles.css` (lines 1–35). Change one variable and the whole site updates:

```css
--blue:   #3B82F6;   /* primary accent */
--cyan:   #06B6D4;   /* secondary accent */
--green:  #10B981;   /* stats / proof */
```

**Swap placeholder images:** Search `images.unsplash.com` in `index.html` and replace each URL with your own photo.

**Add your real logo:** Replace the `STAY BOOKED` text in `.nav-logo` with an `<img>` tag pointing to your logo file.

---

## Performance Notes

- All images use `loading="lazy"` (native browser lazy loading)
- Google Fonts loads asynchronously via preconnect
- Zero JavaScript dependencies — vanilla JS only
- CSS animations respect `prefers-reduced-motion`

---

## Support

**Kolby McCargar** — (916) 606-9970  
contact@staybookedonline.com
