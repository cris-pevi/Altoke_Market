import './style.css';
import rellenasImg from './assets/rellenitas_fresa.jpg';
import logoSrc from './assets/logo.png';

/* ============= FORMULARIO DE CONTACTO ============= */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Formulario enviado con éxito 🚀');
    });
  }
});

/* ============= ESTADO DEL CARRITO ============= */
const CART_KEY = 'cart_v1';
const cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
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

/* ============= FORMATEADOR DE MONEDA ============= */
const money = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

/* ============= PRODUCTO DE EJEMPLO ============= */
const product = {
  id: 'gal-rellenitas-fresa',
  title: 'Galletas Rellenitas Fresa',
  description: 'Galletas Rellenitas Fresa. 50 g.',
  price: 0.30,
  image: rellenasImg,
};

/* ============= RENDER DE LA CARD ============= */
const $grid = document.getElementById('products');

function productCard(p) {
  const q = Math.max(1, Number(cart[p.id]) || 1); // cantidad inicial mínima 1
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
          <button type="button" data-action="dec" aria-label="Disminuir cantidad">−</button>
          <input type="number" min="1" max="99" value="${q}" aria-label="Cantidad">
          <button type="button" data-action="inc" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="add-btn" data-action="set" data-id="${p.id}">Actualizar</button>
      </div>
    </div>
  `;
  return $card;
}

if ($grid) {
  $grid.appendChild(productCard(product));
  updateCartBadge();
}

/* Logo */
document.addEventListener('DOMContentLoaded', () => {
  // ... tu código de formulario ...

  const logoEl = document.getElementById('logoImg');
  if (logoEl) logoEl.src = logoSrc;  // <--- AQUÍ se coloca el logo procesado por Vite
});

/* ============= EVENTOS DE LOS CONTROLES ============= */
$grid?.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  // Para inc/dec el id está en el contenedor .qty; para set está en el propio botón
  const qtyWrapper =
    btn.closest('.qty') ||
    btn.closest('.product-actions')?.querySelector('.qty');

  const id =
    btn.dataset.id ||
    qtyWrapper?.dataset.id;

  if (!action || !id || !qtyWrapper) return;

  const input = qtyWrapper.querySelector('input');

  if (action === 'inc' && input) {
    input.value = String(Math.min(99, (Number(input.value) || 1) + 1));
  }
  if (action === 'dec' && input) {
    input.value = String(Math.max(1, (Number(input.value) || 1) - 1));
  }
  if (action === 'set' && input) {
    // REEMPLAZA la cantidad (no suma)
    const q = clampInt(input.value, 1, 99);
    input.value = String(q);       // normaliza visualmente
    cart[id] = q;
    saveCart();
    updateCartBadge();

    // Feedback visual
    const prev = btn.textContent;
    btn.textContent = 'Actualizado ✓';
    setTimeout(() => (btn.textContent = prev || 'Actualizar'), 900);
  }
});

// Validación manual al tipear en el input
$grid?.addEventListener('input', (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.type !== 'number') return;
  input.value = String(clampInt(input.value, 1, 99));
});

/* ============= UTILIDADES ============= */
function clampInt(v, min, max) {
  const n = Math.floor(Number(v) || 0);
  return Math.max(min, Math.min(max, n));
}
