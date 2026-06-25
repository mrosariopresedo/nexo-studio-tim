// ─── TIM · ALTA MONTAÑA — Figma Plugin (Multi-frame) ─────────────────────────
// Builds 7 frames (INICIO/SERVICIOS/RECORRIDO/MAPA/HORARIOS/ACCESIBILIDAD/CONTACTO)
// next to the last existing frame in the "Pagina Web" page.
// Wires internal tabs, "Ver Horarios" CTA, and HOME ↔ INICIO navigation.
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 420, height: 500, title: "TIM — Alta Montaña" });

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PAGE_NAME = "Pagina Web";
const HOME_NAME = "HOME — TIM";

const FRAMES = [
  { id: "inicio",        name: "ALTA MONTAÑA — INICIO",        label: "Inicio" },
  { id: "servicios",     name: "ALTA MONTAÑA — SERVICIOS",     label: "Servicios" },
  { id: "recorrido",     name: "ALTA MONTAÑA — RECORRIDO",     label: "Recorrido" },
  { id: "mapa",          name: "ALTA MONTAÑA — MAPA",          label: "Mapa" },
  { id: "horarios",      name: "ALTA MONTAÑA — HORARIOS",      label: "Horarios" },
  { id: "accesibilidad", name: "ALTA MONTAÑA — ACCESIBILIDAD", label: "Accesibilidad" },
  { id: "contacto",      name: "ALTA MONTAÑA — CONTACTO",      label: "Contacto" }
];

const FW = 1440, CX = 80, CW = 1280;
const TOP_BANNER_H = 36;
const NAVBAR_H = 88;

const BORGONA       = "722F37";
const BORGONA_DARK  = "5A2229";
const BORGONA_DEEP  = "3A1116";
const BORGONA_LIGHT = "F5EAEB";
const ROSA_PALE     = "FFC2C7";
const GRIS          = "333333";
const GRIS_M        = "666666";
const GRIS_S        = "888888";
const GRIS_BG       = "F7F7F7";
const GRIS_BORDE    = "E2E2E2";
const BLANCO        = "FFFFFF";
const BORDE         = "DDDDDD";
const VERDE_BG      = "E8F5E9";
const VERDE_FG      = "1B5E20";
const VERDE_DOT     = "10B981";
const AMBAR_BG      = "FFF8E1";
const AMBAR_FG      = "B45309";
const AZUL_BG       = "E3F2FD";
const AZUL_FG       = "1565C0";
const MORADO        = "A855F7";
const MORADO_DARK   = "7E22CE";
const MORADO_LIGHT  = "F3E8FF";

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

function hotspot(parent, x, y, w, h, name) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(Math.max(w, 1), Math.max(h, 1));
  r.fills = [];
  r.opacity = 0.01;
  r.name = name;
  parent.appendChild(r);
  return r;
}

async function sectionHeading(F, y, eyebrow, title, sub) {
  let cy = y;
  await txt(F, CX, cy, eyebrow, BOLD, 13, BORGONA);
  cy += 28;
  await txt(F, CX, cy, title, BOLD, 38, GRIS);
  cy += 52;
  if (sub) {
    const st = await txt(F, CX, cy, sub, REGULAR, 16, GRIS_M);
    st.textAutoResize = "HEIGHT";
    st.resize(760, st.height);
    cy += st.height + 12;
  }
  return cy;
}

// ─── SVG ASSETS ──────────────────────────────────────────────────────────────
const SVG_DOT_GREEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="#10B981"/></svg>`;
const SVG_MOUNTAIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-10 4 6 3-4 5 8H3z"/><circle cx="17" cy="7" r="2"/></svg>`;
const SVG_COMPASS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16 8 10 10 8 16 14 14 16 8"/></svg>`;
const SVG_BUS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="12" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>`;
const SVG_GLOBE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const SVG_ROUTE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M6 16V8a4 4 0 0 1 4-4h4M18 8v8a4 4 0 0 1-4 4h-4"/></svg>`;
const SVG_HANDSHAKE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-3-3 4-4 3 3"/><path d="M14 13l3 3 4-4-3-3-4 4z"/><path d="M2 12l3 3 4-4-3-3-4 4z"/></svg>`;
const SVG_MAPPIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_MAPPIN_W = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_CLOCK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const SVG_CLOCK_W = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const SVG_PHONE_W = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>`;
const SVG_INFO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const SVG_SHIELD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
const SVG_RAMP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18M3 19l16-12"/><circle cx="16" cy="9" r="1.5"/><path d="M19 7l-4 5"/></svg>`;
const SVG_WHEELCHAIR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1.8"/><path d="M9 7v6h6l2 5M5 14a6 6 0 109 5"/><circle cx="11" cy="18" r="3.5"/></svg>`;
const SVG_TOILET = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><circle cx="7" cy="6" r="2"/><path d="M5 21v-6H4l1.5-5a2 2 0 014 0L11 15h-1v6z"/><circle cx="17" cy="6" r="2"/><path d="M14 21v-4h-1l2-6h4l2 6h-1v4z"/></svg>`;
const SVG_BRAILLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="6" r="1"/><circle cx="7" cy="12" r="1"/><circle cx="7" cy="18" r="1"/><circle cx="13" cy="6" r="1"/><circle cx="13" cy="12" r="1"/><circle cx="17" cy="6" r="1"/></svg>`;
const SVG_AUDIO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12"/></svg>`;
const SVG_EYE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;

