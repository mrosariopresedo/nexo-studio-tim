// ── Accesibilidad ─────────────────────────────────────────────────────────
const accBtn      = document.getElementById('acc-btn');
const accPanel    = document.getElementById('acc-panel');
const btnContrast = document.getElementById('toggle-contrast');
const btnFont     = document.getElementById('toggle-fontsize');

// Abrir / cerrar panel
accBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  const open = !accPanel.classList.contains('hidden');
  accPanel.classList.toggle('hidden', open);
  accBtn.setAttribute('aria-expanded', String(!open));
});

// Cerrar al hacer click fuera
document.addEventListener('click', function(e) {
  if (!accPanel.contains(e.target) && e.target !== accBtn) {
    accPanel.classList.add('hidden');
    accBtn.setAttribute('aria-expanded', 'false');
  }
});

function setToggle(btn, active) {
  btn.setAttribute('aria-checked', String(active));
}

// Alto contraste
btnContrast.addEventListener('click', function() {
  const active = document.body.classList.toggle('high-contrast');
  setToggle(btnContrast, active);
  localStorage.setItem('tim-contrast', active);
});

// Texto grande
btnFont.addEventListener('click', function() {
  const active = document.body.classList.toggle('large-text');
  setToggle(btnFont, active);
  localStorage.setItem('tim-fontsize', active);
});

// Restaurar preferencias guardadas
if (localStorage.getItem('tim-contrast') === 'true') {
  document.body.classList.add('high-contrast');
  setToggle(btnContrast, true);
}
if (localStorage.getItem('tim-fontsize') === 'true') {
  document.body.classList.add('large-text');
  setToggle(btnFont, true);
}

// ── Slideshow del hero ────────────────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
let current = 0;

setInterval(function() {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 6000);

// ── Buscador ──────────────────────────────────────────────────────────────
document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const servicio = document.getElementById('q-servicio').value;
  const destinos = {
    'Larga Distancia': 'https://mrosariopresedo.github.io/tim-larga-distancia/',
    'Alta Montaña':    'https://luligavilanes.github.io/altamonta-a/',
    'Ruta del Vino':   'https://valmartins222.github.io/Ruta-del-vino/',
    'Aeropuerto':      'https://moraraimondo-cyber.github.io/Metrotranvia/',
    'Universitario':   'https://martinasama2005.github.io/ciudaduniversitaria/',
  };
  if (destinos[servicio]) {
    window.location.href = destinos[servicio];
  } else {
    document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
  }
});
