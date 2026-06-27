// ════════════════════════════════════════════════════════════════════════════
//  TIM · Plano interactivo de la terminal
//  Cada sector del plano (SVG) es clickeable y navegable por teclado; al
//  seleccionarlo se resalta y muestra su información en el panel lateral.
//  Nexo Studio · UADE Desarrollo Web 2026
// ════════════════════════════════════════════════════════════════════════════

const ZONAS = {
  plataformas:    { nombre: 'Plataformas / Andenes', emoji: '🚌', horario: '24 h',     desc: 'Sectores A, B y C de embarque. Tu plataforma se confirma en los monitores 15 a 20 minutos antes de la salida.' },
  accesos:        { nombre: 'Accesos',               emoji: '🚪', horario: '24 h',     desc: 'Entrada principal por Av. Videla, con rampa y acceso adaptado. La parada de taxis está sobre el ingreso.' },
  hall:           { nombre: 'Hall central',          emoji: '🏛️', horario: '24 h',     desc: 'Punto de encuentro y circulación, con pantallas de salidas y cartelería accesible de alto contraste.' },
  espera:         { nombre: 'Salas de espera',       emoji: '🛋️', horario: '24 h',     desc: 'Sectores con asientos, carga de dispositivos y monitores de salidas, en planta alta y baja.' },
  boleterias:     { nombre: 'Boleterías',            emoji: '🎫', horario: '24 h',     desc: 'Venta de pasajes de todas las empresas, encomiendas y cargas generales.' },
  banos:          { nombre: 'Baños',                 emoji: '🚻', horario: '24 h',     desc: 'Hombres, mujeres, accesible y familiar, con duchas individuales, lactario y cambiador de bebés.' },
  gastronomia:    { nombre: 'Gastronomía y locales', emoji: '🍽️', horario: '7 a 23 h', desc: 'Más de 160 locales: cafés, restaurantes, kioscos y feria artesanal con productos regionales.' },
  guardaequipaje: { nombre: 'Guardaequipaje',        emoji: '🧳', horario: '24 h',     desc: 'Depósito seguro de valijas y bolsos, por hora o por día, junto a las boleterías.' },
  cajeros:        { nombre: 'Cajeros y Wi-Fi',       emoji: '🏧', horario: '24 h',     desc: 'Cajeros automáticos de distintas redes y zona de Wi-Fi gratuito (red TIM-Libre).' },
  informes:       { nombre: 'Turismo e informes',    emoji: 'ℹ️', horario: '7 a 22 h', desc: 'Información de la terminal y de la ciudad; ahí coordinás la asistencia de embarque sin cargo.' },
  estacionamiento:{ nombre: 'Estacionamiento',       emoji: '🅿️', horario: '24 h',     desc: 'Playa de más de 8.000 m², con acceso por calle Alberdi.' },
};

function seleccionarZona(id) {
  const zona = ZONAS[id];
  if (!zona) return;

  // Resaltar la zona elegida
  document.querySelectorAll('.zona').forEach(z => z.classList.remove('zona-activa'));
  const g = document.querySelector('.zona[data-id="' + id + '"]');
  if (g) g.classList.add('zona-activa');

  // Mostrar su info en el panel lateral
  document.getElementById('plano-info').innerHTML = `
    <div class="text-[40px] mb-2" aria-hidden="true">${zona.emoji}</div>
    <h3 class="text-[22px] font-bold tracking-tight mb-2">${zona.nombre}</h3>
    <p class="text-[14px] text-tim-muted leading-relaxed mb-5">${zona.desc}</p>
    <span class="inline-flex items-center gap-2 text-[13px] font-semibold bg-tim-light text-tim px-3 py-1.5 rounded-full">Horario · ${zona.horario}</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.zona').forEach(z => {
    const id = z.dataset.id;
    z.addEventListener('click', () => seleccionarZona(id));
    // Operable por teclado (Enter o barra espaciadora)
    z.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        seleccionarZona(id);
      }
    });
  });
  // Mostrar las plataformas por defecto
  seleccionarZona('plataformas');
});
