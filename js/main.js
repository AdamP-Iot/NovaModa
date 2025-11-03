/* =========================================
   MAIN.JS (čistší verze, vizuál 1:1)
   - Mobilní menu (hamburger)
   - Helpery
   - Načtení dat (content.json)
   - Render: Hero, Katalog, Detail, Kontakt, Košík
   - Router (hash routing)
   - Košík (localStorage)
   - Popup (studentský projekt)
   ========================================= */

/* ---------- Mobilní menu (hamburger) ---------- */
/* Hamburger Toggle + zavření po kliknutí na odkaz */
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  navList.addEventListener('click', (e) => {
    if (e.target.matches('.nav__link')) {
      navList.classList.remove('active');
    }
  });
}


/* ---------- Helpery ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function setActiveNav(hash) {
  $$('.nav__link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === hash);
  });
}

/* ---------- Načtení dat (s jednoduchým cache) ---------- */
let __DATA = null;
async function loadData() {
  if (__DATA) return __DATA;
  const res = await fetch('data/content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Nepodařilo se načíst content.json');
  __DATA = await res.json();
  return __DATA;
}

/* ---------- Render: Hero ---------- */
function renderHero(data) {
  const { hero, stats, products } = data;

  // vybereme "featured" produkty podle id v JSONu
  const featuredIds = data.featured || [];
  const featured    = products.filter(p => featuredIds.includes(p.id));

  return `
    <section class="hero">
      <div class="hero__container">
        <h1 class="hero__title">
          ${hero.title}
          <span>${hero.subtitle}</span>
        </h1>
        <p class="hero__subtitle">${hero.lead}</p>
        <div class="flex gap-4" style="justify-content:center;">
          <a href="#katalog" class="btn btn--primary btn--large">${hero.cta1}</a>
          <a href="#kontakt" class="btn btn--secondary btn--large">${hero.cta2}</a>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="disclaimer">
        <div class="disclaimer__icon">⚠️</div>
        <strong>STUDENTSKÝ PROJEKT:</strong> Tyto stránky byly vytvořeny v rámci školního projektu. Obsah je fiktivní.
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="stats">
          ${stats.map(s => `
            <div class="stat-card">
              <div class="stat-card__value">${s.value}</div>
              <div class="stat-card__label">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section id="produkty" class="section section--dark">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">Nejnovější produkty</h2>
          <p class="section__subtitle">Vybrali jsme pro vás ty nejžhavější kousky z kolekce.</p>
        </div>
        <div class="grid grid--3">
          ${featured.map(p => productCard(p, true)).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ---------- Render: Katalog ---------- */
function renderCatalog(products) {
  return `
    <section class="hero" style="padding: var(--space-12) 0;">
      <div class="hero__container">
        <h1 class="hero__title">Katalog</h1>
        <p class="hero__subtitle">Kompletní přehled našich produktů – mikiny, trička, bundy, kalhoty i doplňky.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid--3">
          ${products.map(p => productCard(p, false)).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ---------- Render: Detail produktu ---------- */
function renderProductDetail(p, allProducts = []) {
  if (!p) {
    return `
      <section class="section">
        <div class="container">
          <p>Produkt nebyl nalezen.</p>
          <a href="#katalog" class="btn btn--secondary mt-4">Zpět do katalogu</a>
        </div>
      </section>
    `;
  }

  const related = relatedProducts(p.id, allProducts);

  return `
    <section class="section">
      <div class="container">
        <div class="product-card product-card--horizontal">
          <img src="${p.image}" alt="${p.title}" class="product-card__image">
          <div class="product-card__content">
            <div class="product-card__category">${p.category}</div>
            <h1 class="product-card__title">${p.title}</h1>
            ${p.ratingText ? `<div class="product-card__rating">${p.ratingText}</div>` : ``}
            <div class="product-card__price">${p.price}</div>
            <p class="mb-4">${p.description}</p>
            <div class="flex gap-4">
              <button class="btn btn--primary btn--large" data-add="${p.id}">Do košíku</button>
              <a href="#katalog" class="btn btn--secondary btn--large">Zpět do katalogu</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container">
        <h2 class="section__title">Mohlo by se vám líbit</h2>
        <div class="grid grid--3">
          ${related.map(p => productCard(p, true)).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ---------- „Mohlo by se vám líbit“ (náhodné 3) ---------- */
function relatedProducts(currentId, allProducts) {
  const others = allProducts.filter(p => p.id !== currentId);
  return others.sort(() => 0.5 - Math.random()).slice(0, 3);
}

/* ---------- Render: Kontakt ---------- */
function renderContact(c) {
  return `
    <section class="hero" style="padding: var(--space-12) 0;">
      <div class="hero__container">
        <h1 class="hero__title">Kontakt</h1>
        <p class="hero__subtitle">${c.description}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="info-box">
          <div class="info-box__title">${c.title}</div>
          <div class="info-box__text">
            <p><strong>E-mail:</strong> ${c.email}</p>
            <p><strong>Telefon:</strong> ${c.phone}</p>
            <p><strong>Adresa:</strong> ${c.address}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ---------- Produktová karta ---------- */
function productCard(p, showBadge) {
  return `
    <article class="product-card">
      ${showBadge && p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ``}
      <img src="${p.image}" alt="${p.title}" class="product-card__image">
      <div class="product-card__content">
        <div class="product-card__category">${p.category}</div>
        <h3 class="product-card__title">${p.title}</h3>
        ${p.ratingText ? `<div class="product-card__rating">${p.ratingText}</div>` : ``}
        <div class="product-card__price">${p.price}</div>
        <button class="btn btn--primary" style="width:100%;" data-id="${p.id}">Detail produktu</button>
      </div>
    </article>
  `;
}

/* ---------- Router ---------- */
async function renderPage() {
  const app  = $('#app');
  const hash = window.location.hash || '#home';
  const data = await loadData();

  // aktivní stav v navigaci
  setActiveNav(hash.startsWith('#produkt-') ? '#katalog' : hash);

  if (hash === '#home') {
    app.innerHTML = renderHero(data);
  } else if (hash === '#katalog') {
    app.innerHTML = renderCatalog(data.products);
  } else if (hash.startsWith('#produkt-')) {
    const id = hash.replace('#produkt-', '');
    const product = data.products.find(p => p.id === id);
    app.innerHTML = renderProductDetail(product, data.products);
  } else if (hash === '#kontakt') {
    app.innerHTML = renderContact(data.contacts);
  } else if (hash === '#kosik') {
    app.innerHTML = renderCart();
  } else {
    app.innerHTML = renderHero(data);
  }

  // zavři mobilní menu po navigaci
  if (navList && navList.classList.contains('active')) {
    navList.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  // vždy skroluj nahoru při přepnutí stránky
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', renderPage);
window.addEventListener('load', renderPage);

/* ---------- Delegace: klik na „Detail produktu“ ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-id]');
  if (btn) {
    const id = btn.getAttribute('data-id');
    window.location.hash = `#produkt-${id}`;
  }
});

/* ---------- Delegace: klik na „Do košíku“ ---------- */
document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    const id = addBtn.getAttribute('data-add');
    const data = await loadData();
    const product = data.products.find(p => p.id === id);
    if (product) addToCart(product);
  }
});

