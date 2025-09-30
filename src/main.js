import './style.css';
import logoSrc from './assets/logo.png';

import imgRellenitas from './assets/rellenitas_fresa.jpg';
import imgPokeke     from './assets/pokeke.jpg';
import imgPulpin     from './assets/pulpin.jpg';
import imgChocolate  from './assets/bonobon.jpg';
import imgCoca       from './assets/coca_cola_1.png';

/* ============= FORM / INIT ============= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Formulario enviado con éxito 🚀');
    });
  }

  const logoEl = document.getElementById('logoImg');
  if (logoEl) logoEl.src = logoSrc;

  // limpiar y sincronizar
  sanitizeCart();
  renderProducts();
  updateCartBadge();
  refreshCartOpenBtn();
  renderCart();
});

/* ============= ESTADO DEL CARRITO ============= */
const CART_KEY = 'cart_v1';
const cart = loadCart(); // { [productId]: qty }

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = String(cartCount());
}

// helpers para higiene y cambios centralizados
function sanitizeCart() {
  for (const [id, qty] of Object.entries(cart)) {
    const q = Number(qty) || 0;
    if (q <= 0) delete cart[id];
  }
}
function applyCartChange(id, qty) {
  const q = Math.max(0, Math.min(99, Math.floor(Number(qty) || 0)));
  if (q === 0) delete cart[id];
  else cart[id] = q;

  saveCart();
  updateCartBadge();
  refreshCartOpenBtn();
  renderCart();
  renderProducts();
}
function refreshCartOpenBtn() {
  const btn = document.getElementById('cartOpenBtn');
  if (!btn) return;
  const isEmpty = cartCount() === 0;
  btn.disabled = isEmpty;
  btn.setAttribute('aria-disabled', String(isEmpty));
  btn.classList.toggle('is-disabled', isEmpty);
}

/* ============= MONEDA ============= */
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

/* ============= CATÁLOGO ============= */
const PRODUCTS = [
  { id:'gal-rellenitas-fresa', title:'Rellenitas Fresa (50 g)',  description:'Galleta con relleno cremoso de fresa.',        price:0.30, image:imgRellenitas },
  { id:'bizcocho-clasica',     title:'Pokeke Wafer (28 g)',      description:'Bizcocho con cobertura de chocolate.',        price:0.90, image:imgPokeke     },
  { id:'bebida-500',           title:'Pulpín (500 ml)',          description:'Bebida refrescante y lista para llevar.',     price:0.80, image:imgPulpin     },
  { id:'chocolate-barra',      title:'Bon o Bon (90 g)',         description:'Tableta de chocolate.',                       price:0.50, image:imgChocolate  },
  { id:'coca-vaso',            title:'Gaseosa (250 ml)',         description:'Vaso refrescante de gaseosa.',                price:1.00, image:imgCoca       },
];

const productById = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
function getProductById(id){ return productById[id]; }

/* ============= GRID DE PRODUCTOS ============= */
const $grid = document.getElementById('productsGrid');

function productCard(p) {
  const q = Math.max(0, Number(cart[p.id]) || 0);
  const $card = document.createElement('article');
  $card.className = 'product-card';
  $card.innerHTML = `
    <div class="product-media">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
    </div>
    <div class="product-body">
      <h3 class="product-title">${p.title}</h3>
      <p class="product-desc">${p.description}</p>
    </div>
    <div class="product-footer">
      <span class="price">${money.format(p.price)}</span>
      <div class="product-actions">
        <div class="qty" data-id="${p.id}">
          <button type="button" data-action="dec" aria-label="Disminuir cantidad"${q === 0 ? ' disabled' : ''}>−</button>
          <button type="button" data-action="inc" aria-label="Aumentar cantidad">+</button>
          <input type="number" min="0" max="99" value="${q}" aria-label="Cantidad">
        </div>
      </div>
    </div>
  `;
  return $card;
}

function renderProducts() {
  if (!$grid) return;
  $grid.innerHTML = '';
  PRODUCTS.forEach(p => $grid.appendChild(productCard(p)));
}

