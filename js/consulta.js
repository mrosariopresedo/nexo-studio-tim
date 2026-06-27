// ════════════════════════════════════════════════════════════════════════════
//  TIM · Consulta de viajes — datos simulados y lógica del consultor
//  Devuelve transporte recomendado, plataforma/andén, tiempo y costo según el
//  destino elegido. Los datos son simulados pero representan un servicio realista.
//  Cada línea conserva su color identificatorio (segundo color por servicio).
//  Nexo Studio · UADE Desarrollo Web 2026
// ════════════════════════════════════════════════════════════════════════════

// color: color identificatorio de la línea · sitio: página individual del servicio
const DESTINOS = [
  // ─── Larga Distancia (terracota) ─────────────────────────────────────────
  { destino: 'Buenos Aires',            linea: 'Larga Distancia', color: '#C2410C', sitio: 'https://mrosariopresedo.github.io/tim-larga-distancia/', servicio: 'Andesmar · Cama Suite',     anden: 'A04', duracion: '13 h 30 m', costo: '$32.400', proxima: '18:30 hs' },
  { destino: 'Córdoba',                 linea: 'Larga Distancia', color: '#C2410C', sitio: 'https://mrosariopresedo.github.io/tim-larga-distancia/', servicio: 'Flecha Bus · Cama',         anden: 'A11', duracion: '8 h 30 m',  costo: '$18.200', proxima: '13:00 hs' },
  { destino: 'Bariloche',               linea: 'Larga Distancia', color: '#C2410C', sitio: 'https://mrosariopresedo.github.io/tim-larga-distancia/', servicio: 'Vía Bariloche · Cama Suite', anden: 'A09', duracion: '17 h 30 m', costo: '$38.200', proxima: '16:30 hs' },
  { destino: 'Santiago de Chile',       linea: 'Larga Distancia', color: '#C2410C', sitio: 'https://mrosariopresedo.github.io/tim-larga-distancia/', servicio: 'Cata Internacional',        anden: 'B02', duracion: '7 h 30 m',  costo: '$35.400', proxima: '09:00 hs' },

  // ─── Alta Montaña (gris pizarra) ─────────────────────────────────────────
  { destino: 'Uspallata',               linea: 'Alta Montaña',    color: '#475569', sitio: 'https://luligavilanes.github.io/altamonta-a/',          servicio: 'Buttini · Semi-Cama',      anden: 'C02', duracion: '1 h 50 m',  costo: '$6.500',  proxima: '07:00 hs' },
  { destino: 'Las Leñas',               linea: 'Alta Montaña',    color: '#475569', sitio: 'https://luligavilanes.github.io/altamonta-a/',          servicio: 'Andesmar · Especial',      anden: 'C05', duracion: '5 h 00 m',  costo: '$14.800', proxima: '06:30 hs' },
  { destino: 'Puente del Inca',         linea: 'Alta Montaña',    color: '#475569', sitio: 'https://luligavilanes.github.io/altamonta-a/',          servicio: 'Iselin · Común',           anden: 'C03', duracion: '3 h 30 m',  costo: '$9.200',  proxima: '10:15 hs' },

  // ─── Ruta del Vino (violeta) ─────────────────────────────────────────────
  { destino: 'Bodegas de Maipú',        linea: 'Ruta del Vino',   color: '#7E22CE', sitio: 'https://valmartins222.github.io/Ruta-del-vino/',        servicio: 'Bus del Vino',             anden: 'D01', duracion: '0 h 40 m',  costo: '$3.800',  proxima: 'cada 30 min' },
  { destino: 'Luján de Cuyo',           linea: 'Ruta del Vino',   color: '#7E22CE', sitio: 'https://valmartins222.github.io/Ruta-del-vino/',        servicio: 'Bus del Vino',             anden: 'D01', duracion: '0 h 50 m',  costo: '$4.200',  proxima: '08:45 hs' },
  { destino: 'Valle de Uco',            linea: 'Ruta del Vino',   color: '#7E22CE', sitio: 'https://valmartins222.github.io/Ruta-del-vino/',        servicio: 'Bus del Vino',             anden: 'D02', duracion: '1 h 30 m',  costo: '$5.500',  proxima: '09:30 hs' },

  // ─── Aeropuerto / Metrotranvía (azul) ────────────────────────────────────
  { destino: 'Aeropuerto El Plumerillo', linea: 'Aeropuerto',     color: '#1D4ED8', sitio: 'https://moraraimondo-cyber.github.io/Metrotranvia/',     servicio: 'Aerobús TIM',              anden: 'E01', duracion: '0 h 35 m',  costo: '$2.900',  proxima: 'cada 20 min' },
  { destino: 'Centro (Metrotranvía)',   linea: 'Aeropuerto',      color: '#1D4ED8', sitio: 'https://moraraimondo-cyber.github.io/Metrotranvia/',     servicio: 'Metrotranvía · Línea Urbana', anden: 'E03', duracion: '0 h 25 m', costo: '$1.200',  proxima: 'cada 12 min' },

  // ─── Universitario (verde) ───────────────────────────────────────────────
  { destino: 'UNCuyo · Centro Universitario', linea: 'Universitario', color: '#15803D', sitio: 'https://martinasama2005.github.io/ciudaduniversitaria/', servicio: 'Línea U1', anden: 'F01', duracion: '0 h 30 m', costo: '$1.000', proxima: 'cada 15 min' },
  { destino: 'UTN · Regional Mendoza',  linea: 'Universitario',   color: '#15803D', sitio: 'https://martinasama2005.github.io/ciudaduniversitaria/', servicio: 'Línea U2',                anden: 'F02', duracion: '0 h 40 m',  costo: '$1.000',  proxima: 'cada 20 min' },
];