/* =========================================
   KOŠÍK (localStorage)
   ========================================= */
const CART_KEY = 'novaModaCart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart  = getCart();
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

/* Přidání do košíku */
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`✅ ${product.title} byl přidán do košíku`);
}

/* Odebrání položky z košíku */
document.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-remove]');
  if (removeBtn) {
    const id = removeBtn.getAttribute('data-remove');
    const cart = getCart().filter(p => p.id !== id);
    saveCart(cart);
    renderPage();
  }
});

/* Výpočet celkové ceny (z „1 299 Kč“ → 1299) */
function parsePriceToNumber(priceStr) {
  const num = parseInt(String(priceStr).replace(/\D/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/* Render: Košík */
function renderCart() {
  const cart = getCart();
  if (!cart.length) {
    return `
      <section class="section">
        <div class="container">
          <h1 class="section__title">Váš košík je prázdný 🛍️</h1>
          <a href="#katalog" class="btn btn--primary mt-4">Zpět do katalogu</a>
        </div>
      </section>
    `;
  }

  const total = cart.reduce((sum, p) => sum + parsePriceToNumber(p.price) * p.quantity, 0);

  return `
    <section class="section">
      <div class="container">
        <h1 class="section__title">Váš košík</h1>
        <div class="cart-items">
          ${cart.map(p => `
            <div class="cart-item">
              <img src="${p.image}" alt="${p.title}" class="cart-item__img">
              <div class="cart-item__info">
                <h3>${p.title}</h3>
                <p>${p.price} × ${p.quantity}</p>
                <button class="btn btn--secondary btn--small" data-remove="${p.id}">Odebrat</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="cart-summary mt-6">
          <p><strong>Celkem:</strong> ${total.toLocaleString('cs-CZ')} Kč</p>
          <button id="checkout-btn" class="btn btn--primary btn--large mt-3">Pokračovat k platbě 💳</button>
        </div>
      </div>
    </section>
  `;
}

/* Fake Checkout (vynuluje košík) */
document.addEventListener('click', (e) => {
  if (e.target.id === 'checkout-btn') {
    localStorage.removeItem(CART_KEY);
    const app = $('#app'); // důležité: nepoužívat proměnnou z jiného scope
    app.innerHTML = `
      <section class="section">
        <div class="container text-center">
          <h1 class="section__title">✅ Platba úspěšná</h1>
          <p class="mb-4">Děkujeme za váš nákup! Vaše objednávka byla zaznamenána (simulace).</p>
          <a href="#katalog" class="btn btn--primary">Zpět do katalogu</a>
        </div>
      </section>
    `;
    updateCartCount();
  }
});

/* =========================================
   Popup: STUDENTSKÝ PROJEKT
   ========================================= */
window.addEventListener('DOMContentLoaded', () => {
  const popup   = document.getElementById('project-popup');
  const closeBtn = document.getElementById('popup-close');

  if (popup) {
    popup.classList.add('active'); // vždy po refreshi / prvním otevření
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
    });
  }
});
