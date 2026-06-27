// ════════════════════════════════════════════════════════════════════════════
//  TIM · JS de la home — slideshow del hero
//  La accesibilidad, los menús del navbar y los enlaces externos los maneja
//  js/terminal-comun.js. La consulta, el chatbot y el plano tienen su propio JS.
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
