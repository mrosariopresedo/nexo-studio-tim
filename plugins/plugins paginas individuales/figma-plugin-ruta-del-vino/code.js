// ─── TIM · RUTA DEL VINO — Figma Plugin ──────────────────────────────────────
// Builds RUTA DEL VINO — TIM frame next to the last existing frame in the page
// and wires Figma prototype navigation with the HOME — TIM frame.
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 420, height: 460, title: "TIM — Ruta del Vino" });

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PAGE_NAME = "Pagina Web";
const HOME_NAME = "HOME — TIM";
const RDV_NAME  = "RUTA DEL VINO — TIM";
const FW = 1440, CX = 80, CW = 1280;

const BORGONA       = "722F37";
const BORGONA_DARK  = "5A2229";
const BORGONA_DEEP  = "3A1116";
const BORGONA_LIGHT = "F5EAEB";
const GRIS          = "333333";
const GRIS_M        = "666666";
const GRIS_S        = "888888";
const GRIS_BG       = "F7F7F7";
const GRIS_BORDE    = "E2E2E2";
const BLANCO        = "FFFFFF";
const BORDE         = "DDDDDD";
const VERDE_BG      = "E8F5E9";
const VERDE_FG      = "1B5E20";
const NARANJA_BG    = "FFF3E0";
const NARANJA_FG    = "E65100";

const REGULAR = 400, MEDIUM = 500, SEMIBOLD = 600, BOLD = 700, EXTRABOLD = 800;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function post(msg) { figma.ui.postMessage(msg); }

function hexRGB(c) {
  const h = c.length === 8 ? c.slice(0, 6) : c;
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255
  };
}

function weightStyle(w) {
  if (w >= 800) return "Extra Bold";
  if (w >= 700) return "Bold";
  if (w >= 600) return "Semi Bold";
  if (w >= 500) return "Medium";
  return "Regular";
}

function rect(parent, x, y, w, h, fillHex, opts) {
  const o = opts || {};
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(Math.max(w, 1), Math.max(h, 1));
  r.fills = fillHex ? [{ type: "SOLID", color: hexRGB(fillHex) }] : [];
  if (o.radius) r.cornerRadius = o.radius;
  if (o.stroke) {
    r.strokes = [{ type: "SOLID", color: hexRGB(o.stroke) }];
    r.strokeWeight = o.sw || 1;
    r.strokeAlign = "INSIDE";
  }
  if (o.opacity !== undefined) r.opacity = o.opacity;
  if (o.name) r.name = o.name;
  parent.appendChild(r);
  return r;
}

async function txt(parent, x, y, chars, weight, size, colorHex, opts) {
  const o = opts || {};
  const style = weightStyle(weight);
  await figma.loadFontAsync({ family: "Inter", style });
  const t = figma.createText();
  t.fontName = { family: "Inter", style };
  t.characters = chars;
  t.fontSize = size;
  t.fills = [{ type: "SOLID", color: hexRGB(colorHex) }];
  t.x = x; t.y = y;
  if (o.opacity !== undefined) t.opacity = o.opacity;
  if (o.w) { t.textAutoResize = "HEIGHT"; t.resize(o.w, t.height); }
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.name) t.name = o.name;
  parent.appendChild(t);
  return t;
}

function svgNode(parent, svgStr, x, y, w, h) {
  try {
    const node = figma.createNodeFromSvg(svgStr);
    node.resize(w, h);
    node.x = x; node.y = y;
    parent.appendChild(node);
    return node;
  } catch (e) {
    return rect(parent, x, y, w, h, BORGONA_LIGHT, { radius: 4 });
  }
}

async function sectionHeading(F, y, eyebrow, title, sub) {
  let cy = y;
  await txt(F, CX, cy, eyebrow, BOLD, 13, BORGONA);
  cy += 30;
  await txt(F, CX, cy, title, BOLD, 40, GRIS);
  cy += 56;
  if (sub) {
    const st = await txt(F, CX, cy, sub, REGULAR, 17, GRIS_M);
    st.textAutoResize = "HEIGHT";
    st.resize(720, st.height);
    cy += st.height + 12;
  }
  return cy;
}

// ─── SVG ASSETS ──────────────────────────────────────────────────────────────
const SVG_GRAPE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v3"/><path d="M14 5l2-1"/><circle cx="9" cy="10" r="2"/><circle cx="13" cy="10" r="2"/><circle cx="11" cy="13" r="2"/><circle cx="15" cy="13" r="2"/><circle cx="13" cy="16" r="2"/></svg>`;
const SVG_MAPPIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_MAPPIN_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_BUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="12" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>`;
const SVG_CLOCK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const SVG_CLOCK_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const SVG_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
const SVG_TIMER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12"/><line x1="12" y1="12" x2="15" y2="15"/></svg>`;
const SVG_TAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>`;
const SVG_BUILDING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const SVG_HISTORY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
const SVG_BOX = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`;
const SVG_SHIELD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
const SVG_STAR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const SVG_GLOBE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const SVG_USER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2a7 7 0 0 0-14 0v2"/><path d="M5 21l2-6h10l2 6"/></svg>`;
const SVG_SEAT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;
const SVG_AUDIO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const SVG_EYE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_TEMP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`;
const SVG_NAV = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
const SVG_INFO_WHITE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const SVG_INFO_BORGONA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const SVG_DOT_GREEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#7FFF7F"/></svg>`;