const SVG_MAP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 380">
  <rect width="820" height="380" fill="#FBFAF7"/>
  <path d="M 30 280 L 120 200 L 200 240 L 300 170 L 420 230 L 540 140 L 660 200 L 760 100" stroke="#D4C4B8" stroke-width="2.5" fill="none" opacity="0.6"/>
  <path d="M 30 320 L 200 220 L 360 290 L 540 170 L 720 240 L 800 140" stroke="#D4C4B8" stroke-width="2" stroke-dasharray="5 5" fill="none" opacity="0.5"/>
  <text x="40" y="40" font-size="10" fill="#999" font-family="Inter,sans-serif">CORDILLERA DE LOS ANDES</text>
  <line x1="100" y1="300" x2="220" y2="280" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="220" y1="280" x2="380" y2="240" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="380" y1="240" x2="510" y2="200" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="510" y1="200" x2="610" y2="170" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="610" y1="170" x2="700" y2="135" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="700" y1="135" x2="755" y2="100" stroke="#722F37" stroke-width="5" stroke-linecap="round"/>
  <line x1="220" y1="280" x2="290" y2="335" stroke="#A855F7" stroke-width="4" stroke-dasharray="6 4" stroke-linecap="round"/>
  <line x1="290" y1="335" x2="430" y2="345" stroke="#A855F7" stroke-width="4" stroke-dasharray="6 4" stroke-linecap="round"/>
  <circle cx="100" cy="300" r="11" fill="white" stroke="#722F37" stroke-width="3"/>
  <text x="106" y="287" font-size="13" font-weight="700" fill="#722F37" font-family="Inter,sans-serif">TIM</text>
  <text x="106" y="324" font-size="10" fill="#666" font-family="Inter,sans-serif">Mendoza · 750 msnm</text>
  <circle cx="220" cy="280" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="228" y="269" font-size="11" font-weight="600" fill="#333" font-family="Inter,sans-serif">Potrerillos</text>
  <text x="228" y="296" font-size="9" fill="#888" font-family="Inter,sans-serif">1.400 msnm · 65 km</text>
  <circle cx="380" cy="240" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="388" y="229" font-size="11" font-weight="600" fill="#333" font-family="Inter,sans-serif">Uspallata</text>
  <text x="388" y="255" font-size="9" fill="#888" font-family="Inter,sans-serif">2.000 msnm · 115 km</text>
  <circle cx="510" cy="200" r="6" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="518" y="194" font-size="10" font-weight="600" fill="#333" font-family="Inter,sans-serif">Penitentes · 2.600</text>
  <circle cx="610" cy="170" r="6" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="618" y="164" font-size="10" font-weight="600" fill="#333" font-family="Inter,sans-serif">Pte. del Inca · 2.700</text>
  <circle cx="700" cy="135" r="7" fill="white" stroke="#722F37" stroke-width="2.5"/>
  <text x="708" y="128" font-size="10" font-weight="700" fill="#722F37" font-family="Inter,sans-serif">Aconcagua · 2.950</text>
  <circle cx="755" cy="100" r="9" fill="#722F37" stroke="#5A2229" stroke-width="2.5"/>
  <text x="640" y="88" font-size="11" font-weight="700" fill="#722F37" font-family="Inter,sans-serif" text-anchor="end">Las Cuevas · 3.150 msnm</text>
  <text x="640" y="100" font-size="9" fill="#888" font-family="Inter,sans-serif" text-anchor="end">Límite con Chile · 198 km</text>
  <circle cx="430" cy="345" r="7" fill="#A855F7" stroke="#7E22CE" stroke-width="2"/>
  <text x="438" y="350" font-size="11" font-weight="700" fill="#7E22CE" font-family="Inter,sans-serif">Las Leñas · 2.240 msnm</text>
  <text x="438" y="364" font-size="9" fill="#888" font-family="Inter,sans-serif">Desvío invernal · 340 km</text>
  <rect x="40" y="60" width="220" height="64" rx="6" fill="white" stroke="#DDDDDD" stroke-width="1"/>
  <text x="52" y="78" font-size="9" font-weight="700" fill="#888" font-family="Inter,sans-serif">REFERENCIAS</text>
  <line x1="52" y1="90" x2="78" y2="90" stroke="#722F37" stroke-width="4"/>
  <text x="84" y="93" font-size="10" fill="#666" font-family="Inter,sans-serif">Ruta Troncal Nacional 7</text>
  <line x1="52" y1="106" x2="60" y2="106" stroke="#A855F7" stroke-width="3" stroke-dasharray="3 3"/>
  <line x1="62" y1="106" x2="70" y2="106" stroke="#A855F7" stroke-width="3" stroke-dasharray="3 3"/>
  <line x1="72" y1="106" x2="78" y2="106" stroke="#A855F7" stroke-width="3" stroke-dasharray="3 3"/>
  <text x="84" y="109" font-size="10" fill="#666" font-family="Inter,sans-serif">Desvío invernal Las Leñas</text>
