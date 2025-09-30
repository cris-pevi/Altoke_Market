(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const f="/assets/rellenitas_fresa-DiKOTmb-.jpg",p="/assets/logo-DeSJ53og.png";sessionStorage.getItem("google_id_token")||(window.location.href="/login.html");document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("contactForm");t&&t.addEventListener("submit",e=>{e.preventDefault(),alert("Formulario enviado con éxito 🚀")})});const d="cart_v1",s=g();function g(){try{return JSON.parse(localStorage.getItem(d))||{}}catch{return{}}}function v(){localStorage.setItem(d,JSON.stringify(s))}function y(){return Object.values(s).reduce((t,e)=>t+e,0)}function l(){const t=document.getElementById("cartCount");t&&(t.textContent=String(y()))}const b=new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}),h={id:"gal-rellenitas-fresa",title:"Galletas Rellenitas Fresa",description:"Galletas Rellenitas Fresa. 50 g.",price:.3,image:f},c=document.getElementById("products");function E(t){const e=Math.max(1,Number(s[t.id])||1),o=document.createElement("article");return o.className="product-card",o.innerHTML=`
    <div class="product-media">
      <img src="${t.image}" alt="${t.title}" loading="lazy">
    </div>
    <div class="product-body">
      <h3 class="product-title">${t.title}</h3>
      <p class="product-desc">${t.description}</p>
    </div>
    <div class="product-footer">
      <span class="price">${b.format(t.price)}</span>
      <div class="product-actions">
        <div class="qty" data-id="${t.id}">
          <button type="button" data-action="dec" aria-label="Disminuir cantidad">−</button>
          <input type="number" min="1" max="99" value="${e}" aria-label="Cantidad">
          <button type="button" data-action="inc" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="add-btn" data-action="set" data-id="${t.id}">Actualizar</button>
      </div>
    </div>
  `,o}c&&(c.appendChild(E(h)),l());document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("logoImg");t&&(t.src=p)});c?.addEventListener("click",t=>{const e=t.target.closest("button");if(!e)return;const o=e.dataset.action,a=e.closest(".qty")||e.closest(".product-actions")?.querySelector(".qty"),r=e.dataset.id||a?.dataset.id;if(!o||!r||!a)return;const n=a.querySelector("input");if(o==="inc"&&n&&(n.value=String(Math.min(99,(Number(n.value)||1)+1))),o==="dec"&&n&&(n.value=String(Math.max(1,(Number(n.value)||1)-1))),o==="set"&&n){const i=u(n.value,1,99);n.value=String(i),s[r]=i,v(),l();const m=e.textContent;e.textContent="Actualizado ✓",setTimeout(()=>e.textContent=m||"Actualizar",900)}});c?.addEventListener("input",t=>{const e=t.target;e instanceof HTMLInputElement&&e.type==="number"&&(e.value=String(u(e.value,1,99)))});function u(t,e,o){const a=Math.floor(Number(t)||0);return Math.max(e,Math.min(o,a))}
