/* Stay Weird Studios — shared layout + cart. No build step; plain JS. */
(function () {
  const BRAND = "Stay Weird Studios";
  const FREE_SHIP = 150;
  const P = window.SW_PRODUCTS;
  const $ = (s, r = document) => r.querySelector(s);
  const money = (n) => "$" + n.toFixed(2).replace(/\.00$/, "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 3v11a4 4 0 1 1-4-4"/><path d="M14 3c.5 3 2.5 5 6 5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l16 16M20 4 4 20"/></svg>'
  };

  /* ---------- Placeholder / image helper ---------- */
  function media(p, i = 0, alt = false) {
    const src = p && p.images && p.images[i];
    const cls = "ph" + (alt ? " ph--alt" : "");
    if (src) return `<div class="${cls}"><img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy"></div>`;
    return `<div class="${cls}">${alt ? "Image 2" : "Image"}</div>`;
  }
  window.SW_media = media;

  function isSoldOut(p) { return p.sizes.every((s) => p.soldOut.includes(s)); }

  function card(p) {
    const sold = isSoldOut(p);
    const badge = sold ? '<span class="badge badge--sold">Sold Out</span>' : p.badge ? `<span class="badge">${esc(p.badge)}</span>` : "";
    const quick = sold ? "" : `<div class="quick-add" aria-label="Quick add">${p.sizes.map((s) => `<button data-qa="${p.id}" data-size="${esc(s)}" ${p.soldOut.includes(s) ? "disabled" : ""}>${esc(s)}</button>`).join("")}</div>`;
    return `<a class="card" href="/product?id=${encodeURIComponent(p.id)}">
      <div class="card__media">${badge}${media(p, 0)}${media(p, 1, true)}${quick}</div>
      <div class="card__info"><div><div class="card__name">${esc(p.name)}</div><div class="card__color">${esc(p.color)}</div></div><div class="price">${money(p.price)}</div></div>
    </a>`;
  }
  window.SW_card = card;

  /* ---------- Cart (localStorage) ---------- */
  const KEY = "sw_cart";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  let cart = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} renderCart(); }
  function add(id, size, qty = 1) {
    const line = cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty += qty; else cart.push({ id, size, qty });
    save();
    openDrawer("cart");
  }
  window.SW_addToCart = add;

  function renderCart() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = count));
    const body = $("#cart-body"), foot = $("#cart-foot");
    if (!body) return;
    const lines = cart.map((l) => ({ ...l, p: P.find((p) => p.id === l.id) })).filter((l) => l.p);
    if (!lines.length) {
      body.innerHTML = `<div class="cart-empty"><p>Your cart is empty</p><br><a class="btn btn--ghost" href="/shop">Continue Shopping</a></div>`;
      foot.hidden = true;
      return;
    }
    const sub = lines.reduce((n, l) => n + l.p.price * l.qty, 0);
    const left = Math.max(0, FREE_SHIP - sub);
    body.innerHTML = `<div class="ship-bar">${left ? `You're ${money(left)} away from free shipping` : "You've unlocked free shipping"}<div class="ship-bar__track"><div class="ship-bar__fill" style="width:${Math.min(100, (sub / FREE_SHIP) * 100)}%"></div></div></div>` +
      lines.map((l, i) => `<div class="cart-item">
        <a href="/product?id=${encodeURIComponent(l.id)}">${media(l.p, 0)}</a>
        <div><div class="cart-item__name">${esc(l.p.name)}</div><div class="cart-item__meta">${esc(l.p.color)} / ${esc(l.size)}</div>
          <div class="qty"><button data-dec="${i}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Increase">+</button></div></div>
        <div style="text-align:right"><div>${money(l.p.price * l.qty)}</div><br><button class="link-btn" data-rm="${i}">Remove</button></div>
      </div>`).join("");
    foot.hidden = false;
    $("#cart-sub").textContent = money(sub);
  }

  /* ---------- Layout ---------- */
  const nav = [["Shop All", "/shop"], ["New", "/shop?c=all&sort=new"], ["Tops", "/shop?c=tops"], ["Bottoms", "/shop?c=bottoms"], ["Accessories", "/shop?c=accessories"]];
  const msgs = ["Free shipping on orders over $" + FREE_SHIP, "New drop out now", "Stay weird", "Worldwide shipping"];

  function layout() {
    const here = location.pathname.replace(/\/$/, "") + location.search;
    const announce = `<div class="announce" role="region" aria-label="Announcements"><div class="announce__track">${[...msgs, ...msgs, ...msgs, ...msgs].map((m) => `<span>${m}</span>`).join("")}</div></div>`;
    const header = `<header class="header" id="header">
      <div style="display:flex;align-items:center;gap:16px">
        <button class="icon-btn burger" data-open="menu" aria-label="Menu">${ICON.menu}</button>
        <nav class="header__nav">${nav.map(([t, h]) => `<a href="${h}" class="${here === h ? "active" : ""}">${t}</a>`).join("")}</nav>
      </div>
      <a class="logo" href="/">${BRAND}</a>
      <div class="header__icons">
        <button class="icon-btn" data-open="search" aria-label="Search">${ICON.search}</button>
        <a class="icon-btn hide-sm" href="/contact" aria-label="Account">${ICON.user}</a>
        <button class="icon-btn" data-open="cart" aria-label="Cart">${ICON.bag}<span class="cart-count" data-cart-count>0</span></button>
      </div>
    </header>`;
    const drawers = `<div class="overlay" id="overlay"></div>
      <aside class="drawer drawer--left" id="drawer-menu" aria-label="Menu">
        <div class="drawer__head"><span>Menu</span><button data-close aria-label="Close">${ICON.close}</button></div>
        <div class="drawer__body"><nav class="menu-links">${nav.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="/about">About</a></nav>
          <div class="menu-small"><a href="/contact">Contact</a><a href="/shipping">Shipping & Returns</a><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></div></div>
      </aside>
      <aside class="drawer drawer--right" id="drawer-cart" aria-label="Cart">
        <div class="drawer__head"><span>Cart (<span data-cart-count>0</span>)</span><button data-close aria-label="Close">${ICON.close}</button></div>
        <div class="drawer__body" id="cart-body"></div>
        <div class="drawer__foot" id="cart-foot" hidden>
          <div class="cart-row"><span>Subtotal</span><span id="cart-sub"></span></div>
          <p class="cart-item__meta" style="margin-bottom:14px">Taxes and shipping calculated at checkout</p>
          <button class="btn" id="checkout">Checkout</button>
        </div>
      </aside>
      <div class="search" id="drawer-search" role="dialog" aria-label="Search">
        <div class="search__row">${ICON.search}<input id="search-input" type="search" placeholder="Search products" autocomplete="off"><button data-close aria-label="Close">${ICON.close}</button></div>
        <div class="search__results" id="search-results"></div>
      </div>
      <div class="toast" id="toast"></div>`;
    const footer = `<section class="newsletter">
        <h2>Join the list</h2><p>Early access to drops and restocks.</p>
        <form class="field-row" id="newsletter"><input type="email" required placeholder="Email address" aria-label="Email address"><button type="submit">Subscribe</button></form>
        <div class="form-msg" id="newsletter-msg"></div>
      </section>
      <footer class="footer">
        <div class="footer__cols">
          <div class="footer__brand"><div class="logo" style="text-align:left;margin-bottom:12px">${BRAND}</div><p class="cart-item__meta" style="max-width:280px">Placeholder brand line. Swap with the real tagline.</p></div>
          <div><h4>Shop</h4><ul>${nav.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
          <div><h4>Help</h4><ul><li><a href="/shipping">Shipping & Returns</a></li><li><a href="/size-guide">Size Guide</a></li><li><a href="/contact">Contact</a></li></ul></div>
          <div><h4>Info</h4><ul><li><a href="/about">About</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li></ul></div>
        </div>
        <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${BRAND}</span>
          <div class="socials"><a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a><a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tt}</a><a href="https://x.com" target="_blank" rel="noopener" aria-label="X">${ICON.x}</a></div>
        </div>
      </footer>`;
    document.body.insertAdjacentHTML("afterbegin", announce + header + drawers);
    document.body.insertAdjacentHTML("beforeend", footer);
  }

  /* ---------- Drawers ---------- */
  let openEl = null;
  function openDrawer(name) {
    closeDrawer();
    openEl = $("#drawer-" + name);
    if (!openEl) return;
    openEl.classList.add("open");
    $("#overlay").classList.add("open");
    document.body.classList.add("lock");
    if (name === "search") setTimeout(() => $("#search-input").focus(), 50);
  }
  function closeDrawer() {
    if (openEl) openEl.classList.remove("open");
    openEl = null;
    const o = $("#overlay"); if (o) o.classList.remove("open");
    document.body.classList.remove("lock");
  }
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  window.SW_toast = toast;

  function bind() {
    document.addEventListener("click", (e) => {
      const o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); openDrawer(o.dataset.open); return; }
      if (e.target.closest("[data-close]") || e.target.id === "overlay") { closeDrawer(); return; }
      const qa = e.target.closest("[data-qa]");
      if (qa) { e.preventDefault(); e.stopPropagation(); add(qa.dataset.qa, qa.dataset.size); return; }
      const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-rm]");
      if (inc) { cart[+inc.dataset.inc].qty++; save(); }
      if (dec) { const l = cart[+dec.dataset.dec]; l.qty--; if (l.qty < 1) cart.splice(+dec.dataset.dec, 1); save(); }
      if (rm) { cart.splice(+rm.dataset.rm, 1); save(); }
      if (e.target.id === "checkout") toast("Checkout connects once the store backend is set up");
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

    $("#search-input").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const res = q ? P.filter((p) => (p.name + " " + p.color + " " + p.collection).toLowerCase().includes(q)) : [];
      $("#search-results").innerHTML = q && !res.length ? `<p class="cart-item__meta up">No results for “${esc(q)}”</p>` : res.map(card).join("");
    });

    $("#newsletter").addEventListener("submit", (e) => {
      e.preventDefault();
      $("#newsletter-msg").textContent = "Thanks — you're on the list";
      e.target.reset();
    });

    // Hide header on scroll down, show on scroll up
    let last = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY, h = $("#header");
      if (y > 200 && y > last) h.classList.add("hide"); else h.classList.remove("hide");
      last = y;
    }, { passive: true });
  }

  layout();
  bind();
  renderCart();
})();