</svg>`;

// ─── HEADER: TOP BANNER + NAVBAR ─────────────────────────────────────────────
async function _topBanner(F, y) {
  rect(F, 0, y, FW, TOP_BANNER_H, BORGONA_DEEP);
  svgNode(F, SVG_DOT_GREEN, CX, y + 13, 10, 10);
  await txt(F, CX + 16, y + 12, "TIM ACCESIBLE: CONECTIVIDAD CERTIFICADA PARA TODOS LOS PASAJEROS", BOLD, 10, BLANCO);
  await txt(F, FW - CX - 320, y + 12, "Terminal Adaptada • Prioridad de Embarque", REGULAR, 10, ROSA_PALE, { w: 320, align: "RIGHT" });
  return y + TOP_BANNER_H;
}

async function _navbar(F, y, activeId) {
  rect(F, 0, y, FW, NAVBAR_H, BLANCO);
  rect(F, 0, y + NAVBAR_H - 1, FW, 1, GRIS_BORDE);

  // Logo TIM cuadrado borgoña
  rect(F, CX, y + 18, 52, 52, BORGONA, { radius: 10 });
  await txt(F, CX, y + 32, "TIM", EXTRABOLD, 18, BLANCO, { w: 52, align: "CENTER" });
  // Hotspot del logo (cubre logo + label) → HOME
  const homeHs = hotspot(F, CX, y + 12, 360, 64, "hotspot-am-home");
  await txt(F, CX + 68, y + 24, "ALTA MONTAÑA", EXTRABOLD, 18, BORGONA_DEEP);
  await txt(F, CX + 68, y + 48, "TERMINAL INTELIGENTE MENDOZA", MEDIUM, 10, GRIS_M);

  // Pre-medir cada tab para centrarlo
  const widths = [];
  for (const f of FRAMES) {
    const tmp = await txt(F, 0, y + 240, f.label, SEMIBOLD, 14, GRIS);
    widths.push(tmp.width);
    tmp.remove();
  }
  const PILL_HPAD = 18;
  const PILL_GAP = 6;
  let totalW = 0;
  for (let i = 0; i < FRAMES.length; i++) totalW += widths[i] + PILL_HPAD * 2;
  totalW += (FRAMES.length - 1) * PILL_GAP;

  const CTA_W = 152;
  const CTA_X = FW - CX - CTA_W;
  const tabsStart = CX + 360;
  const tabsAvail = CTA_X - 24 - tabsStart;
  const tabsX = tabsStart + Math.max(0, (tabsAvail - totalW) / 2);
  const tabsY = y + (NAVBAR_H - 40) / 2;

  const tabsHs = {};
  let tx = tabsX;
  for (let i = 0; i < FRAMES.length; i++) {
    const f = FRAMES[i];
    const isActive = f.id === activeId;
    const tw = widths[i] + PILL_HPAD * 2;
    if (isActive) {
      rect(F, tx, tabsY, tw, 40, BORGONA, { radius: 10 });
    }
    await txt(F, tx, tabsY + 12, f.label, isActive ? BOLD : SEMIBOLD, 14,
      isActive ? BLANCO : GRIS, { w: tw, align: "CENTER" });
    tabsHs[f.id] = hotspot(F, tx, tabsY, tw, 40, "hotspot-am-tab-" + f.id);
    tx += tw + PILL_GAP;
  }

  // Botón "Ver Horarios"
  rect(F, CTA_X, tabsY, CTA_W, 40, BORGONA, { radius: 10 });
  await txt(F, CTA_X, tabsY + 12, "Ver Horarios", BOLD, 14, BLANCO, { w: CTA_W, align: "CENTER" });
  const ctaHs = hotspot(F, CTA_X, tabsY, CTA_W, 40, "hotspot-am-cta-horarios");

  return { nextY: y + NAVBAR_H, hotspots: { home: homeHs, tabs: tabsHs, cta: ctaHs } };
}

async function _header(F, activeId) {
  let y = 0;
  y = await _topBanner(F, y);
  return await _navbar(F, y, activeId);
}

// ─── FOOTER (compartido) ─────────────────────────────────────────────────────
async function _footer(F, y) {
  const SEC_H = 320;
  rect(F, 0, y, FW, SEC_H, GRIS);
  await txt(F, CX, y + 56, "TIM", EXTRABOLD, 28, BLANCO);
  await txt(F, CX, y + 90, "Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.7 });
  await txt(F, CX, y + 118, "Juan B. Alberdi s/n, M5519", REGULAR, 13, BLANCO, { opacity: 0.85 });
  await txt(F, CX, y + 138, "Guaymallén, Mendoza, Argentina", REGULAR, 13, BLANCO, { opacity: 0.85 });
  await txt(F, CX, y + 168, "Atención 24/7 · 0261 476-5875", REGULAR, 12, BLANCO, { opacity: 0.6 });
  const fcols = [
    { title: "Navegación", items: ["Inicio", "Servicios", "Recorrido", "Mapa", "Horarios", "Accesibilidad", "Contacto"], x: 520 },
    { title: "Servicios",  items: ["Larga Distancia", "Alta Montaña", "Ruta del Vino", "Aeropuerto", "Universitario"], x: 760 },
    { title: "Información",items: ["Llegar a la terminal", "Tarifas", "Política de privacidad", "Términos y condiciones"], x: 1010 }
  ];
  for (const col of fcols) {
    await txt(F, col.x, y + 56, col.title, BOLD, 11, BLANCO, { opacity: 0.9 });
    for (let i = 0; i < col.items.length; i++) {
      await txt(F, col.x, y + 82 + i * 24, col.items[i], REGULAR, 12, BLANCO, { opacity: 0.72 });
    }
  }
  rect(F, CX, y + 260, CW, 1, BLANCO, { opacity: 0.12 });
  await txt(F, CX, y + 276, "© 2026 Nexo Studio · Terminal Inteligente de Mendoza", REGULAR, 11, BLANCO, { opacity: 0.6 });
  await txt(F, 1180, y + 276, "Hecho en Mendoza, Argentina", REGULAR, 11, BLANCO, { opacity: 0.6 });
  return y + SEC_H;
}

// ─── CONTENT 1/7 — INICIO ────────────────────────────────────────────────────
async function _contentInicio(F, y) {
  const H = 620;
  rect(F, 0, y, FW, H, BORGONA_DEEP);
  const cord = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none"><path d="M0 380 L160 220 L320 320 L500 180 L700 310 L900 200 L1100 290 L1280 170 L1440 280 L1440 400 L0 400 Z" fill="#5A2229" opacity="0.55"/><path d="M0 400 L240 280 L480 360 L720 270 L960 350 L1200 260 L1440 340 L1440 400 Z" fill="#722F37" opacity="0.65"/></svg>`;
  svgNode(F, cord, 0, y + H - 160, FW, 160);

  // Panel del Aconcagua (derecha)
  rect(F, 900, y + 60, 460, 420, BORGONA_DARK, { radius: 20, opacity: 0.55 });
  rect(F, 900, y + 60, 460, 420, null, { radius: 20, stroke: BLANCO, sw: 1, opacity: 0.18 });
  svgNode(F, SVG_SHIELD, 920, y + 82, 22, 22);
  await txt(F, 950, y + 86, "OPERANDO NORMALMENTE", BOLD, 10, "7FFF7F");
  rect(F, 1230, y + 80, 110, 24, BLANCO, { radius: 12, opacity: 0.1 });
  await txt(F, 1230, y + 86, "Ruta Nac. 7", BOLD, 10, BLANCO, { w: 110, align: "CENTER" });
  const paisaje = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" preserveAspectRatio="none"><rect width="400" height="200" fill="#3A1116"/><path d="M0 200 L100 80 L220 150 L310 50 L400 200 Z" fill="#722F37" opacity="0.55"/><path d="M50 200 L180 100 L300 170 L400 90 L400 200 Z" fill="#5A2229" opacity="0.7"/><path d="M20 180 Q 150 160 180 120 T 300 80 T 380 40" stroke="#F5EAEB" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="180" cy="120" r="5" fill="#FFC2C7"/><circle cx="300" cy="80" r="4" fill="#FFFFFF"/></svg>`;
  rect(F, 920, y + 120, 420, 180, BORGONA_DEEP, { radius: 12 });
  svgNode(F, paisaje, 920, y + 120, 420, 180);
  rect(F, 940, y + 254, 220, 38, BORGONA_DEEP, { radius: 8, opacity: 0.8 });
  await txt(F, 952, y + 260, "DESTINO ICÓNICO", BOLD, 9, ROSA_PALE);
  await txt(F, 952, y + 274, "Cerro Aconcagua (6.961 m)", BOLD, 12, BLANCO);
  const panelRows = [
    ["Origen",         "TIM (Mendoza Capital)"],
    ["Destino Extremo","Las Cuevas / Las Leñas"],
    ["Seguridad",      "Alta Tracción & WiFi"]
  ];
  for (let i = 0; i < panelRows.length; i++) {
    const py = y + 318 + i * 36;
    await txt(F, 920, py, panelRows[i][0], REGULAR, 12, BLANCO, { opacity: 0.6 });
    await txt(F, 1140, py, panelRows[i][1], BOLD, 12, BLANCO, { w: 200, align: "RIGHT" });
    rect(F, 920, py + 22, 420, 1, BLANCO, { opacity: 0.08 });
  }

  // Lado izquierdo
  rect(F, CX, y + 60, 320, 36, BORGONA_DARK, { radius: 100 });
  rect(F, CX, y + 60, 320, 36, null, { radius: 100, stroke: BLANCO, sw: 1, opacity: 0.18 });
  svgNode(F, SVG_COMPASS, CX + 12, y + 69, 18, 18);
  await txt(F, CX + 38, y + 70, "Servicio Interurbano de Pasajeros", MEDIUM, 12, ROSA_PALE);

  await txt(F, CX, y + 116, "LÍNEA 2 · CORDILLERA", BOLD, 13, BLANCO, { opacity: 0.7 });
  await txt(F, CX, y + 146, "Alta Montaña", EXTRABOLD, 64, BLANCO);
  await txt(F, CX, y + 234, "Conectá Mendoza con la imponente Cordillera de los Andes.", MEDIUM, 19, ROSA_PALE);
  const sub = await txt(F, CX, y + 272,
    "Viajá desde la Terminal Inteligente de Mendoza (TIM) hacia los principales destinos de alta montaña. Salidas garantizadas, unidades 100% accesibles y recorridos perfectos para turistas, residentes y trabajadores cordilleranos.",
    REGULAR, 14, BLANCO, { opacity: 0.85 });
  sub.textAutoResize = "HEIGHT";
  sub.resize(760, sub.height);

  rect(F, CX, y + 380, 220, 50, BLANCO, { radius: 12 });
  svgNode(F, SVG_CLOCK, CX + 22, y + 394, 22, 22);
  await txt(F, CX + 50, y + 396, "Ver Horarios de Salida", BOLD, 14, BORGONA_DEEP);
  rect(F, CX + 234, y + 380, 240, 50, null, { radius: 12, stroke: BLANCO, sw: 1.5, opacity: 0.4 });
  svgNode(F, SVG_MAPPIN_W, CX + 256, y + 394, 22, 22);
  await txt(F, CX + 284, y + 396, "Ver Paradas y Recorrido", BOLD, 14, BLANCO);

  rect(F, CX, y + 460, 760, 1, BLANCO, { opacity: 0.2 });
  const metrics = [
    ["SALIDAS",   "Diarias"],
    ["DESTINOS",  "Turísticos"],
    ["INCLUSIÓN", "100% Accesible"],
    ["RECORRIDO", "Interurbano"]
  ];
  const mw = 190;
  for (let i = 0; i < metrics.length; i++) {
    const mx = CX + i * mw;
    rect(F, mx, y + 484, 36, 36, BORGONA_DARK, { radius: 8 });
    svgNode(F, SVG_MOUNTAIN, mx + 8, y + 492, 20, 20);
    await txt(F, mx + 48, y + 488, metrics[i][0], BOLD, 10, ROSA_PALE);
    await txt(F, mx + 48, y + 504, metrics[i][1], BOLD, 15, BLANCO);
  }
  return y + H;
}

