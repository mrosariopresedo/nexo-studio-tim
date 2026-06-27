// ════════════════════════════════════════════════════════════════════════════
//  TIM · JS común de las páginas de la terminal (consulta, servicios, plano)
//  Maneja el panel de accesibilidad y abre los enlaces externos en pestaña nueva.
//  Nexo Studio · UADE Desarrollo Web 2026
// ════════════════════════════════════════════════════════════════════════════

// ─── Panel de accesibilidad ────────────────────────────────────────────────
const accBtn      = document.getElementById('acc-btn');
const accPanel    = document.getElementById('acc-panel');
const btnContrast = document.getElementById('toggle-contrast');
const btnFont     = document.getElementById('toggle-fontsize');

if (accBtn && accPanel) {
  // Abrir / cerrar el panel
  accBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const abierto = !accPanel.classList.contains('hidden');
    accPanel.classList.toggle('hidden', abierto);
    accBtn.setAttribute('aria-expanded', String(!abierto));
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', function (e) {
    if (!accPanel.contains(e.target) && e.target !== accBtn) {
      accPanel.classList.add('hidden');
      accBtn.setAttribute('aria-expanded', 'false');
    }
  });

  function marcarToggle(btn, activo) {
    btn.setAttribute('aria-checked', String(activo));
  }

  // Alto contraste y texto grande, recordados en el navegador
  btnContrast.addEventListener('click', function () {
    const activo = document.body.classList.toggle('high-contrast');
    marcarToggle(btnContrast, activo);
    localStorage.setItem('tim-contrast', activo);
  });
  btnFont.addEventListener('click', function () {
    const activo = document.body.classList.toggle('large-text');
    marcarToggle(btnFont, activo);
    localStorage.setItem('tim-fontsize', activo);
  });

  // Restaurar preferencias guardadas
  if (localStorage.getItem('tim-contrast') === 'true') {
    document.body.classList.add('high-contrast');
    marcarToggle(btnContrast, true);
  }
  if (localStorage.getItem('tim-fontsize') === 'true') {
    document.body.classList.add('large-text');
    marcarToggle(btnFont, true);
  }
}

// ─── Menús desplegables del navbar (Líneas · La terminal) ──────────────────
function cerrarDesplegables() {
  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
  document.querySelectorAll('[data-dropdown]').forEach(b => b.setAttribute('aria-expanded', 'false'));
}

document.querySelectorAll('[data-dropdown]').forEach(function (boton) {
  const menu = document.getElementById(boton.getAttribute('data-dropdown'));
  boton.addEventListener('click', function (e) {
    e.stopPropagation();
    const abierto = !menu.classList.contains('hidden');
    cerrarDesplegables();           // cerrar cualquier otro menú abierto
    if (!abierto) {
      menu.classList.remove('hidden');
      boton.setAttribute('aria-expanded', 'true');
    }
  });
});

// Al elegir una opción del menú, cerrarlo
document.querySelectorAll('.dropdown-menu a').forEach(function (a) {
  a.addEventListener('click', cerrarDesplegables);
});

// Cerrar los desplegables al hacer click fuera o con la tecla Escape
document.addEventListener('click', function (e) {
  if (!e.target.closest('.nav-dd')) cerrarDesplegables();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') cerrarDesplegables();
});

// ─── Abrir los enlaces a otros sitios en una pestaña nueva ──────────────────
document.querySelectorAll('a[href^="http"]').forEach(function (a) {
  a.target = '_blank';
  a.rel    = 'noopener noreferrer';
});