// SVG MAPA del recorrido (Mendoza ciudad → Maipú → Luján → Agrelo)
const SVG_MAP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 380">
  <rect width="820" height="380" fill="#FBFAF7"/>
  <path d="M40 200 Q 70 180 90 195 T 140 210 T 220 230 T 320 250 T 460 270 T 620 290 T 780 305" fill="none" stroke="#D4C4B8" stroke-width="3" opacity="0.55"/>
  <path d="M40 80 Q 90 60 130 75 T 220 100 T 330 130 T 450 160 T 580 195 T 720 235 T 800 260" fill="none" stroke="#D4C4B8" stroke-width="3" opacity="0.55"/>
  <text x="46" y="56" font-size="10" fill="#999" font-family="Inter,sans-serif">CORDILLERA</text>
  <line x1="180" y1="200" x2="320" y2="232" stroke="#722F37" stroke-width="3"/>
  <line x1="320" y1="232" x2="500" y2="252" stroke="#722F37" stroke-width="3"/>
  <line x1="500" y1="252" x2="680" y2="280" stroke="#722F37" stroke-width="3"/>
  <line x1="680" y1="280" x2="740" y2="305" stroke="#722F37" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="180" cy="200" r="9" fill="white" stroke="#722F37" stroke-width="3"/>
  <text x="186" y="186" font-size="13" font-weight="700" fill="#722F37" font-family="Inter,sans-serif">TIM</text>
  <text x="186" y="222" font-size="11" fill="#666" font-family="Inter,sans-serif">Guaymallén</text>
  <circle cx="320" cy="232" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="328" y="220" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Ciudad de Mendoza</text>
  <text x="328" y="248" font-size="10" fill="#888" font-family="Inter,sans-serif">CIT · +10 min</text>
  <circle cx="500" cy="252" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="508" y="240" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Maipú</text>
  <text x="508" y="268" font-size="10" fill="#888" font-family="Inter,sans-serif">Coquimbito · +30 min</text>
  <circle cx="680" cy="280" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="688" y="268" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Luján de Cuyo</text>
  <text x="688" y="296" font-size="10" fill="#888" font-family="Inter,sans-serif">Perdriel · +75 min</text>
  <circle cx="740" cy="305" r="9" fill="#722F37" stroke="#5A2229" stroke-width="2.5"/>
  <text x="752" y="312" font-size="12" font-weight="700" fill="#722F37" font-family="Inter,sans-serif">Agrelo</text>
  <text x="608" y="328" font-size="10" fill="#888" font-family="Inter,sans-serif">Destino final · +100 min</text>
  <g opacity="0.55">
    <circle cx="380" cy="160" r="3" fill="#722F37"/><text x="388" y="164" font-size="10" fill="#888" font-family="Inter,sans-serif">Trapiche</text>
    <circle cx="540" cy="195" r="3" fill="#722F37"/><text x="548" y="199" font-size="10" fill="#888" font-family="Inter,sans-serif">Zuccardi</text>
    <circle cx="640" cy="220" r="3" fill="#722F37"/><text x="648" y="224" font-size="10" fill="#888" font-family="Inter,sans-serif">Norton</text>
    <circle cx="700" cy="248" r="3" fill="#722F37"/><text x="708" y="252" font-size="10" fill="#888" font-family="Inter,sans-serif">Séptima</text>
    <circle cx="760" cy="282" r="3" fill="#722F37"/><text x="690" y="280" font-size="10" fill="#888" font-family="Inter,sans-serif" text-anchor="end">Ruca Malén</text>
  </g>
  <rect x="630" y="20" width="170" height="58" rx="6" fill="white" stroke="#DDDDDD" stroke-width="1"/>
  <text x="642" y="36" font-size="9" font-weight="700" fill="#888" font-family="Inter,sans-serif">REFERENCIAS</text>
  <line x1="642" y1="48" x2="666" y2="48" stroke="#722F37" stroke-width="3"/>
  <text x="672" y="51" font-size="10" fill="#666" font-family="Inter,sans-serif">Tramo recorrido</text>
  <line x1="642" y1="64" x2="650" y2="64" stroke="#722F37" stroke-width="3"/>
  <line x1="654" y1="64" x2="662" y2="64" stroke="#722F37" stroke-width="3" stroke-dasharray="3 3"/>
  <text x="672" y="67" font-size="10" fill="#666" font-family="Inter,sans-serif">Acceso a bodegas</text>