// ─── CONTENT 2/7 — SERVICIOS ─────────────────────────────────────────────────
const SERVICIOS = [
  { svg: SVG_BUS,       title: "Transporte Interurbano",
    desc: "Micros de alta gama, calefaccionados y especialmente diseñados para circular de forma segura por las pendientes de la Ruta 7." },
  { svg: SVG_GLOBE,     title: "Conexión Turística",
    desc: "Vías directas a los miradores, zonas hoteleras, senderos de trekking y centros termales de la cordillera." },
  { svg: SVG_ROUTE,     title: "Ruta de los Andes",
    desc: "Más de 200 km de conectividad de montaña en un trayecto seguro hacia el límite internacional con Chile." },
  { svg: SVG_HANDSHAKE, title: "Servicio Accesible",
    desc: "Asistencia en embarque, plataformas niveladas, rampas y un plan de acción para viajeros de movilidad reducida." }
];

async function _contentServicios(F, y) {
  const CARD_W = Math.floor((CW - 3 * 24) / 4);
  const CARD_H = 220;
  const BANNER_H = 170;
  const SEC_H = 80 + 130 + CARD_H + 48 + BANNER_H + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "01 · Información del Transporte", "Terminal Inteligente de Mendoza (TIM)",
    "Servicio público interurbano optimizado para conectar la gran urbe con los rincones más altos e imponentes de la cordillera mendocina.");
  cy += 24;
  for (let i = 0; i < SERVICIOS.length; i++) {
    const s = SERVICIOS[i];
    const cx = CX + i * (CARD_W + 24);
    rect(F, cx, cy, CARD_W, CARD_H, GRIS_BG, { radius: 16, stroke: GRIS_BORDE, sw: 1 });
    rect(F, cx + 24, cy + 24, 48, 48, BORGONA_LIGHT, { radius: 12 });
    svgNode(F, s.svg, cx + 36, cy + 36, 24, 24);
    await txt(F, cx + 24, cy + 92, s.title, BOLD, 16, BORGONA_DEEP);
    const desc = await txt(F, cx + 24, cy + 118, s.desc, REGULAR, 13, GRIS_M);
    desc.textAutoResize = "HEIGHT";
    desc.resize(CARD_W - 48, desc.height);
  }
  cy += CARD_H + 48;
  rect(F, CX, cy, CW, BANNER_H, BORGONA_LIGHT, { radius: 24, stroke: BORGONA_LIGHT, sw: 1 });
  await txt(F, CX + 40, cy + 30, "Un viaje seguro, sin importar la altitud", BOLD, 22, BORGONA_DEEP);
  const bDesc = await txt(F, CX + 40, cy + 70,
    "El servicio de Alta Montaña conecta Mendoza con paisajes naturales, zonas turísticas y puntos clave de la cordillera, facilitando el traslado seguro hacia destinos de alto valor histórico, recreativo y paisajístico.",
    REGULAR, 13, GRIS);
  bDesc.textAutoResize = "HEIGHT";
  bDesc.resize(720, bDesc.height);
  const chips = ["Potrerillos", "Uspallata", "Aconcagua", "Las Leñas"];
  let chx = CX + 40;
  for (const c of chips) {
    const lt = await txt(F, chx + 22, cy + 130, c, BOLD, 12, BORGONA_DEEP);
    const cw = 22 + lt.width + 18;
    lt.remove();
    rect(F, chx, cy + 122, cw, 28, BLANCO, { radius: 100, stroke: BORGONA_LIGHT, sw: 1 });
    rect(F, chx + 8, cy + 132, 8, 8, VERDE_DOT, { radius: 4 });
    await txt(F, chx + 22, cy + 130, c, BOLD, 12, BORGONA_DEEP);
    chx += cw + 8;
  }
  rect(F, CX + CW - 220, cy + 60, 180, 48, BORGONA, { radius: 12 });
  await txt(F, CX + CW - 220, cy + 75, "Preguntas Frecuentes", BOLD, 14, BLANCO, { w: 180, align: "CENTER" });
  return y + SEC_H;
}

// ─── CONTENT 3/7 — RECORRIDO ─────────────────────────────────────────────────
const PARADAS = [
  { n: 1, title: "Terminal Inteligente de Mendoza", sub: "Gran Mendoza · Guaymallén",
    alt: "750 msnm", dist: "0 km (Origen)", type: "Cabecera de Línea", origen: true },
  { n: 2, title: "Dique Potrerillos", sub: "Valle de Luján de Cuyo / Las Heras",
    alt: "1.400 msnm", dist: "65 km de TIM", type: "Parada Intermedia" },
  { n: 3, title: "Uspallata", sub: "Las Heras",
    alt: "2.000 msnm", dist: "115 km de TIM", type: "Estación de Descanso" },
  { n: 4, title: "Penitentes", sub: "Valle de Las Cuevas",
    alt: "2.600 msnm", dist: "170 km de TIM", type: "Parada de Montaña" },
  { n: 5, title: "Puente del Inca", sub: "Monumento Natural Protegido",
    alt: "2.700 msnm", dist: "183 km de TIM", type: "Hito Turístico" },
  { n: 6, title: "Parque Provincial Aconcagua", sub: "Reserva Natural · Cerro Aconcagua",
    alt: "2.950 msnm", dist: "185 km de TIM", type: "Parque Nacional" },
  { n: 7, title: "Las Cuevas", sub: "Límite Fronterizo Internacional",
    alt: "3.150 msnm", dist: "198 km de TIM", type: "Frontera Terminal", terminal: true },
  { n: 8, title: "Las Leñas", sub: "Malargüe · Conexión Invernal",
    alt: "2.240 msnm", dist: "340 km de TIM", type: "Hito Invernal · Desvío", desvio: true }
];

