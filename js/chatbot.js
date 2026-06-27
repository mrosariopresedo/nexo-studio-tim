// ════════════════════════════════════════════════════════════════════════════
//  TIM · Mini chatbot de ayuda de la terminal (basado en reglas, sin IA externa)
//  Detecta palabras clave en lo que escribe la persona y responde con respuestas
//  pre-escritas sobre los servicios de la terminal. Funciona 100% offline.
//  Nexo Studio · UADE Desarrollo Web 2026
// ════════════════════════════════════════════════════════════════════════════

// Quita acentos y pasa a minúsculas para que el matcheo sea tolerante.
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Cada intención: palabras clave (ya sin acentos) → respuesta.
const INTENCIONES = [
  { claves: ['hola', 'buenas', 'buen dia', 'buenos dias', 'que tal', 'hey'],
    texto: '¡Hola! 👋 Soy el asistente de TIM. Puedo orientarte sobre plataformas, baños, equipaje, gastronomía, cajeros, Wi-Fi, accesibilidad, cómo llegar y pasajes. ¿Qué necesitás?' },
  { claves: ['plataforma', 'anden', 'donde sale', 'que anden', 'que plataforma'],
    texto: 'Tu plataforma se confirma en los <strong>monitores</strong> de la terminal entre <strong>15 y 20 minutos antes</strong> de la salida. Si querés saberla por anticipado, usá la <a href="#consulta" class="underline font-semibold">Consulta de viajes</a>.' },
  { claves: ['baño', 'bano', 'sanitario', 'ducha', 'lactario', 'cambiador', 'amamantar'],
    texto: 'Los baños están en el <strong>sector central (ala Este)</strong>, abiertos las 24 h: hombres, mujeres, <strong>accesible</strong> y <strong>familiar</strong>, con duchas individuales, lactario y cambiador de bebés.' },
  { claves: ['equipaje', 'valija', 'bolso', 'guardar', 'consigna', 'mochila'],
    texto: 'El <strong>guardaequipaje</strong> está junto a las boleterías (ala Oeste) y funciona las 24 h. Podés dejar valijas y bolsos por hora o por día.' },
  { claves: ['comer', 'comida', 'cafe', 'restaurante', 'kiosco', 'gastronom', 'hambre', 'bar'],
    texto: 'Hay más de <strong>160 locales</strong>: cafés, restaurantes, kioscos y una feria artesanal, sobre todo en el <strong>hall central</strong>. La mayoría abre de 7 a 23 h.' },
  { claves: ['cajero', 'banco', 'plata', 'efectivo', 'atm', 'dinero'],
    texto: 'Tenés <strong>cajeros automáticos</strong> en el hall central, cerca de la oficina de informes, disponibles las 24 h.' },
  { claves: ['wifi', 'wi-fi', 'internet', 'red', 'conexion'],
    texto: 'El <strong>Wi-Fi es gratuito</strong> en toda la terminal. Conectate a la red <strong>TIM-Libre</strong>, sin contraseña.' },
  { claves: ['accesib', 'silla de ruedas', 'rampa', 'discapac', 'movilidad', 'braille'],
    texto: 'La terminal tiene <strong>accesos adaptados</strong>: rampas, ascensores, baño accesible y señalización en Braille. Podés pedir <strong>asistencia de embarque</strong> sin cargo en la oficina de informes.' },
  { claves: ['llegar', 'como llego', 'ubicacion', 'direccion', 'donde queda', 'donde esta', 'mapa', 'colectivo'],
    texto: 'Estamos en <strong>Av. Acceso Este y Av. Videla, Guaymallén</strong>. Llegás en Metrotranvía y colectivos 110, 200 y 800. <a href="https://www.google.com/maps/search/?api=1&query=Terminal+de+Omnibus+de+Mendoza" target="_blank" rel="noopener" class="underline font-semibold">Ver en Google Maps</a>.' },
  { claves: ['horario', 'abierto', 'abre', 'cierra', 'que hora', 'a que hora'],
    texto: 'La terminal está <strong>abierta las 24 horas, los 365 días</strong>. Los locales comerciales suelen abrir de 7 a 23 h.' },
  { claves: ['estacionar', 'auto', 'cochera', 'parking', 'estacionamiento', 'playa'],
    texto: 'Hay <strong>estacionamiento</strong> de más de 8.000 m², con acceso por calle Alberdi. Funciona las 24 h.' },
  { claves: ['taxi', 'remis', 'uber'],
    texto: 'La <strong>parada de taxis</strong> está en el acceso principal, sobre Av. Videla, con servicio las 24 h.' },
  { claves: ['pasaje', 'boleto', 'comprar', 'boleteria', 'ticket', 'sacar'],
    texto: 'Comprás pasajes en las <strong>boleterías</strong> de cada empresa (ala Oeste). Para ver qué transporte tomar, plataforma y precio, usá la <a href="#consulta" class="underline font-semibold">Consulta de viajes</a>.' },
  { claves: ['informacion', 'informes', 'turismo', 'ayuda', 'consulta', 'pregunta'],
    texto: 'La <strong>oficina de turismo e informes</strong> está en el hall central, abierta de 7 a 22 h. Ahí también coordinás asistencia para personas con movilidad reducida.' },
  { claves: ['gracias', 'chau', 'adios', 'genial', 'perfecto', 'listo'],
    texto: '¡De nada! Buen viaje 🚌 Si necesitás algo más, preguntame.' },
];

function obtenerRespuesta(texto) {
  const t = normalizar(texto);
  const intencion = INTENCIONES.find(i => i.claves.some(c => t.includes(c)));
  return intencion
    ? intencion.texto
    : 'No estoy seguro de eso 🤔. Probá preguntarme por: <strong>plataformas, baños, equipaje, gastronomía, cajeros, Wi-Fi, accesibilidad, cómo llegar, horarios o pasajes</strong>.';
}

// ─── Pintar un mensaje en el chat ──────────────────────────────────────────
function agregarMensaje(html, deQuien) {
  const cont = document.getElementById('chat-mensajes');
  const fila = document.createElement('div');
  fila.className = deQuien === 'bot'
    ? 'flex justify-start'
    : 'flex justify-end';
  fila.innerHTML = `
    <div class="${deQuien === 'bot'
      ? 'bg-tim-light text-tim-text rounded-2xl rounded-tl-sm'
      : 'bg-tim text-white rounded-2xl rounded-tr-sm'} max-w-[80%] px-4 py-2.5 text-sm leading-relaxed">${html}</div>`;
  cont.appendChild(fila);
  cont.scrollTop = cont.scrollHeight;
}

function responderUsuario(texto) {
  agregarMensaje(texto.replace(/</g, '&lt;'), 'usuario');
  // Pequeña demora para que se sienta una conversación
  setTimeout(() => agregarMensaje(obtenerRespuesta(texto), 'bot'), 350);
}

document.addEventListener('DOMContentLoaded', () => {
  // Mensaje de bienvenida
  agregarMensaje('¡Hola! 👋 Soy el asistente de TIM. Preguntame por plataformas, baños, equipaje, gastronomía, accesibilidad o cómo llegar.', 'bot');

  document.getElementById('chat-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();
    if (!texto) return;
    responderUsuario(texto);
    input.value = '';
  });

  // Botones de pregunta rápida
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => responderUsuario(chip.textContent));
  });
});