</svg>`;

// ─── SECTION: NAVBAR ─────────────────────────────────────────────────────────
async function _navbar(F, y) {
  rect(F, 0, y, FW, 76, BORGONA);
  await txt(F, CX, y + 20, "TIM", EXTRABOLD, 28, BLANCO);
  await txt(F, CX + 70, y + 36, "Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.75 });
  // Hotspot invisible sobre el logo TIM (RDV → HOME)
  const hotspotHome = figma.createRectangle();
  hotspotHome.name = "hotspot-nav-home";
  hotspotHome.x = CX; hotspotHome.y = y + 12;
  hotspotHome.resize(60, 52);
  hotspotHome.fills = [];
  hotspotHome.opacity = 0.01;
  F.appendChild(hotspotHome);

  let nx = CX + 270;
  for (const link of ["Larga Distancia", "Alta Montaña", "Ruta del Vino", "Aeropuerto", "Universitario"]) {
    const t = await txt(F, nx, y + 30, link, SEMIBOLD, 14, BLANCO);
    t.opacity = link === "Ruta del Vino" ? 1.0 : 0.82;
    if (link === "Ruta del Vino") {
      rect(F, nx, y + 69, t.width, 3, BLANCO, { name: "nav-rdv-underline" });
    }
    nx += t.width + 28;
  }
  rect(F, 1196, y + 16, 164, 44, null, { stroke: BLANCO, sw: 1.5, radius: 8 });
  await txt(F, 1196, y + 24, "Accesibilidad", SEMIBOLD, 14, BLANCO, { w: 164, align: "CENTER" });
  return { nextY: y + 76, hotspotHome };
}

// ─── SECTION: HERO ───────────────────────────────────────────────────────────
async function _hero(F, y) {
  const H = 540;
  rect(F, 0, y, FW, H, BORGONA);
  // Patrón decorativo de uvas a la derecha
  rect(F, 980, y + 80, 320, 380, BORGONA_DARK, { radius: 16, opacity: 0.45 });
  svgNode(F, SVG_GRAPE, 1090, y + 220, 100, 100);
  // Badge "Servicio activo"
  rect(F, CX, y + 64, 268, 36, BLANCO, { radius: 100, opacity: 0.14 });
  svgNode(F, SVG_DOT_GREEN, CX + 10, y + 71, 18, 18);
  await txt(F, CX + 34, y + 72, "Servicio activo · Temporada 2026", MEDIUM, 13, BLANCO);
  // Eyebrow "Línea 3"
  await txt(F, CX, y + 120, "LÍNEA 3", BOLD, 14, BLANCO, { opacity: 0.85 });
  // H1 dividido en 2 líneas para que no se solape
  await txt(F, CX, y + 148, "Bus Vitivinícola", EXTRABOLD, 48, BLANCO);
  await txt(F, CX, y + 208, "Ruta del Vino", EXTRABOLD, 48, BLANCO);
  // Subtítulo
  const sub = await txt(F, CX, y + 282,
    "Recorrido turístico diario desde la Terminal TIM hasta las principales\n" +
    "bodegas y viñedos de Luján de Cuyo y Maipú. Tu puerta de entrada al\n" +
    "mundo del Malbec mendocino.",
    REGULAR, 18, BLANCO, { opacity: 0.9 });
  sub.textAutoResize = "HEIGHT";
  sub.resize(720, sub.height);
  // Chips
  const chips = [
    { svg: SVG_MAPPIN_WHITE, label: "Luján de Cuyo" },
    { svg: SVG_MAPPIN_WHITE, label: "Maipú" },
    { svg: SVG_BUS,          label: "6 paradas" },
    { svg: SVG_CLOCK_WHITE,  label: "Frecuencia: 60 min" }
  ];
  let chx = CX;
  const chy = y + 408;
  for (const c of chips) {
    const lt = await txt(F, chx + 38, chy + 12, c.label, MEDIUM, 13, BLANCO);
    const cw = 38 + lt.width + 20;
    rect(F, chx, chy, cw, 38, BLANCO, { radius: 100, opacity: 0.14 });
    svgNode(F, c.svg, chx + 12, chy + 10, 18, 18);
    // Reapendear el texto para que quede arriba del rect
    lt.remove();
    await txt(F, chx + 38, chy + 12, c.label, MEDIUM, 13, BLANCO);
    chx += cw + 10;
  }
  return y + H;
}

// ─── SECTION: INFO BAR ───────────────────────────────────────────────────────
async function _infobar(F, y) {
  const H = 96;
  rect(F, 0, y, FW, H, GRIS_BG);
  rect(F, 0, y + H - 1, FW, 1, GRIS_BORDE);
  const items = [
    { svg: SVG_CLOCK,   label: "Primera salida",  value: "08:00 hs" },
    { svg: SVG_CLOCK,   label: "Última salida",   value: "17:00 hs" },
    { svg: SVG_REFRESH, label: "Frecuencia",      value: "Cada 60 min" },
    { svg: SVG_TIMER,   label: "Duración total",  value: "~2 horas" },
    { svg: SVG_TAG,     label: "Tarifa",          value: "$3.800 / ida" }
  ];
  const colW = CW / items.length;
  for (let i = 0; i < items.length; i++) {
    const ix = CX + i * colW;
    svgNode(F, items[i].svg, ix, y + 32, 26, 26);
    await txt(F, ix + 38, y + 30, items[i].label, REGULAR, 12, GRIS_S);
    await txt(F, ix + 38, y + 48, items[i].value, BOLD, 15, GRIS);
    if (i < items.length - 1) rect(F, ix + colW - 12, y + 24, 1, 48, GRIS_BORDE);
  }
  return y + H;
}

// ─── SECTION: DESTINOS (Bodegas) ─────────────────────────────────────────────
const BODEGAS = [
  { svg: SVG_BUILDING, name: "Bodega Catena Zapata",
    desc: "Ícono del Malbec argentino. Arquitectura piramidal en pleno corazón de Agrelo, Luján de Cuyo. Catas premium y vista a los Andes.",
    loc: "Agrelo, Luján de Cuyo", varietales: "Malbec · Cabernet" },
  { svg: SVG_HISTORY, name: "Bodega Norton",
    desc: "Clásica y elegante, fundada en 1895. Ofrece recorridos por su histórica bodega y degustaciones de sus varietales insignia.",
    loc: "Perdriel, Luján de Cuyo", varietales: "Malbec · Torrontés" },
  { svg: SVG_BOX, name: "Bodega Trapiche",
    desc: "Historia y tradición enológica desde 1883. Referente nacional e internacional, ideal para combinar cata con museo del vino en Maipú.",
    loc: "Coquimbito, Maipú", varietales: "Malbec · Chardonnay" },
  { svg: SVG_SHIELD, name: "Bodega Zuccardi",
    desc: "Innovación y gastronomía de primer nivel. Reconocida entre las mejores bodegas del mundo, ofrece experiencias de enoturismo únicas.",
    loc: "Russell, Maipú", varietales: "Malbec · Bonarda" },
  { svg: SVG_STAR, name: "Bodega Ruca Malén",
    desc: "Estilo boutique con impresionante vista a la Cordillera. Reconocida por su gastronomía maridada y vinos de alta gama.",
    loc: "RN 7 km 1059, Luján", varietales: "Syrah · Malbec" },
  { svg: SVG_GLOBE, name: "Bodega Séptima",
    desc: "Arte y vino en perfecta armonía. Sus instalaciones combinan diseño contemporáneo con colecciones de arte y catas guiadas.",
    loc: "RN 7 km 6.5, Luján", varietales: "Malbec · Cabernet Franc" }
];

async function _destinos(F, y) {
  const CARD_W = Math.floor((CW - 2 * 24) / 3);
  const CARD_H = 268;
  const SEC_H = 96 + 130 + 2 * (CARD_H + 24) + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "01 · Destinos principales", "Bodegas y viñedos del recorrido",
    "Seis bodegas históricas y boutique de Luján de Cuyo y Maipú, accesibles directamente desde el Bus Vitivinícola.");
  cy += 32;
  for (let i = 0; i < BODEGAS.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const b = BODEGAS[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 24);
    rect(F, cx, ccy, CARD_W, CARD_H, BLANCO, { radius: 12, stroke: BORGONA_LIGHT, sw: 1 });
    // Header con icono
    rect(F, cx, ccy, CARD_W, 76, GRIS_BG, { radius: 12 });
    rect(F, cx, ccy + 64, CARD_W, 12, GRIS_BG); // ocultar radius bottom del header
    rect(F, cx + 24, ccy + 22, 32, 32, BLANCO, { radius: 8, stroke: BORGONA_LIGHT, sw: 1 });
    svgNode(F, b.svg, cx + 30, ccy + 28, 20, 20);
    // Nombre
    await txt(F, cx + 24, ccy + 88, b.name, BOLD, 17, GRIS);
    // Descripción
    const desc = await txt(F, cx + 24, ccy + 116, b.desc, REGULAR, 13, GRIS_M);
    desc.textAutoResize = "HEIGHT";
    desc.resize(CARD_W - 48, desc.height);
    // Meta: separador + locación + varietales
    rect(F, cx + 24, ccy + CARD_H - 70, CARD_W - 48, 1, GRIS_BORDE);
    svgNode(F, SVG_MAPPIN, cx + 24, ccy + CARD_H - 56, 16, 16);
    await txt(F, cx + 46, ccy + CARD_H - 56, b.loc, MEDIUM, 12, GRIS_M);
    rect(F, cx + 24, ccy + CARD_H - 30, 200, 22, BORGONA_LIGHT, { radius: 4 });
    await txt(F, cx + 24, ccy + CARD_H - 25, b.varietales, BOLD, 11, BORGONA, { w: 200, align: "CENTER" });
  }
  return y + SEC_H;
}

// ─── SECTION: PARADAS ────────────────────────────────────────────────────────
const PARADAS = [
  { num: "Parada 0 · Origen",        name: "Terminal TIM — Guaymallén",
    addr: "Juan B. Alberdi s/n, Guaymallén",
    tag1: "Estacionamiento disponible", access: true, terminal: true },
  { num: "Parada 1",                 name: "Centro de Información Turística — Garibaldi y San Martín",
    addr: "Garibaldi 10, Ciudad de Mendoza",
    tag1: "+10 min desde TIM", access: true },
  { num: "Parada 2",                 name: "Maipú Centro — Av. Ozamis y Urquiza",
    addr: "Coquimbito, Maipú",
    tag1: "+30 min desde TIM", tag2: "Servicios gastronómicos" },
  { num: "Parada 3",                 name: "Bodega Trapiche / Zuccardi — Maipú",
    addr: "Ruta Provincial 15, Maipú",
    tag1: "+45 min desde TIM", access: true },
  { num: "Parada 4",                 name: "Luján de Cuyo — Perdriel / Norton / Séptima",
    addr: "RN 7 km 1056–1059, Luján",
    tag1: "+75 min desde TIM", access: true },
  { num: "Parada 5 · Destino final", name: "Catena Zapata / Ruca Malén — Agrelo",
    addr: "Agrelo, Luján de Cuyo",
    tag1: "+100 min desde TIM", tag2: "Zona premium", terminal: true }
];

async function _paradas(F, y) {
  const ROW_H = 110;
  const SEC_H = 96 + 130 + PARADAS.length * ROW_H + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "02 · Paradas del recorrido", "6 estaciones de Mendoza a Agrelo",
    "Cada parada conecta con bodegas y puntos clave del corredor vitivinícola. Tiempos estimados desde la Terminal TIM.");
  cy += 24;
  // Línea vertical del timeline
  const TL_X = CX + 18;
  rect(F, TL_X, cy + 22, 2, PARADAS.length * ROW_H - 32, BORGONA, { opacity: 0.35 });
  for (let i = 0; i < PARADAS.length; i++) {
    const p = PARADAS[i];
    const ry = cy + i * ROW_H;
    // Card
    const CARD_X = CX + 56;
    rect(F, CARD_X, ry, CW - 56, ROW_H - 20, BLANCO, { radius: 10, stroke: GRIS_BORDE, sw: 1 });
    // Dot del timeline
    if (p.terminal) {
      rect(F, TL_X - 11, ry + 22, 24, 24, BORGONA, { radius: 12 });
      rect(F, TL_X - 5, ry + 28, 12, 12, BLANCO, { radius: 6 });
    } else {
      rect(F, TL_X - 7, ry + 26, 16, 16, BLANCO, { radius: 8, stroke: BORGONA, sw: 2.5 });
    }
    // Contenido card
    await txt(F, CARD_X + 24, ry + 18, p.num, BOLD, 11, BORGONA);
    await txt(F, CARD_X + 24, ry + 38, p.name, BOLD, 17, GRIS);
    // Tags abajo
    let tx = CARD_X + 24;
    // Tag dirección
    svgNode(F, SVG_MAPPIN, tx, ry + 66, 14, 14);
    const lt = await txt(F, tx + 20, ry + 66, p.addr, REGULAR, 12, GRIS_M);
    tx += 20 + lt.width + 28;
    // Tag info
    if (p.tag1) {
      const t1 = await txt(F, tx, ry + 66, p.tag1, REGULAR, 12, GRIS_M);
      tx += t1.width + 28;
    }
    if (p.tag2) {
      const t2 = await txt(F, tx, ry + 66, p.tag2, REGULAR, 12, GRIS_M);
      tx += t2.width + 28;
    }
    if (p.access) {
      rect(F, tx, ry + 62, 96, 22, VERDE_BG, { radius: 4 });
      svgNode(F, SVG_INFO_BORGONA, tx + 6, ry + 65, 14, 14);
      await txt(F, tx + 6, ry + 67, "Accesible", BOLD, 11, VERDE_FG, { w: 90, align: "CENTER" });
    }
  }
  return y + SEC_H;
}

// ─── SECTION: MAPA ───────────────────────────────────────────────────────────
async function _mapa(F, y) {
  const MAP_H = 380;
  const INFO_W = CW - 840 - 24;
  const SEC_H = 96 + 130 + MAP_H + 96;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "03 · Mapa del recorrido", "Luján de Cuyo · Maipú · Mendoza",
    "Trayecto: Terminal TIM (Guaymallén) → Ciudad de Mendoza → Maipú → Luján de Cuyo → Agrelo.");
  cy += 24;
  // Map
  rect(F, CX, cy, 840, MAP_H, "FBFAF7", { radius: 12, stroke: BORDE, sw: 1 });
  svgNode(F, SVG_MAP, CX, cy, 840, MAP_H);
  // Info cards a la derecha
  const ix = CX + 840 + 24;
  // Card cordillera
  rect(F, ix, cy, INFO_W, 180, BORGONA_LIGHT, { radius: 12, stroke: BORGONA, sw: 1 });
  await txt(F, ix + 22, cy + 20, "RECORRIDO", BOLD, 10, BORGONA);
  await txt(F, ix + 22, cy + 42, "≈ 60 km", BOLD, 24, GRIS);
  await txt(F, ix + 22, cy + 76, "Desde la Terminal TIM hasta Agrelo, pasando por el corazón del corredor vitivinícola.",
    REGULAR, 13, GRIS_M, { w: INFO_W - 44 });
  rect(F, ix + 22, cy + 132, INFO_W - 44, 32, BLANCO, { radius: 6, stroke: BORDE, sw: 1 });
  await txt(F, ix + 22, cy + 142, "Conexión: Línea Urbana 110 · CIT", SEMIBOLD, 12, GRIS, { w: INFO_W - 44, align: "CENTER" });
  // Card horario de salidas resumido
  rect(F, ix, cy + 192, INFO_W, MAP_H - 192, BLANCO, { radius: 12, stroke: BORDE, sw: 1 });
  await txt(F, ix + 22, cy + 212, "DATOS DEL RECORRIDO", BOLD, 10, BORGONA);
  const rows = [
    ["Origen",     "Terminal TIM"],
    ["Destino",    "Agrelo · Luján"],
    ["Paradas",    "6 estaciones"],
    ["Duración",   "~2 horas"],
    ["Frecuencia", "Cada 60 min"]
  ];
  for (let hi = 0; hi < rows.length; hi++) {
    const hy = cy + 238 + hi * 28;
    await txt(F, ix + 22, hy, rows[hi][0], REGULAR, 13, GRIS_M);
    await txt(F, ix + INFO_W - 22 - 130, hy, rows[hi][1], SEMIBOLD, 13, GRIS, { w: 130, align: "RIGHT" });
  }
  return y + SEC_H;
}

// ─── SECTION: HORARIOS ───────────────────────────────────────────────────────
const HORARIOS_LV = [
  ["08:00", "08:45", "10:20"],
  ["09:00", "09:45", "11:20"],
  ["10:00", "10:45", "12:20"],
  ["11:00", "11:45", "13:20"],
  ["13:00", "13:45", "15:20"],
  ["15:00", "15:45", "17:20"],
  ["17:00", "17:45", "19:20"]
];
const HORARIOS_FDS = [
  ["08:00", "08:45", "10:20"],
  ["09:30", "10:15", "11:50"],
  ["11:00", "11:45", "13:20"],
  ["12:30", "13:15", "14:50"],
  ["14:00", "14:45", "16:20"],
  ["15:30", "16:15", "17:50"],
  ["17:00", "17:45", "19:20"]
];

async function _horariosTable(F, x, y, w, title, subtitle, rows, lastReturn) {
  const headerH = 72;
  const colHeadH = 42;
  const rowH = 38;
  const footH = 44;
  const totalH = headerH + colHeadH + rows.length * rowH + footH;
  rect(F, x, y, w, totalH, BLANCO, { radius: 12, stroke: GRIS_BORDE, sw: 1 });
  // Header
  rect(F, x, y, w, headerH, BORGONA_LIGHT, { radius: 12 });
  rect(F, x, y + headerH - 12, w, 12, BORGONA_LIGHT);
  svgNode(F, SVG_CLOCK, x + 22, y + 24, 22, 22);
  await txt(F, x + 52, y + 22, title, BOLD, 17, BORGONA);
  await txt(F, x + 52, y + 44, subtitle, REGULAR, 12, GRIS_M);
  // Column header
  const heads = ["Salida TIM", "Llegada Maipú", "Llegada Agrelo"];
  const colW = w / heads.length;
  let chy = y + headerH;
  rect(F, x, chy, w, colHeadH, GRIS_BG);
  for (let i = 0; i < heads.length; i++) {
    await txt(F, x + i * colW, chy + 14, heads[i], BOLD, 12, GRIS, { w: colW, align: "CENTER" });
  }
  // Rows
  for (let r = 0; r < rows.length; r++) {
    const ry = chy + colHeadH + r * rowH;
    if (r > 0) rect(F, x + 16, ry, w - 32, 1, GRIS_BORDE);
    for (let c = 0; c < heads.length; c++) {
      const isFirst = c === 0;
      await txt(F, x + c * colW, ry + 11, rows[r][c],
        isFirst ? BOLD : REGULAR, 14, isFirst ? BORGONA : GRIS,
        { w: colW, align: "CENTER" });
    }
  }
  // Footer
  const fy = chy + colHeadH + rows.length * rowH;
  rect(F, x, fy, w, footH, GRIS_BG);
  await txt(F, x, fy + 14, lastReturn, MEDIUM, 12, GRIS_M, { w: w, align: "CENTER" });
  return totalH;
}

async function _horarios(F, y) {
  // Calcular altura: dos tablas lado a lado + nota Vendimia
  const TABLE_W = Math.floor((CW - 24) / 2);
  const TABLE_H = 72 + 42 + 7 * 38 + 44; // headerH + colHead + 7 rows + footer
  const SEC_H = 96 + 130 + TABLE_H + 72 + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "04 · Horarios y frecuencias", "Salidas desde la Terminal TIM",
    "Salidas confirmadas para la temporada 2026. Durante la Vendimia (febrero–marzo) se agregan servicios extraordinarios.");
  cy += 24;
  await _horariosTable(F, CX, cy, TABLE_W,
    "Lunes a Viernes", "Servicio regular · 7 salidas",
    HORARIOS_LV, "Último retorno desde Agrelo: 19:00 hs");
  await _horariosTable(F, CX + TABLE_W + 24, cy, TABLE_W,
    "Sábados, domingos y feriados", "Servicio ampliado · 7 salidas",
    HORARIOS_FDS, "Último retorno desde Agrelo: 19:30 hs");
  cy += TABLE_H + 24;
  // Nota Vendimia
  rect(F, CX, cy, CW, 56, BLANCO, { radius: 10, stroke: NARANJA_FG, sw: 1 });
  rect(F, CX, cy, 4, 56, NARANJA_FG, { radius: 2 });
  svgNode(F, SVG_INFO_BORGONA, CX + 20, cy + 18, 20, 20);
  await txt(F, CX + 52, cy + 14, "Servicios extraordinarios durante Vendimia (feb–mar)", BOLD, 13, NARANJA_FG);
  await txt(F, CX + 52, cy + 32, "Salidas adicionales a las 07:00 y 18:00 hs. Consultá disponibilidad en boletería.",
    REGULAR, 12, GRIS_M);
  return y + SEC_H;
}

// ─── SECTION: ACCESIBILIDAD ──────────────────────────────────────────────────
const ACCES = [
  { svg: SVG_USER,  title: "Rampa hidráulica",
    desc: "Todas las unidades cuentan con rampa de acceso para sillas de ruedas y movilidad reducida." },
  { svg: SVG_SEAT,  title: "Espacios reservados",
    desc: "2 lugares exclusivos por unidad para sillas de ruedas con cinturones de seguridad homologados." },
  { svg: SVG_AUDIO, title: "Información sonora",
    desc: "Anuncios automáticos en cada parada con nombre de la bodega y tiempo estimado de estadía." },
  { svg: SVG_EYE,   title: "Señalización de alto contraste",
    desc: "Cartelería con contraste mínimo 4.5:1 (WCAG 1.4.3 AA). Tipografía Inter, legible en todos los tamaños." },
  { svg: SVG_TEMP,  title: "Clima controlado",
    desc: "Aire acondicionado y calefacción en todas las unidades para confort en todas las estaciones." },
  { svg: SVG_NAV,   title: "Mapa táctil en paradas",
    desc: "Plano del recorrido en relieve con descripción Braille en la Terminal TIM y el CIT de Ciudad de Mendoza." }
];

async function _accesibilidad(F, y) {
  const CARD_W = Math.floor((CW - 2 * 24) / 3);
  const CARD_H = 196;
  const NOTE_H = 84;
  const CTA_H = 88;
  const SEC_H = 96 + 130 + 2 * (CARD_H + 24) + 32 + NOTE_H + 24 + CTA_H + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "05 · Accesibilidad", "Diseñado para que todos disfruten el vino",
    "TIM cumple WCAG 2.1 AA y Decreto 914/97. Asistencia disponible sin costo, coordinable al reservar.");
  cy += 32;
  for (let i = 0; i < ACCES.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const a = ACCES[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 24);
    rect(F, cx, ccy, CARD_W, CARD_H, GRIS_BG, { radius: 12, stroke: GRIS_BORDE, sw: 1 });
    rect(F, cx + 24, ccy + 24, 56, 56, BLANCO, { radius: 14, stroke: BORGONA_LIGHT, sw: 1 });
    svgNode(F, a.svg, cx + 40, ccy + 40, 24, 24);
    await txt(F, cx + 24, ccy + 100, a.title, BOLD, 16, GRIS);
    const desc = await txt(F, cx + 24, ccy + 124, a.desc, REGULAR, 13, GRIS_M);
    desc.textAutoResize = "HEIGHT";
    desc.resize(CARD_W - 48, desc.height);
  }
  cy += 2 * (CARD_H + 24) + 8;
  // Nota WCAG
  rect(F, CX, cy, CW, NOTE_H, BORGONA_LIGHT, { radius: 12 });
  rect(F, CX, cy, 4, NOTE_H, BORGONA, { radius: 2 });
  svgNode(F, SVG_INFO_BORGONA, CX + 24, cy + 24, 24, 24);
  await txt(F, CX + 64, cy + 20, "Cumplimiento WCAG 2.1 nivel AA", BOLD, 14, BORGONA);
  const wcagDesc = await txt(F, CX + 64, cy + 42,
    "Contraste ≥ 4.5:1, botones con área mínima 44×44 px (Criterio 2.5.5), texto alternativo en imágenes y tablas navegables por teclado con atributos ARIA. Asistencia: accesibilidad@tim.mendoza.gob.ar",
    REGULAR, 12, GRIS_M);
  wcagDesc.textAutoResize = "HEIGHT";
  wcagDesc.resize(CW - 88, wcagDesc.height);
  cy += NOTE_H + 24;
  // CTA banner
  rect(F, CX, cy, CW, CTA_H, BORGONA, { radius: 12 });
  await txt(F, CX + 32, cy + 14, "¿NECESITÁS ASISTENCIA?", BOLD, 10, BLANCO, { opacity: 0.8 });
  await txt(F, CX + 32, cy + 36, "Coordinala antes de viajar — sin costo adicional.", SEMIBOLD, 19, BLANCO);
  rect(F, CX + CW - 302, cy + 22, 144, 44, BLANCO, { radius: 8 });
  await txt(F, CX + CW - 302, cy + 34, "Guía de accesibilidad →", BOLD, 13, BORGONA, { w: 144, align: "CENTER" });
  rect(F, CX + CW - 146, cy + 22, 138, 44, null, { stroke: BLANCO, sw: 1.5, radius: 8 });
  await txt(F, CX + CW - 146, cy + 34, "Contacto / Ayuda", BOLD, 13, BLANCO, { w: 138, align: "CENTER" });
  return y + SEC_H;
}

// ─── SECTION: FOOTER ─────────────────────────────────────────────────────────
async function _footer(F, y) {
  const SEC_H = 340;
  rect(F, 0, y, FW, SEC_H, GRIS);
  await txt(F, CX, y + 64, "TIM", EXTRABOLD, 32, BLANCO);
  await txt(F, CX, y + 100, "Terminal Inteligente de Mendoza", REGULAR, 13, BLANCO, { opacity: 0.7 });
  await txt(F, CX, y + 130, "Juan B. Alberdi s/n, M5519", REGULAR, 14, BLANCO, { opacity: 0.85 });
  await txt(F, CX, y + 152, "Guaymallén, Mendoza, Argentina", REGULAR, 14, BLANCO, { opacity: 0.85 });
  await txt(F, CX, y + 182, "Atención 24/7 · 0261 476-5875", REGULAR, 13, BLANCO, { opacity: 0.6 });
  const fcols = [
    { title: "Navegación", items: ["Inicio", "Servicios", "Accesibilidad", "Contacto"], x: 520 },
    { title: "Servicios",  items: ["Larga Distancia", "Alta Montaña", "Ruta del Vino", "Aeropuerto", "Universitario"], x: 740 },
    { title: "Información",items: ["Llegar a la terminal", "Tarifas", "Política de privacidad", "Términos y condiciones"], x: 1000 }
  ];
  for (const col of fcols) {
    await txt(F, col.x, y + 64, col.title, BOLD, 12, BLANCO, { opacity: 0.9 });
    for (let i = 0; i < col.items.length; i++) {
      await txt(F, col.x, y + 90 + i * 26, col.items[i], REGULAR, 13, BLANCO, { opacity: 0.75 });
    }
  }
  rect(F, CX, y + 282, CW, 1, BLANCO, { opacity: 0.12 });
  await txt(F, CX, y + 298, "© 2026 Nexo Studio · Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.6 });
  await txt(F, 1180, y + 298, "Hecho en Mendoza, Argentina", REGULAR, 12, BLANCO, { opacity: 0.6 });
  return y + SEC_H;
}

// ─── PROTOTYPE CONNECTIONS ───────────────────────────────────────────────────
function makeNav(node, destId) {
  try {
    node.reactions = [{
      trigger: { type: "ON_CLICK" },
      actions: [{
        type: "NODE",
        destinationId: destId,
        navigation: "NAVIGATE",
        transition: null,
        preserveScrollPosition: false
      }]
    }];
    return true;
  } catch (e) {
    post({ type: "log", text: "    ERR reactions: " + e.message });
    return false;
  }
}

function addPrototypeConnections(rdvFrame, hotspotHome, page) {
  const homeFrame = page.findOne(n => n.name === HOME_NAME && n.type === "FRAME");

  // ── RDV → HOME: hotspot invisible en el logo TIM ──────────────────────────
  let back = 0;
  if (homeFrame) {
    if (makeNav(hotspotHome, homeFrame.id)) back++;
    post({ type: "log", text: "  RDV → HOME: hotspot creado en logo TIM (" + back + ")" });
  } else {
    post({ type: "log", text: "  RDV → HOME: frame HOME no encontrado — saltado" });
  }

  // ── HOME → RDV ────────────────────────────────────────────────────────────
  if (!homeFrame) {
    post({ type: "log", text: "  HOME → RDV: frame HOME no encontrado — saltado" });
    return;
  }

  let linked = 0;

  // Estrategia 1: hotspot nombrado en HOME
  const homeHotspot = homeFrame.findOne(n => n.name === "hotspot-nav-rdv");
  if (homeHotspot) {
    if (makeNav(homeHotspot, rdvFrame.id)) linked++;
    post({ type: "log", text: "  HOME → RDV via hotspot nombrado: " + linked });
  }

  // Estrategia 2: text nodes con characters === "Ruta del Vino"
  const textNodes = homeFrame.findAll(n => n.type === "TEXT" && n.characters === "Ruta del Vino");
  post({ type: "log", text: "  HOME: text nodes 'Ruta del Vino' encontrados: " + textNodes.length });
  for (const n of textNodes) {
    if (makeNav(n, rdvFrame.id)) linked++;
  }

  post({ type: "log", text: "  HOME → RDV total: " + linked + " conexion(es)" });

  // Estrategia 3: fallback — crear hotspot sobre area aproximada del navbar
  if (linked === 0) {
    post({ type: "log", text: "  Creando hotspot fallback en HOME navbar..." });
    const hs = figma.createRectangle();
    hs.name = "hotspot-nav-rdv";
    hs.fills = [];
    hs.opacity = 0.01;
    // Posición aproximada del link "Ruta del Vino" en el HOME navbar
    hs.x = 660; hs.y = 16;
    hs.resize(110, 52);
    homeFrame.appendChild(hs);
    if (makeNav(hs, rdvFrame.id)) {
      post({ type: "log", text: "  Hotspot fallback creado: OK" });
    }
  }
}

// ─── BUILD ───────────────────────────────────────────────────────────────────
async function buildRDV() {
  const page = figma.root.children.find(p => p.name === PAGE_NAME);
  if (!page) {
    figma.ui.postMessage({ type: "error", text: "Página '" + PAGE_NAME + "' no encontrada. Ejecutá primero el plugin HOME." });
    return;
  }
  figma.currentPage = page;

  // Posicionar al lado del último frame existente (el que esté más a la derecha)
  const homeFrame = page.findOne(n => n.name === HOME_NAME && n.type === "FRAME");
  let anchorFrame = null;
  let maxRight = -Infinity;
  for (const child of page.children) {
    if (child.type !== "FRAME") continue;
    if (child.name === RDV_NAME) continue; // ignorar versión previa
    const right = child.x + child.width;
    if (right > maxRight) {
      maxRight = right;
      anchorFrame = child;
    }
  }
  const rdvX = anchorFrame ? anchorFrame.x + anchorFrame.width + 120 : 1560;
  post({ type: "log", text: "📐 Anclaje: " + (anchorFrame ? anchorFrame.name : "ninguno") + " termina en x=" + maxRight });
  post({ type: "log", text: "📐 RUTA DEL VINO en x=" + rdvX });

  // Remove existing
  page.findChildren(n => n.name === RDV_NAME).forEach(n => n.remove());

  // Create frame
  const F = figma.createFrame();
  F.name = RDV_NAME;
  F.x = rdvX; F.y = 0;
  F.resize(FW, 100);
  F.fills = [{ type: "SOLID", color: hexRGB(BLANCO) }];
  F.clipsContent = false;
  page.appendChild(F);

  let y = 0;
  post({ type: "log", text: "🏗️ 1/9 — Navbar" });
  const navResult = await _navbar(F, y);
  const hotspotHome = navResult.hotspotHome;
  y = navResult.nextY;
  post({ type: "log", text: "🏗️ 2/9 — Hero" });
  y = await _hero(F, y);
  post({ type: "log", text: "🏗️ 3/9 — Info bar" });
  y = await _infobar(F, y);
  post({ type: "log", text: "🏗️ 4/9 — Destinos (bodegas)" });
  y = await _destinos(F, y);
  post({ type: "log", text: "🏗️ 5/9 — Paradas" });
  y = await _paradas(F, y);
  post({ type: "log", text: "🏗️ 6/9 — Mapa del recorrido" });
  y = await _mapa(F, y);
  post({ type: "log", text: "🏗️ 7/9 — Horarios" });
  y = await _horarios(F, y);
  post({ type: "log", text: "🏗️ 8/9 — Accesibilidad" });
  y = await _accesibilidad(F, y);
  post({ type: "log", text: "🏗️ 9/9 — Footer" });
  y = await _footer(F, y);

  F.resize(FW, y);
  post({ type: "log", text: "✅ Frame: " + FW + "×" + y + "px" });
  post({ type: "log", text: "🔗 Conectando prototipo…" });
  addPrototypeConnections(F, hotspotHome, page);
  figma.viewport.scrollAndZoomIntoView([F]);
  return { type: "done" };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === "run") {
    post({ type: "log", text: "🍷 Iniciando — RUTA DEL VINO — TIM" });
    try {
      const result = await buildRDV();
      figma.ui.postMessage(result || { type: "done" });
      figma.notify("🍷 RUTA DEL VINO — TIM generada!", { timeout: 4000 });
    } catch (e) {
      figma.ui.postMessage({ type: "error", text: e.message || String(e) });
    }
  }
  if (msg.type === "close") figma.closePlugin();
};