async function _contentRecorrido(F, y) {
  const CARD_W = Math.floor((CW - 3 * 20) / 4);
  const CARD_H = 198;
  const SEC_H = 80 + 130 + 2 * (CARD_H + 24) + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "02 · Explorador Interactivo", "Estaciones y paradas de Alta Montaña",
    "Ocho paradas entre Mendoza y la frontera con Chile, más el desvío invernal hacia Las Leñas. Tiempos estimados desde la Terminal TIM.");
  cy += 24;
  for (let i = 0; i < PARADAS.length; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const p = PARADAS[i];
    const cx = CX + col * (CARD_W + 20);
    const ccy = cy + row * (CARD_H + 24);
    const accent = p.desvio ? MORADO : BORGONA;
    rect(F, cx, ccy, CARD_W, CARD_H, BLANCO, { radius: 14, stroke: GRIS_BORDE, sw: 1 });
    rect(F, cx, ccy, CARD_W, 4, accent, { radius: 2 });
    rect(F, cx + 20, ccy + 24, 36, 36,
      p.origen ? BORGONA : (p.desvio ? MORADO_LIGHT : BORGONA_LIGHT), { radius: 18 });
    await txt(F, cx + 20, ccy + 33, String(p.n), BOLD, 16,
      p.origen ? BLANCO : (p.desvio ? MORADO_DARK : BORGONA),
      { w: 36, align: "CENTER" });
    rect(F, cx + CARD_W - 20 - 86, ccy + 28, 86, 22,
      p.desvio ? MORADO_LIGHT : BORGONA_LIGHT, { radius: 4 });
    await txt(F, cx + CARD_W - 20 - 86, ccy + 33,
      p.origen ? "ORIGEN" : (p.desvio ? "DESVÍO" : (p.terminal ? "TERMINAL" : "INTERMEDIA")),
      BOLD, 9, p.desvio ? MORADO_DARK : BORGONA, { w: 86, align: "CENTER" });
    await txt(F, cx + 20, ccy + 70, p.title, BOLD, 15, GRIS, { w: CARD_W - 40 });
    await txt(F, cx + 20, ccy + 90, p.sub, REGULAR, 11, GRIS_S, { w: CARD_W - 40 });
    rect(F, cx + 20, ccy + 124, CARD_W - 40, 1, GRIS_BORDE);
    await txt(F, cx + 20, ccy + 134, "ALTITUD", BOLD, 9, GRIS_S);
    await txt(F, cx + 20, ccy + 148, p.alt, BOLD, 13, p.desvio ? MORADO_DARK : BORGONA);
    await txt(F, cx + CARD_W / 2, ccy + 134, "DISTANCIA", BOLD, 9, GRIS_S);
    await txt(F, cx + CARD_W / 2, ccy + 148, p.dist, BOLD, 13, GRIS);
    await txt(F, cx + 20, ccy + CARD_H - 28, p.type, MEDIUM, 11, GRIS_M);
  }
  return y + SEC_H;
}

// ─── CONTENT 4/7 — MAPA ──────────────────────────────────────────────────────
async function _contentMapa(F, y) {
  const MAP_H = 380;
  const INFO_W = CW - 840 - 24;
  const SEC_H = 80 + 130 + MAP_H + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "03 · Trazado del Recorrido", "Mapa de Ruta y Conexión de Alta Montaña",
    "Trayecto principal: Terminal TIM → Potrerillos → Uspallata → Penitentes → Puente del Inca → Aconcagua → Las Cuevas. Desvío invernal hacia Las Leñas.");
  cy += 24;
  rect(F, CX, cy, 840, MAP_H, "FBFAF7", { radius: 12, stroke: BORDE, sw: 1 });
  svgNode(F, SVG_MAP, CX, cy, 840, MAP_H);
  const ix = CX + 840 + 24;
  rect(F, ix, cy, INFO_W, 180, BORGONA_LIGHT, { radius: 12, stroke: BORGONA, sw: 1 });
  await txt(F, ix + 22, cy + 20, "TRAYECTO RUTA 7", BOLD, 10, BORGONA);
  await txt(F, ix + 22, cy + 42, "≈ 198 km", BOLD, 24, GRIS);
  const rrDesc = await txt(F, ix + 22, cy + 78,
    "Desde la Terminal TIM hasta Las Cuevas, paso a paso por los hitos cordilleranos más importantes de Mendoza.",
    REGULAR, 13, GRIS_M);
  rrDesc.textAutoResize = "HEIGHT";
  rrDesc.resize(INFO_W - 44, rrDesc.height);
  rect(F, ix + 22, cy + 140, INFO_W - 44, 30, BLANCO, { radius: 6, stroke: BORDE, sw: 1 });
  await txt(F, ix + 22, cy + 148, "Frontera Internacional con Chile", SEMIBOLD, 11, GRIS, { w: INFO_W - 44, align: "CENTER" });
  rect(F, ix, cy + 192, INFO_W, MAP_H - 192, BLANCO, { radius: 12, stroke: BORDE, sw: 1 });
  rect(F, ix, cy + 192, 4, MAP_H - 192, MORADO, { radius: 2 });
  await txt(F, ix + 22, cy + 212, "DESVÍO INVERNAL", BOLD, 10, MORADO_DARK);
  await txt(F, ix + 22, cy + 230, "Las Leñas · 340 km", BOLD, 17, GRIS);
  const rows = [
    ["Origen",    "TIM Mendoza"],
    ["Tránsito",  "San Rafael / Malargüe"],
    ["Destino",   "Centro Las Leñas"],
    ["Temporada", "Junio – Septiembre"]
  ];
  for (let hi = 0; hi < rows.length; hi++) {
    const hy = cy + 264 + hi * 26;
    await txt(F, ix + 22, hy, rows[hi][0], REGULAR, 12, GRIS_M);
    await txt(F, ix + INFO_W - 22 - 140, hy, rows[hi][1], SEMIBOLD, 12, GRIS, { w: 140, align: "RIGHT" });
  }
  return y + SEC_H;
}

// ─── CONTENT 5/7 — HORARIOS ──────────────────────────────────────────────────
const HORARIOS = [
  { emp: "Andesmar (01)",          dep: "05:55", dest: "Las Cuevas / Alta Montaña",  freq: "Según destino (Diario)", status: "Disponible",      kind: "ok" },
  { emp: "Cata Internacional (04)", dep: "07:00", dest: "Uspallata / Pte. del Inca",  freq: "Según destino (L a D)",  status: "A horario",       kind: "info" },
  { emp: "Buttini (12)",           dep: "10:15", dest: "Las Cuevas",                 freq: "Frecuencia Diaria",       status: "Disponible",      kind: "ok" },
  { emp: "Iselin (02)",            dep: "15:30", dest: "Puente del Inca",            freq: "Frecuencia Diaria",       status: "Últimos lugares", kind: "warn" },
  { emp: "Andesmar Especial (02)", dep: "20:00", dest: "Uspallata",                  freq: "Refuerzo Nocturno",       status: "A horario",       kind: "info" }
];