/* Delegación en GRID: + / − / input */
$grid?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const qtyWrapper = btn.closest('.qty');
  const id = qtyWrapper?.dataset.id;
  if (!action || !id || !qtyWrapper) return;

  const input = qtyWrapper.querySelector('input');
  if (!input) return;

  if (action === 'inc') input.value = String(Math.min(99, (Number(input.value) || 0) + 1));
  if (action === 'dec') input.value = String(Math.max(0, (Number(input.value) || 0) - 1));

  applyCartChange(id, input.value);
});

$grid?.addEventListener('input', (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'number') return;
  const qtyWrapper = input.closest('.qty');
  const id = qtyWrapper?.dataset.id;
  if (!id) return;
  applyCartChange(id, input.value);
});

/* ============= DRAWER DEL CARRITO ============= */
const $drawer    = document.getElementById('cartDrawer');
const $backdrop  = document.getElementById('cartBackdrop');
const $openBtn   = document.getElementById('cartOpenBtn');
const $closeBtn  = document.getElementById('cartCloseBtn');
const $items     = document.getElementById('cartItems');
const $total     = document.getElementById('cartTotal');
const $clearBtn  = document.getElementById('cartClear');
const $checkout  = document.getElementById('cartCheckout');

$openBtn?.addEventListener('click', () => openCart());
$closeBtn?.addEventListener('click', () => closeCart());
$backdrop?.addEventListener('click', () => closeCart());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

function openCart() {
  if (cartCount() === 0) return; // no abrir si está vacío
  renderCart();
  $drawer?.classList.add('open');
}
function closeCart() {
  $drawer?.classList.remove('open');
}

/* Render del panel */
function renderCart() {
  if (!$items || !$total) return;

  sanitizeCart();
  const ids = Object.keys(cart).filter(id => (Number(cart[id]) || 0) > 0);

  if (ids.length === 0) {
    $items.innerHTML = `<p style="opacity:.75; padding:12px;">Tu carrito está vacío.</p>`;
    $total.textContent = money.format(0);
    closeCart();               // si quedó abierto y lo vaciaste, se cierra
    return;
  }

  const rows = ids.map(id => {
    const p = getProductById(id);
    if (!p) return '';
    const q = Number(cart[id]) || 0;
    const subtotal = p.price * q;

    return `
      <div class="cart-item" data-id="${id}">
        <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
        <div class="meta">
          <h4>${p.title}</h4>
          <div class="unit">${money.format(p.price)} c/u</div>
        </div>
        <div class="actions">
          <div class="subtotal">${money.format(subtotal)}</div>
          <div class="qty" data-id="${id}">
            <button type="button" data-action="dec"${q === 0 ? ' disabled' : ''}>−</button>
            <button type="button" data-action="inc">+</button>
            <input type="number" min="0" max="99" value="${q}" aria-label="Cantidad">
          </div>
        </div>
      </div>
    `;
  }).join('');

  $items.innerHTML = rows;
  $total.textContent = money.format(cartTotal());
}

/* Totales */
function cartTotal() {
  return Object.entries(cart).reduce((acc, [id, q]) => {
    const p = getProductById(id);
    return acc + (p ? p.price * (Number(q) || 0) : 0);
  }, 0);
}

/* Delegación dentro del panel: + / − / input */
$items?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const qtyWrapper = btn.closest('.qty');
  const id = qtyWrapper?.dataset.id;
  if (!action || !id) return;

  const input = qtyWrapper.querySelector('input');
  if (!input) return;

  if (action === 'inc') input.value = String(Math.min(99, (Number(input.value) || 0) + 1));
  if (action === 'dec') input.value = String(Math.max(0, (Number(input.value) || 0) - 1));

  applyCartChange(id, input.value);
});

$items?.addEventListener('input', (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'number') return;

  const qtyWrapper = input.closest('.qty');
  const id = qtyWrapper?.dataset.id;
  if (!id) return;

  applyCartChange(id, input.value);
});

/* Vaciar y pagar */
$clearBtn?.addEventListener('click', () => {
  for (const id of Object.keys(cart)) delete cart[id];
  saveCart();
  updateCartBadge();
  refreshCartOpenBtn();
  renderCart();
  renderProducts();
});

$checkout?.addEventListener('click', () => {
  alert(`Total a pagar: ${money.format(cartTotal())}`);
  // Aquí podrías redirigir a una página de pago / QR / etc.
});

/* Utilidad */
function clampInt(v, min, max) {
  const n = Math.floor(Number(v) || 0);
  return Math.max(min, Math.min(max, n));
}
