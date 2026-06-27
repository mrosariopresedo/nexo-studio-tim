// ════════════════════════════════════════════════════════════════════════════
//  TIM · JS de la home — slideshow del hero y buscador
//  La accesibilidad, los menús del navbar y los enlaces externos los maneja
//  js/terminal-comun.js (cargado en todas las páginas).
//  Nexo Studio · UADE Desarrollo Web 2026
// ════════════════════════════════════════════════════════════════════════════

// ── Slideshow del hero (fotos de Mendoza de fondo) ─────────────────────────
const slides = document.querySelectorAll('.hero-slide');
let current = 0;
if (slides.length > 1) {
  setInterval(function () {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
}

// ── Buscador del hero → lleva a la Consulta de viajes con el destino ────────
const formBuscar = document.getElementById('search-form');
if (formBuscar) {
  formBuscar.addEventListener('submit', function (e) {
    e.preventDefault();
    const destino = document.getElementById('q-destino').value.trim();
    const fecha   = document.getElementById('q-fecha').value;
    const params  = new URLSearchParams();
    if (destino) params.set('destino', destino);
    if (fecha)   params.set('fecha', fecha);
    const qs = params.toString();
    window.location.href = 'consulta-viajes.html' + (qs ? '?' + qs : '');
  });
}