async function _contentHorarios(F, y) {
  const SEARCH_H = 64;
  const headerH = 50;
  const rowH = 64;
  const TABLE_H = headerH + HORARIOS.length * rowH;
  const NOTE_H = 80;
  const SEC_H = 80 + 130 + SEARCH_H + 24 + TABLE_H + 32 + NOTE_H + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "04 · Salidas Programadas", "Horarios del Servicio Interurbano",
    "Salidas diarias desde los andenes principales de TIM hacia los parajes de la Cordillera. Horarios de referencia sujetos a clima y operatividad de la Ruta 7.");
  cy += 24;
  rect(F, CX, cy, CW, SEARCH_H, BLANCO, { radius: 16, stroke: GRIS_BORDE, sw: 1 });
  rect(F, CX + 20, cy + 14, 360, 36, GRIS_BG, { radius: 8, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, CX + 36, cy + 22, "Buscar destino, micro o estado…", REGULAR, 13, GRIS_S);
  const filters = ["Todos los micros", "Las Cuevas", "Uspallata", "Puente del Inca"];
  let fx = CX + CW - 20;
  for (let i = filters.length - 1; i >= 0; i--) {
    const lbl = filters[i];
    const lt = await txt(F, 0, 0, lbl, BOLD, 11, BLANCO);
    const fw = lt.width + 28;
    lt.remove();
    fx -= fw;
    rect(F, fx, cy + 14, fw, 36, i === 0 ? BORGONA : GRIS_BG, { radius: 8, stroke: i === 0 ? BORGONA : GRIS_BORDE, sw: 1 });
    await txt(F, fx, cy + 25, lbl, BOLD, 11, i === 0 ? BLANCO : GRIS, { w: fw, align: "CENTER" });
    fx -= 8;
  }
  cy += SEARCH_H + 24;
  rect(F, CX, cy, CW, TABLE_H, BLANCO, { radius: 16, stroke: GRIS_BORDE, sw: 1 });
  rect(F, CX, cy, CW, headerH, BORGONA_DEEP, { radius: 16 });
  rect(F, CX, cy + headerH - 12, CW, 12, BORGONA_DEEP);
  const heads = ["Micro", "Horario", "Destino", "Frecuencia", "Estado", "Reserva"];
  const colW = [260, 130, 290, 230, 220, 150];
  let hx = CX + 20;
  for (let i = 0; i < heads.length; i++) {
    await txt(F, hx, cy + 18, heads[i], BOLD, 10, BLANCO);
    hx += colW[i];
  }
  for (let ri = 0; ri < HORARIOS.length; ri++) {
    const row = HORARIOS[ri];
    const ry = cy + headerH + ri * rowH;
    if (ri > 0) rect(F, CX + 20, ry, CW - 40, 1, GRIS_BORDE);
    let rx = CX + 20;
    rect(F, rx, ry + 20, 24, 24, BORGONA_LIGHT, { radius: 6 });
    svgNode(F, SVG_BUS, rx + 4, ry + 24, 16, 16);
    await txt(F, rx + 32, ry + 24, row.emp, BOLD, 13, BORGONA_DEEP); rx += colW[0];
    await txt(F, rx, ry + 22, row.dep + " hs", BOLD, 15, GRIS); rx += colW[1];
    await txt(F, rx, ry + 24, row.dest, MEDIUM, 13, GRIS); rx += colW[2];
    await txt(F, rx, ry + 24, row.freq, REGULAR, 12, GRIS_M); rx += colW[3];
    let stBg = VERDE_BG, stFg = VERDE_FG;
    if (row.kind === "warn") { stBg = AMBAR_BG; stFg = AMBAR_FG; }
    else if (row.kind === "info") { stBg = AZUL_BG; stFg = AZUL_FG; }
    rect(F, rx, ry + 18, 120, 28, stBg, { radius: 12, stroke: stFg, sw: 1, opacity: 0.6 });
    rect(F, rx + 10, ry + 30, 8, 8, stFg, { radius: 4 });
    await txt(F, rx + 22, ry + 25, row.status, BOLD, 11, stFg);
    rx += colW[4];
    rect(F, rx, ry + 16, 110, 32, BORGONA, { radius: 8 });
    await txt(F, rx, ry + 25, "Reservar", BOLD, 12, BLANCO, { w: 110, align: "CENTER" });
  }
  cy += TABLE_H + 32;
  rect(F, CX, cy, CW, NOTE_H, BORGONA_LIGHT, { radius: 16, stroke: BORGONA, sw: 1 });
  rect(F, CX, cy, 4, NOTE_H, BORGONA, { radius: 2 });
  svgNode(F, SVG_INFO, CX + 24, cy + 22, 24, 24);
  await txt(F, CX + 64, cy + 18, "Operatividad del servicio en cordillera", BOLD, 14, BORGONA_DEEP);
  const nDesc = await txt(F, CX + 64, cy + 40,
    "La frecuencia varía según destino, temporada de nieve, estado de las rutas internacionales y disponibilidad del operador. Los horarios pueden sufrir variaciones por clima o factores viales en tramos elevados.",
    REGULAR, 12, GRIS_M);
  nDesc.textAutoResize = "HEIGHT";
  nDesc.resize(CW - 100, nDesc.height);
  return y + SEC_H;
}

// ─── CONTENT 6/7 — ACCESIBILIDAD ─────────────────────────────────────────────
const ACCES = [
  { svg: SVG_RAMP,       title: "Rampas de acceso",
    desc: "Rampas plegables de alta tracción en unidades y plataformas TIM para ingreso/egreso de personas con movilidad reducida." },
  { svg: SVG_WHEELCHAIR, title: "Espacios para silla de ruedas",
    desc: "Sectores reservados por unidad con cinturones de sujeción anclados al chasis para viajes seguros en pendiente." },
  { svg: SVG_TOILET,     title: "Baños Adaptados",
    desc: "Cabinas en cabecera y paradas troncales con barras de apoyo, alarma de pánico y espacio óptimo de giro." },
  { svg: SVG_BRAILLE,    title: "Tipografía y Braille",
    desc: "Cartelería de alto contraste legible a distancia y placas Braille oficiales en pasamanos de accesos clave." },
  { svg: SVG_AUDIO,      title: "Información Sonora Activa",
    desc: "Altavoces de alta fidelidad con avisos de partidas, demoras por clima en cordillera, andenes y asistencia." },
  { svg: SVG_EYE,        title: "Contraste Visual Diseñado",
    desc: "Esquemas de interfaz web y tótems en terminal cumplen parámetros estrictos de contraste cromático para baja visión." }
];

