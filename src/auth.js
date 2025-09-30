// src/auth.js
const googleContainer = document.getElementById('g_id_onload');
googleContainer.dataset.client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 1) GIS llamará a esta función tras el login
window.handleCredentialResponse = async ({ credential }) => {
  console.log('ID-token recibido', credential.slice(0, 20) + '…');

  // TEMP: guarda token en sessionStorage para ver que funciona
  // (luego lo enviaremos al backend y usaremos cookies)
  sessionStorage.setItem('google_id_token', credential);

  // Redirige a la tienda
  window.location.href = '/';
};

// 2) Si ya hay sesión (cookie o Storage), salta el login
(async () => {
  const token = sessionStorage.getItem('google_id_token');
  if (token) {
    //   ↓ Más adelante comprobaremos /api/me; por ahora basta
    window.location.href = '/';
  }
})();