// ─── Poblar el desplegable de destinos (agrupado por línea) ────────────────
function cargarDestinos() {
  const select = document.getElementById('cv-destino');
  const lineas = [...new Set(DESTINOS.map(d => d.linea))];
  lineas.forEach(linea => {
    const grupo = document.createElement('optgroup');
    grupo.label = linea;
    DESTINOS.filter(d => d.linea === linea).forEach(d => {
      const opcion = document.createElement('option');
      opcion.value = d.destino;
      opcion.textContent = d.destino;
      grupo.appendChild(opcion);
    });
    select.appendChild(grupo);
  });
}

// ─── Mostrar el resultado de la consulta ───────────────────────────────────
function consultarViaje(evento) {
  evento.preventDefault();
  const destinoElegido = document.getElementById('cv-destino').value;
  const fecha          = document.getElementById('cv-fecha').value;
  const dato           = DESTINOS.find(d => d.destino === destinoElegido);
  const cont           = document.getElementById('cv-resultado');
  if (!dato) return;

  const fechaTexto = fecha
    ? new Date(fecha + 'T00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'la fecha seleccionada';

  cont.innerHTML = `
    <article class="card overflow-hidden" style="border-top:5px solid ${dato.color}">
      <div class="p-6 sm:p-8">
        <div class="flex items-center gap-3 mb-5 flex-wrap">
          <span class="text-white text-[12px] font-bold px-3 py-1 rounded-full" style="background:${dato.color}">${dato.linea}</span>
          <span class="text-[13px] text-tim-muted">Transporte recomendado para <strong class="text-tim-text">${fechaTexto}</strong></span>
        </div>

        <h3 class="text-[26px] sm:text-[30px] font-bold tracking-tight mb-1">TIM → ${dato.destino}</h3>
        <p class="text-[15px] text-tim-muted mb-6">${dato.servicio}</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          <div class="bg-tim-bgalt border border-tim-border rounded-lg p-4">
            <div class="text-[11px] uppercase tracking-[.08em] font-bold text-tim-subtle mb-1">Plataforma / Andén</div>
            <div class="text-[22px] font-bold" style="color:${dato.color}">${dato.anden}</div>
          </div>
          <div class="bg-tim-bgalt border border-tim-border rounded-lg p-4">
            <div class="text-[11px] uppercase tracking-[.08em] font-bold text-tim-subtle mb-1">Tiempo estimado</div>
            <div class="text-[22px] font-bold text-tim-text">${dato.duracion}</div>
          </div>
          <div class="bg-tim-bgalt border border-tim-border rounded-lg p-4">
            <div class="text-[11px] uppercase tracking-[.08em] font-bold text-tim-subtle mb-1">Costo desde</div>
            <div class="text-[22px] font-bold text-tim-text">${dato.costo}</div>
          </div>
          <div class="bg-tim-bgalt border border-tim-border rounded-lg p-4">
            <div class="text-[11px] uppercase tracking-[.08em] font-bold text-tim-subtle mb-1">Próxima salida</div>
            <div class="text-[22px] font-bold text-tim-text">${dato.proxima}</div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 flex-wrap pt-5 border-t border-tim-border">
          <p class="text-[12px] text-tim-subtle max-w-[420px]">Las plataformas se confirman en los monitores 15 a 20 minutos antes de la salida. Datos de referencia, sujetos a disponibilidad de la empresa operadora.</p>
          <a href="${dato.sitio}" class="btn-primary text-sm gap-2">Ver horarios completos
            <svg class="w-4 h-4"><use href="#i-arrow"/></svg>
          </a>
        </div>
      </div>
    </article>`;

  cont.classList.remove('hidden');
  cont.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Chips de acceso rápido (destinos más buscados) ────────────────────────
function consultaRapida(destino) {
  document.getElementById('cv-destino').value = destino;
  document.getElementById('cv-form').requestSubmit();
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDestinos();
  document.getElementById('cv-form').addEventListener('submit', consultarViaje);
  document.querySelectorAll('.cv-chip').forEach(chip => {
    chip.addEventListener('click', () => consultaRapida(chip.dataset.destino));
  });
});