async function _contentAccesibilidad(F, y) {
  const CARD_W = Math.floor((CW - 2 * 24) / 3);
  const CARD_H = 178;
  const CTA_H = 120;
  const SEC_H = 80 + 130 + 2 * (CARD_H + 24) + 48 + CTA_H + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "05 · TIM para todos", "Características de Accesibilidad",
    "El servicio de Alta Montaña está diseñado con un fuerte compromiso inclusivo, para que todas las personas viajen de forma segura, autónoma y cómoda.");
  cy += 24;
  for (let i = 0; i < ACCES.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const a = ACCES[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 24);
    rect(F, cx, ccy, CARD_W, CARD_H, GRIS_BG, { radius: 16, stroke: GRIS_BORDE, sw: 1 });
    rect(F, cx + 24, ccy + 24, 52, 52, BORGONA_LIGHT, { radius: 14 });
    svgNode(F, a.svg, cx + 38, ccy + 38, 24, 24);
    await txt(F, cx + 92, ccy + 28, a.title, BOLD, 15, BORGONA_DEEP, { w: CARD_W - 116 });
    const desc = await txt(F, cx + 92, ccy + 54, a.desc, REGULAR, 12, GRIS_M);
    desc.textAutoResize = "HEIGHT";
    desc.resize(CARD_W - 116, desc.height);
  }
  cy += 2 * (CARD_H + 24) + 24;
  rect(F, CX, cy, CW, CTA_H, BORGONA_DEEP, { radius: 24 });
  rect(F, CX, cy, CW, CTA_H, BORGONA, { radius: 24, opacity: 0.6 });
  await txt(F, CX + 40, cy + 22, "SERVICIO DE ACOMPAÑAMIENTO", BOLD, 10, ROSA_PALE);
  await txt(F, CX + 40, cy + 42, "¿Necesitás asistencia personalizada?", BOLD, 22, BLANCO);
  await txt(F, CX + 40, cy + 76,
    "Coordiná tu viaje con anticipación y un agente de TIM te esperará en plataforma para ayudarte en el abordaje y tu ubicación.",
    REGULAR, 13, BLANCO, { opacity: 0.85, w: 780 });
  rect(F, CX + CW - 240, cy + 38, 220, 52, BLANCO, { radius: 12 });
  await txt(F, CX + CW - 240, cy + 54, "Solicitar Asistencia Ahora", BOLD, 14, BORGONA_DEEP, { w: 220, align: "CENTER" });
  return y + SEC_H;
}

// ─── CONTENT 7/7 — CONTACTO ──────────────────────────────────────────────────
async function _contentContacto(F, y) {
  const COL_GAP = 24;
  const LEFT_W = Math.floor(CW * 7 / 12) - COL_GAP / 2;
  const RIGHT_W = CW - LEFT_W - COL_GAP;
  const FORM_H = 460;
  const SEC_H = 80 + 130 + FORM_H + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 80;
  cy = await sectionHeading(F, cy, "06 · Contacto", "Comunicate con Alta Montaña",
    "Asistencia exclusiva para pasajeros del corredor cordillerano. Atención telefónica 24/7 desde las oficinas centrales de TIM.");
  cy += 24;
  // Formulario izq.
  rect(F, CX, cy, LEFT_W, FORM_H, BLANCO, { radius: 24, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, CX + 32, cy + 32, "Envianos tu consulta o sugerencia", BOLD, 20, BORGONA_DEEP);
  await txt(F, CX + 32, cy + 64,
    "Comunicate con las oficinas centrales del Servicio de Alta Montaña. Te respondemos en menos de 12 horas.",
    REGULAR, 13, GRIS_M, { w: LEFT_W - 64 });
  const inputs = [
    { label: "NOMBRE COMPLETO", hint: "Tu nombre" },
    { label: "CORREO ELECTRÓNICO", hint: "ejemplo@correo.com" }
  ];
  for (let i = 0; i < inputs.length; i++) {
    const ww = (LEFT_W - 64 - 12) / 2;
    const xx = CX + 32 + i * (ww + 12);
    await txt(F, xx, cy + 116, inputs[i].label, BOLD, 10, GRIS_S);
    rect(F, xx, cy + 132, ww, 44, BLANCO, { radius: 10, stroke: GRIS_BORDE, sw: 1 });
    await txt(F, xx + 14, cy + 146, inputs[i].hint, REGULAR, 13, GRIS_S);
  }
  await txt(F, CX + 32, cy + 196, "ASUNTO DE CONSULTA", BOLD, 10, GRIS_S);
  rect(F, CX + 32, cy + 212, LEFT_W - 64, 44, BLANCO, { radius: 10, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, CX + 46, cy + 226, "Estado de Ruta 7 y Operatividad", REGULAR, 13, GRIS);
  await txt(F, CX + LEFT_W - 64 - 12, cy + 226, "▾", BOLD, 13, GRIS_M);
  await txt(F, CX + 32, cy + 274, "MENSAJE O DETALLE", BOLD, 10, GRIS_S);
  rect(F, CX + 32, cy + 290, LEFT_W - 64, 90, BLANCO, { radius: 10, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, CX + 46, cy + 304, "Escribí aquí tu consulta sobre horarios, equipaje, etc…", REGULAR, 13, GRIS_S);
  rect(F, CX + 32, cy + 400, LEFT_W - 64, 44, BORGONA, { radius: 10 });
  await txt(F, CX + 32, cy + 412, "Enviar Mensaje de Consulta", BOLD, 14, BLANCO, { w: LEFT_W - 64, align: "CENTER" });

  // Card derecha — Central + FAQs
  const rx = CX + LEFT_W + COL_GAP;
  const PHONE_H = 260;
  rect(F, rx, cy, RIGHT_W, PHONE_H, BORGONA_DEEP, { radius: 24 });
  await txt(F, rx + 32, cy + 32, "Central Telefónica de Alta Montaña", BOLD, 17, BLANCO, { w: RIGHT_W - 64 });
  await txt(F, rx + 32, cy + 60, "Asistencia exclusiva para pasajeros del corredor cordillerano.",
    REGULAR, 12, ROSA_PALE, { w: RIGHT_W - 64 });
  rect(F, rx + 32, cy + 92, RIGHT_W - 64, 1, BLANCO, { opacity: 0.1 });
  const contacts = [
    { svg: SVG_PHONE_W,   label: "Atención telefónica",            value: "0261 476 5875" },
    { svg: SVG_CLOCK_W,   label: "Horario de atención central",    value: "Lunes a Domingos, las 24 horas" },
    { svg: SVG_MAPPIN_W,  label: "Oficina principal",              value: "Andén 12, Terminal de Mendoza" }
  ];
  for (let i = 0; i < contacts.length; i++) {
    const cy2 = cy + 112 + i * 48;
    rect(F, rx + 32, cy2, 36, 36, BORGONA_DARK, { radius: 8 });
    svgNode(F, contacts[i].svg, rx + 40, cy2 + 8, 20, 20);
    await txt(F, rx + 80, cy2, contacts[i].label, REGULAR, 11, BLANCO, { opacity: 0.6 });
    await txt(F, rx + 80, cy2 + 16, contacts[i].value, BOLD, 13, BLANCO);
  }
  const FAQ_Y = cy + PHONE_H + 16;
  const FAQ_H = FORM_H - PHONE_H - 16;
  rect(F, rx, FAQ_Y, RIGHT_W, FAQ_H, BLANCO, { radius: 24, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, rx + 32, FAQ_Y + 24, "Preguntas Frecuentes", BOLD, 16, BORGONA_DEEP);
  const faqs = [
    { q: "¿Qué pasa si cierran el Paso Internacional?",
      a: "El micro circulará solo hasta la última parada segura habilitada por Gendarmería (Uspallata o Puente del Inca)." },
    { q: "¿Se paga adicional por silla de ruedas o equipaje extra?",
      a: "No. Las sillas, andadores y equipamiento de asistencia viajan con tarifa cero, por reglamentación de TIM." }
  ];
  let fy = FAQ_Y + 56;
  for (const f of faqs) {
    rect(F, rx + 24, fy, RIGHT_W - 48, 70, GRIS_BG, { radius: 12, stroke: GRIS_BORDE, sw: 1 });
    await txt(F, rx + 40, fy + 12, f.q, BOLD, 12, BORGONA_DEEP, { w: RIGHT_W - 80 });
    const at = await txt(F, rx + 40, fy + 32, f.a, REGULAR, 11, GRIS_M);
    at.textAutoResize = "HEIGHT";
    at.resize(RIGHT_W - 80, at.height);
    fy += 82;
  }
  return y + SEC_H;
}

// ─── BUILD A SINGLE FRAME ────────────────────────────────────────────────────
const CONTENT_FNS = {
  inicio:        _contentInicio,
  servicios:     _contentServicios,
  recorrido:     _contentRecorrido,
  mapa:          _contentMapa,
  horarios:      _contentHorarios,
  accesibilidad: _contentAccesibilidad,
  contacto:      _contentContacto
};

async function buildFrame(page, frameDef, x) {
  page.findChildren(n => n.name === frameDef.name).forEach(n => n.remove());

  const F = figma.createFrame();
  F.name = frameDef.name;
  F.x = x; F.y = 0;
  F.resize(FW, 100);
  F.fills = [{ type: "SOLID", color: hexRGB(BLANCO) }];
  F.clipsContent = false;
  page.appendChild(F);

  const head = await _header(F, frameDef.id);
  const contentFn = CONTENT_FNS[frameDef.id];
  let y = await contentFn(F, head.nextY);
  y = await _footer(F, y);
  F.resize(FW, y);
  return { frame: F, hotspots: head.hotspots };
}

// ─── PROTOTYPE WIRING ────────────────────────────────────────────────────────
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

function wireAll(frames, homeFrame) {
  const ids = FRAMES.map(f => f.id);
  let count = 0;
  for (const fromId of ids) {
    const src = frames[fromId];
    if (!src) continue;
    for (const toId of ids) {
      const dst = frames[toId];
      if (!dst) continue;
      const hs = src.hotspots.tabs[toId];
      if (hs && makeNav(hs, dst.frame.id)) count++;
    }
    if (src.hotspots.cta && frames.horarios) {
      if (makeNav(src.hotspots.cta, frames.horarios.frame.id)) count++;
    }
    if (homeFrame && src.hotspots.home) {
      if (makeNav(src.hotspots.home, homeFrame.id)) count++;
    }
  }
  post({ type: "log", text: "  Conexiones tabs+CTA+home: " + count });

  if (!homeFrame || !frames.inicio) return;
  let linkedHome = 0;
  const homeHotspot = homeFrame.findOne(n => n.name === "hotspot-nav-am");
  if (homeHotspot) {
    if (makeNav(homeHotspot, frames.inicio.frame.id)) linkedHome++;
    post({ type: "log", text: "  HOME → AM via hotspot nombrado: " + linkedHome });
  }
  const textNodes = homeFrame.findAll(n => n.type === "TEXT" && n.characters === "Alta Montaña");
  post({ type: "log", text: "  HOME: text nodes 'Alta Montaña' encontrados: " + textNodes.length });
  for (const n of textNodes) {
    if (makeNav(n, frames.inicio.frame.id)) linkedHome++;
  }
  if (linkedHome === 0) {
    post({ type: "log", text: "  Creando hotspot fallback en HOME navbar..." });
    const hs = figma.createRectangle();
    hs.name = "hotspot-nav-am";
    hs.fills = [];
    hs.opacity = 0.01;
    hs.x = 490; hs.y = 16;
    hs.resize(110, 52);
    homeFrame.appendChild(hs);
    if (makeNav(hs, frames.inicio.frame.id)) {
      post({ type: "log", text: "  Hotspot fallback creado: OK" });
    }
  } else {
    post({ type: "log", text: "  HOME → AM (INICIO): " + linkedHome + " conexion(es)" });
  }
}

// ─── BUILD ALL ───────────────────────────────────────────────────────────────
async function buildAll() {
  const page = figma.root.children.find(p => p.name === PAGE_NAME);
  if (!page) {
    figma.ui.postMessage({ type: "error", text: "Página '" + PAGE_NAME + "' no encontrada. Ejecutá primero el plugin HOME." });
    return;
  }
  figma.currentPage = page;

  // Tambien borrar el frame viejo "ALTA MONTAÑA — TIM" si existe (de la version single-frame)
  page.findChildren(n => n.name === "ALTA MONTAÑA — TIM").forEach(n => n.remove());

  const ownNames = new Set(FRAMES.map(f => f.name));
  let anchorFrame = null;
  let maxRight = -Infinity;
  for (const child of page.children) {
    if (child.type !== "FRAME") continue;
    if (ownNames.has(child.name)) continue;
    const right = child.x + child.width;
    if (right > maxRight) {
      maxRight = right;
      anchorFrame = child;
    }
  }
  const baseX = anchorFrame ? anchorFrame.x + anchorFrame.width + 120 : 1560;
  const dx = FW + 120;
  post({ type: "log", text: "📐 Anclaje: " + (anchorFrame ? anchorFrame.name : "ninguno") + " termina en x=" + maxRight });
  post({ type: "log", text: "📐 Primer frame (INICIO) en x=" + baseX });

  const built = {};
  for (let i = 0; i < FRAMES.length; i++) {
    const def = FRAMES[i];
    const fx = baseX + i * dx;
    post({ type: "log", text: "🏗️ " + (i + 1) + "/7 — " + def.name });
    const r = await buildFrame(page, def, fx);
    built[def.id] = r;
  }

  const homeFrame = page.findOne(n => n.name === HOME_NAME && n.type === "FRAME");
  post({ type: "log", text: "🔗 Conectando prototipo…" });
  wireAll(built, homeFrame);

  const allFrames = FRAMES.map(f => built[f.id].frame);
  figma.viewport.scrollAndZoomIntoView(allFrames);
  post({ type: "log", text: "✅ 7 frames generados y conectados" });
  return { type: "done" };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === "run") {
    post({ type: "log", text: "🏔️ Iniciando — ALTA MONTAÑA (7 frames)" });
    try {
      const result = await buildAll();
      figma.ui.postMessage(result || { type: "done" });
      figma.notify("🏔️ ALTA MONTAÑA — 7 frames generados!", { timeout: 4000 });
    } catch (e) {
      figma.ui.postMessage({ type: "error", text: e.message || String(e) });
    }
  }
  if (msg.type === "close") figma.closePlugin();
};
