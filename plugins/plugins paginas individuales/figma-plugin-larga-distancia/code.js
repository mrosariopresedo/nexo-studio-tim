// ─── TIM · LARGA DISTANCIA — Figma Plugin ────────────────────────────────────
// Builds LARGA DISTANCIA — TIM frame next to HOME — TIM
// and wires Figma prototype navigation between both frames.
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 420, height: 440, title: "TIM — Larga Distancia" });

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PAGE_NAME = "Pagina Web";
const HOME_NAME = "HOME — TIM";
const LD_NAME   = "LARGA DISTANCIA — TIM";
const FW = 1440, CX = 80, CW = 1280;

const BORGONA       = "722F37";
const BORGONA_DARK  = "5A2229";
const BORGONA_LIGHT = "F5EAEB";
const GRIS          = "333333";
const GRIS_M        = "666666";
const GRIS_S        = "888888";
const GRIS_BG       = "F7F7F7";
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
  const h = c.length === 8 ? c.slice(0, 6) : c; // strip alpha if present
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
    st.resize(640, st.height);
    cy += st.height + 12;
  }
  return cy;
}

// ─── SVG ASSETS ──────────────────────────────────────────────────────────────
const SVG_WHEELCHAIR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1.8"/><path d="M9 7v6h6l2 5M5 14a6 6 0 109 5"/><circle cx="11" cy="18" r="3.5"/></svg>`;
const SVG_RAMP       = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18M3 19l16-12"/><circle cx="16" cy="9" r="1.5"/><path d="M19 7l-4 5"/></svg>`;
const SVG_AUDIO      = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 010 6M18 6a8 8 0 010 12"/></svg>`;
const SVG_EYE        = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_SIGNS      = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect x="3" y="5" width="14" height="5" rx="1"/><rect x="7" y="13" width="14" height="5" rx="1"/></svg>`;
const SVG_TOILET     = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><circle cx="7" cy="6" r="2"/><path d="M5 21v-6H4l1.5-5a2 2 0 014 0L11 15h-1v6z"/><circle cx="17" cy="6" r="2"/><path d="M14 21v-4h-1l2-6h4l2 6h-1v4z"/></svg>`;
const SVG_BUS        = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="12" rx="2"/><circle cx="8" cy="19" r="1.5"/><circle cx="16" cy="19" r="1.5"/><path d="M4 11h16M9 5v6"/></svg>`;
const SVG_WIFI       = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12a10 10 0 0114 0M8 15a6 6 0 018 0M11 18h2"/></svg>`;
const SVG_PLUG       = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 01-10 0zM12 17v4"/></svg>`;
const SVG_AC         = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4 7l16 10M4 17L20 7"/></svg>`;
const SVG_BED        = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V8M21 18v-5a3 3 0 00-3-3H10v8M3 14h18"/></svg>`;
const SVG_AMENITY    = { wifi: SVG_WIFI, plug: SVG_PLUG, ac: SVG_AC, bed: SVG_BED };

const SVG_MAP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 380">
  <rect width="820" height="380" fill="#FBFAF7"/>
  <line x1="230" y1="195" x2="510" y2="215" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="430" y2="148" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="475" y2="178" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="555" y2="248" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="235" y2="308" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="318" y2="68" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="212" y2="158" stroke="#722F37" stroke-width="1.5" opacity="0.55"/>
  <line x1="230" y1="195" x2="85" y2="195" stroke="#555" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.55"/>
  <circle cx="510" cy="215" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="522" y="219" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Buenos Aires</text>
  <circle cx="430" cy="148" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="442" y="152" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Córdoba</text>
  <circle cx="475" cy="178" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="487" y="182" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Rosario</text>
  <circle cx="555" cy="248" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="567" y="252" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Mar del Plata</text>
  <circle cx="235" cy="308" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="247" y="312" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Bariloche</text>
  <circle cx="318" cy="68" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="330" y="72" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">Salta</text>
  <circle cx="212" cy="158" r="5" fill="white" stroke="#722F37" stroke-width="2"/>
  <text x="148" y="155" font-size="12" font-weight="600" fill="#333" font-family="Inter,sans-serif">San Juan</text>
  <circle cx="85" cy="195" r="5" fill="white" stroke="#555" stroke-width="2"/>
  <text x="10" y="192" font-size="12" font-weight="600" fill="#555" font-family="Inter,sans-serif">Santiago</text>
  <circle cx="230" cy="195" r="22" fill="#722F37" opacity="0.10"/>
  <circle cx="230" cy="195" r="14" fill="#722F37" opacity="0.18"/>
  <circle cx="230" cy="195" r="7" fill="#722F37"/>
  <text x="180" y="180" font-size="13" font-weight="700" fill="#722F37" font-family="Inter,sans-serif">TIM</text>
  <text x="156" y="196" font-size="11" fill="#666" font-family="Inter,sans-serif">Mendoza</text>
  <rect x="640" y="330" width="170" height="44" rx="6" fill="white" stroke="#DDDDDD" stroke-width="1"/>
  <line x1="652" y1="344" x2="672" y2="344" stroke="#722F37" stroke-width="2"/>
  <text x="678" y="347" font-size="11" fill="#666" font-family="Inter,sans-serif">Ruta nacional</text>
  <line x1="652" y1="362" x2="660" y2="362" stroke="#555" stroke-width="2"/>
  <line x1="663" y1="362" x2="671" y2="362" stroke="#555" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="678" y="365" font-size="11" fill="#666" font-family="Inter,sans-serif">Internacional</text>
</svg>`;

// ─── SECTION: NAVBAR ─────────────────────────────────────────────────────────
// Returns { nextY, hotspotHome } where hotspotHome is the clickable rect for LD→HOME
async function _navbar(F, y) {
  rect(F, 0, y, FW, 76, BORGONA);
  await txt(F, CX, y + 20, "TIM", EXTRABOLD, 28, BLANCO);
  await txt(F, CX + 70, y + 36, "Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.75 });
  // Hotspot invisible sobre el logo TIM (LD → HOME)
  const hotspotHome = figma.createRectangle();
  hotspotHome.name = "hotspot-nav-home";
  hotspotHome.x = CX; hotspotHome.y = y + 12;
  hotspotHome.resize(60, 52);
  hotspotHome.fills = [];
  hotspotHome.opacity = 0.01; // casi invisible pero seleccionable
  F.appendChild(hotspotHome);

  let nx = CX + 270;
  for (const link of ["Larga Distancia", "Alta Montana", "Ruta del Vino", "Aeropuerto", "Universitario"]) {
    const label = link === "Alta Montana" ? "Alta Montaña" : link;
    const t = await txt(F, nx, y + 30, label, SEMIBOLD, 14, BLANCO);
    t.opacity = link === "Larga Distancia" ? 1.0 : 0.82;
    if (link === "Larga Distancia") {
      rect(F, nx, y + 69, t.width, 3, BLANCO, { name: "nav-ld-underline" });
    }
    nx += t.width + 28;
  }
  rect(F, 1196, y + 16, 164, 44, null, { stroke: BLANCO, sw: 1.5, radius: 8 });
  await txt(F, 1196, y + 24, "Accesibilidad", SEMIBOLD, 14, BLANCO, { w: 164, align: "CENTER" });
  return { nextY: y + 76, hotspotHome };
}

// ─── SECTION: HERO ───────────────────────────────────────────────────────────
async function _hero(F, y) {
  const H = 560;
  rect(F, 0, y, FW, H, BORGONA);
  // Badge background
  rect(F, CX, y + 64, 300, 36, BLANCO, { radius: 100, opacity: 0.14 });
  svgNode(F, SVG_BUS, CX + 8, y + 70, 22, 22);
  await txt(F, CX + 38, y + 72, "Servicio Nacional e Internacional", MEDIUM, 13, BLANCO);
  // H1
  await txt(F, CX, y + 120, "Larga Distancia", EXTRABOLD, 72, BLANCO);
  // Subtitle
  const sub = await txt(F, CX, y + 212, "Micros desde TIM hacia Buenos Aires, Córdoba, Rosario y todo el país.\nConexión internacional a Santiago de Chile, Lima y Asunción.", REGULAR, 20, BLANCO, { opacity: 0.9 });
  sub.textAutoResize = "HEIGHT";
  sub.resize(620, sub.height);
  // Stats
  const stats = [
    ["18", "destinos nacionales", "+3 internacionales"],
    ["12", "empresas operadoras", "Andesmar, Cata, Chevallier…"],
    ["+120", "salidas diarias", "24/7 — Andenes 1 al 22"],
  ];
  let sy = y + 100;
  for (const [n, label, sublabel] of stats) {
    await txt(F, 900, sy, n, BOLD, 40, BLANCO);
    await txt(F, 1010, sy + 6, label, MEDIUM, 15, BLANCO);
    await txt(F, 1010, sy + 26, sublabel, REGULAR, 13, BLANCO, { opacity: 0.6 });
    rect(F, 900, sy + 56, 420, 1, BLANCO, { opacity: 0.18 });
    sy += 72;
  }
  // Search bar
  const SY = y + H - 86 - 56;
  rect(F, CX, SY, CW, 76, BLANCO, { radius: 12 });
  const fields = [
    { label: "DESTINO",          hint: "Buenos Aires",      fx: CX + 18,   fw: 268 },
    { label: "FECHA DE VIAJE",   hint: "Mié 27 mayo",  fx: CX + 310,  fw: 210 },
    { label: "TIPO DE SERVICIO", hint: "Cama · Semi-cama", fx: CX + 540, fw: 230 },
  ];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    rect(F, f.fx, SY + 12, 28, 28, BORGONA_LIGHT, { radius: 6 });
    await txt(F, f.fx + 36, SY + 14, f.label, BOLD, 10, GRIS_S);
    await txt(F, f.fx + 36, SY + 30, f.hint, BOLD, 14, GRIS);
    if (i < fields.length - 1) rect(F, f.fx + f.fw, SY + 10, 1, 56, BORDE);
  }
  rect(F, CX + CW - 196, SY + 10, 184, 56, BORGONA, { radius: 8 });
  await txt(F, CX + CW - 196, SY + 25, "Buscar horarios", SEMIBOLD, 15, BLANCO, { w: 184, align: "CENTER" });
  return y + H;
}

// ─── SECTION: DESTINOS ───────────────────────────────────────────────────────
const DESTINOS = [
  { city: "Buenos Aires", state: "Buenos Aires",            km: 1037, time: "13h 30m", from: 22500, daily: 14, featured: true },
  { city: "Córdoba",      state: "Córdoba",       km: 622,  time: "8h 30m",  from: 14800, daily: 9 },
  { city: "Rosario",      state: "Santa Fe",                km: 866,  time: "11h 00m", from: 18900, daily: 6 },
  { city: "Mar del Plata", state: "Buenos Aires",           km: 1444, time: "18h 00m", from: 28400, daily: 3 },
  { city: "Bariloche",    state: "Río Negro",          km: 1340, time: "17h 30m", from: 32100, daily: 4 },
  { city: "Salta",        state: "Salta",                   km: 1471, time: "19h 30m", from: 29800, daily: 2 },
  { city: "San Juan",     state: "San Juan",                km: 168,  time: "2h 30m",  from: 4200,  daily: 12 },
  { city: "Santiago",     state: "Chile · Internacional", km: 359, time: "7h 30m", from: 35400, daily: 3, intl: true },
];

async function _destinos(F, y) {
  const SEC_H = 900;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "01 · Destinos", "Destinos principales",
    "Las ciudades más viajadas desde TIM. Precios referenciales, varían según empresa, categoría y antelación.");
  cy += 40;
  const CARD_W = Math.floor((CW - 3 * 24) / 4);
  const CARD_H = 268;
  for (let i = 0; i < DESTINOS.length; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const d = DESTINOS[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 24);
    const bdr = d.featured ? BORGONA : BORDE;
    const fill = d.featured ? BORGONA_LIGHT : BLANCO;
    rect(F, cx, ccy, CARD_W, CARD_H, fill, { radius: 12, stroke: bdr, sw: 1 });
    // Badge top right
    if (d.featured) {
      rect(F, cx + CARD_W - 94, ccy, 94, 22, BORGONA, { radius: 4 });
      await txt(F, cx + CARD_W - 94, ccy + 5, "MÁS BUSCADO", BOLD, 9, BLANCO, { w: 94, align: "CENTER" });
    }
    if (d.intl) {
      rect(F, cx + CARD_W - 108, ccy, 108, 22, GRIS, { radius: 4 });
      await txt(F, cx + CARD_W - 108, ccy + 5, "INTERNACIONAL", BOLD, 9, BLANCO, { w: 108, align: "CENTER" });
    }
    // Icon circle
    rect(F, cx + 20, ccy + 24, 44, 44, d.featured ? BLANCO : BORGONA_LIGHT, { radius: 10 });
    // City name
    await txt(F, cx + 76, ccy + 28, d.city, BOLD, 21, GRIS);
    await txt(F, cx + 76, ccy + 54, d.state, REGULAR, 12, GRIS_S);
    // Stats
    rect(F, cx + 20, ccy + 94, CARD_W - 40, 1, BORDE);
    await txt(F, cx + 20, ccy + 106, "Distancia", BOLD, 10, GRIS_S);
    await txt(F, cx + CARD_W / 2, ccy + 106, "Duración", BOLD, 10, GRIS_S);
    await txt(F, cx + 20, ccy + 122, d.km + " km", SEMIBOLD, 16, GRIS);
    await txt(F, cx + CARD_W / 2, ccy + 122, d.time, SEMIBOLD, 16, GRIS);
    // Price
    rect(F, cx + 20, ccy + 178, CARD_W - 40, 1, BORDE);
    await txt(F, cx + 20, ccy + 190, "Desde", REGULAR, 11, GRIS_S);
    await txt(F, cx + 20, ccy + 208, "$" + d.from.toLocaleString("es-AR"), BOLD, 18, BORGONA);
    await txt(F, cx + CARD_W - 75, ccy + 208, d.daily + " sal/día", REGULAR, 12, GRIS_S);
    // Link
    await txt(F, cx + 20, ccy + CARD_H - 28, "Ver horarios →", SEMIBOLD, 13, BORGONA);
  }
  return y + SEC_H;
}

// ─── SECTION: HORARIOS ───────────────────────────────────────────────────────
const HORARIOS = [
  { emp: "Andesmar",          serv: "Cama Suite",    dep: "18:30", arr: "08:00 +1", dur: "13h 30m", plat: "A04", amen: ["wifi","plug","ac","bed"], price: 32400, status: "A horario" },
  { emp: "Chevallier",        serv: "Cama Ejecutivo",dep: "19:15", arr: "09:00 +1", dur: "13h 45m", plat: "A07", amen: ["wifi","plug","bed"],       price: 28900, status: "A horario" },
  { emp: "Cata Intl.",        serv: "Semi-Cama",     dep: "20:00", arr: "10:30 +1", dur: "14h 30m", plat: "B02", amen: ["wifi","plug"],             price: 22500, status: "A horario" },
  { emp: "Flecha Bus",        serv: "Cama",          dep: "20:45", arr: "10:15 +1", dur: "13h 30m", plat: "A11", amen: ["wifi","plug","bed"],       price: 26800, status: "2 lugares" },
  { emp: "El Rápido",    serv: "Semi-Cama",     dep: "21:30", arr: "12:00 +1", dur: "14h 30m", plat: "B05", amen: ["wifi","ac"],               price: 23200, status: "A horario" },
  { emp: "Vía Bariloche",serv: "Cama",          dep: "22:00", arr: "11:30 +1", dur: "13h 30m", plat: "A09", amen: ["wifi","plug","bed"],       price: 27600, status: "A horario" },
  { emp: "Crucero del Norte", serv: "Cama Suite",    dep: "22:30", arr: "12:00 +1", dur: "13h 30m", plat: "A02", amen: ["wifi","plug","ac","bed"],  price: 31200, status: "Últimos 4" },
];

const COL_W = [185, 148, 84, 108, 96, 104, 142, 114, 108, 91];

async function _horarios(F, y) {
  const ROW_H = 66;
  const TABLE_H = 50 + HORARIOS.length * ROW_H + 16;
  const SEC_H = 96 + 140 + 56 + TABLE_H + 48 + 96;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "02 · Horarios y frecuencias", "Salidas de hoy",
    "Tabla en tiempo real de salidas hacia Buenos Aires. Cambiá el destino para ver otras rutas.");
  cy += 32;
  // Destination tabs
  const tabs = ["Buenos Aires","Córdoba","Rosario","Mar del Plata","Bariloche","San Juan","Santiago (CL)"];
  let tx = CX;
  for (let i = 0; i < tabs.length; i++) {
    const tw = Math.round(tabs[i].length * 7.8 + 36);
    rect(F, tx, cy, tw, 44, i === 0 ? BORGONA : BLANCO, { radius: 8, stroke: i === 0 ? BORGONA : BORDE, sw: 1 });
    await txt(F, tx, cy + 14, tabs[i], SEMIBOLD, 14, i === 0 ? BLANCO : GRIS, { w: tw, align: "CENTER" });
    tx += tw + 8;
  }
  cy += 56;
  // Table
  rect(F, CX, cy, CW, TABLE_H, BLANCO, { radius: 12, stroke: BORDE, sw: 1 });
  // Header
  rect(F, CX + 1, cy + 1, CW - 2, 48, GRIS_BG);
  const HEADS = ["Empresa","Servicio","Salida","Llegada","Duración","Plataforma","Comodidades","Precio desde","Estado",""];
  let hx = CX + 14;
  for (let i = 0; i < HEADS.length; i++) {
    if (HEADS[i]) await txt(F, hx, cy + 18, HEADS[i], BOLD, 10, GRIS_S);
    hx += COL_W[i];
  }
  cy += 48;
  // Rows
  for (let ri = 0; ri < HORARIOS.length; ri++) {
    const row = HORARIOS[ri];
    const ry = cy + ri * ROW_H;
    if (ri > 0) rect(F, CX + 14, ry, CW - 28, 1, BORDE);
    let rx = CX + 14;
    // Empresa
    await txt(F, rx, ry + 24, row.emp, SEMIBOLD, 14, GRIS); rx += COL_W[0];
    // Servicio
    await txt(F, rx, ry + 24, row.serv, REGULAR, 14, GRIS_M); rx += COL_W[1];
    // Salida
    await txt(F, rx, ry + 22, row.dep, BOLD, 16, GRIS); rx += COL_W[2];
    // Llegada
    await txt(F, rx, ry + 24, row.arr, REGULAR, 14, GRIS); rx += COL_W[3];
    // Duracion
    await txt(F, rx, ry + 24, row.dur, REGULAR, 14, GRIS_M); rx += COL_W[4];
    // Plataforma badge
    rect(F, rx, ry + 18, 52, 26, BORGONA_LIGHT, { radius: 6 });
    await txt(F, rx, ry + 24, row.plat, BOLD, 12, BORGONA, { w: 52, align: "CENTER" });
    rx += COL_W[5];
    // Amenidades: small icon placeholders
    let ax = rx;
    for (const a of row.amen) {
      svgNode(F, SVG_AMENITY[a] || SVG_WIFI, ax, ry + 20, 20, 20);
      ax += 26;
    }
    rx += COL_W[6];
    // Precio
    await txt(F, rx, ry + 22, "$" + row.price.toLocaleString("es-AR"), BOLD, 14, GRIS); rx += COL_W[7];
    // Status
    const isOk = row.status === "A horario";
    rect(F, rx, ry + 18, 96, 26, isOk ? VERDE_BG : NARANJA_BG, { radius: 6 });
    await txt(F, rx, ry + 24, row.status, SEMIBOLD, 12, isOk ? VERDE_FG : NARANJA_FG, { w: 96, align: "CENTER" });
    rx += COL_W[8];
    // Reservar button
    rect(F, rx, ry + 16, 80, 34, BORGONA, { radius: 8 });
    await txt(F, rx, ry + 24, "Reservar", SEMIBOLD, 12, BLANCO, { w: 80, align: "CENTER" });
  }
  cy += HORARIOS.length * ROW_H + 16;
  // Legend
  cy += 20;
  await txt(F, CX, cy, "Wi-Fi · Enchufe USB/220V · Aire acondicionado · Cama / Cama Suite", REGULAR, 13, GRIS_M);
  return y + SEC_H;
}

// ─── SECTION: MAPA ───────────────────────────────────────────────────────────
async function _mapa(F, y) {
  const MAP_H = 380;
  const INFO_W = CW - 840 - 24;
  const SEC_H = 96 + 130 + MAP_H + 96;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "03 · Mapa de recorridos", "Cobertura nacional desde Mendoza",
    "TIM conecta el centro-oeste argentino con todo el país. Cada línea es una ruta directa desde nuestra terminal.");
  cy += 24;
  // Map
  rect(F, CX, cy, 840, MAP_H, "FBFAF7", { radius: 12, stroke: BORDE, sw: 1 });
  svgNode(F, SVG_MAP, CX, cy, 840, MAP_H);
  // Info cards
  const ix = CX + 840 + 24;
  // Location card
  rect(F, ix, cy, INFO_W, 170, BORGONA_LIGHT, { radius: 12, stroke: BORGONA, sw: 1 });
  await txt(F, ix + 22, cy + 20, "CÓMO LLEGAR A TIM", BOLD, 10, BORGONA);
  await txt(F, ix + 22, cy + 42, "Juan B. Alberdi s/n, M5519", BOLD, 17, GRIS);
  await txt(F, ix + 22, cy + 70, "Guaymallén, Mendoza · 3 km del microcentro", REGULAR, 13, GRIS_M);
  rect(F, ix + 22, cy + 100, 150, 32, BLANCO, { radius: 6, stroke: BORDE, sw: 1 });
  await txt(F, ix + 22, cy + 112, "Metrotranvía · Línea Urbana", SEMIBOLD, 11, GRIS, { w: 150, align: "CENTER" });
  rect(F, ix + 180, cy + 100, 134, 32, BLANCO, { radius: 6, stroke: BORDE, sw: 1 });
  await txt(F, ix + 180, cy + 112, "Colectivos 110 · 200", SEMIBOLD, 11, GRIS, { w: 134, align: "CENTER" });
  // Hours card
  rect(F, ix, cy + 182, INFO_W, MAP_H - 182, BLANCO, { radius: 12, stroke: BORDE, sw: 1 });
  await txt(F, ix + 22, cy + 202, "HORARIO DE ATENCIÓN", BOLD, 10, BORGONA);
  const hrs = [["Boletarías","24h · 7 días"],["Informes","06:00 — 23:00"],["Equipaje","05:30 — 23:30"],["Asistencia accesible","24 horas"]];
  for (let hi = 0; hi < hrs.length; hi++) {
    const hy = cy + 228 + hi * 34;
    await txt(F, ix + 22, hy, hrs[hi][0], REGULAR, 13, GRIS_M);
    await txt(F, ix + INFO_W - 22 - 110, hy, hrs[hi][1], SEMIBOLD, 13, GRIS);
  }
  rect(F, ix + 22, cy + 228 + hrs.length * 34 + 6, INFO_W - 44, 1, BORDE);
  await txt(F, ix + 22, cy + 228 + hrs.length * 34 + 18, "Tel. 0261 476-5875", REGULAR, 13, GRIS_M);
  return y + SEC_H;
}

// ─── SECTION: EMPRESAS ───────────────────────────────────────────────────────
const EMPRESAS = [
  { name: "Andesmar",            plat: "A02 · A04", dest: "Cobertura nacional · Chile" },
  { name: "Chevallier",          plat: "A07",             dest: "Buenos Aires · Litoral" },
  { name: "Cata Internacional",  plat: "B02",             dest: "Buenos Aires · Lima · Asunción" },
  { name: "Flecha Bus",          plat: "A11",             dest: "Buenos Aires · NOA" },
  { name: "El Rápido",      plat: "B05",             dest: "Buenos Aires · Mar del Plata" },
  { name: "Vía Bariloche",  plat: "A09",             dest: "Patagonia · Bariloche" },
  { name: "Crucero del Norte",   plat: "A02",             dest: "NEA · Misiones" },
  { name: "El Cóndor",      plat: "B09",             dest: "Córdoba · Rosario" },
];

async function _empresas(F, y) {
  const CARD_W = Math.floor((CW - 3 * 24) / 4);
  const CARD_H = 106;
  const SEC_H = 96 + 120 + 2 * (CARD_H + 16) + 80;
  rect(F, 0, y, FW, SEC_H, GRIS_BG);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "04 · Empresas y plataformas", "Operadores que salen desde TIM",
    "Cada empresa tiene plataforma fija asignada para que sepas exactamente desde dónde sale tu micro.");
  cy += 32;
  for (let i = 0; i < EMPRESAS.length; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const e = EMPRESAS[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 16);
    rect(F, cx, ccy, CARD_W, CARD_H, BLANCO, { radius: 12, stroke: BORDE, sw: 1 });
    // Avatar
    rect(F, cx + 16, ccy + 27, 52, 52, BORGONA, { radius: 10 });
    const initials = e.name.split(" ").slice(0, 2).map(w => w[0]).join("");
    await txt(F, cx + 16, ccy + 39, initials, BOLD, 16, BLANCO, { w: 52, align: "CENTER" });
    // Text
    await txt(F, cx + 82, ccy + 22, e.name, BOLD, 14, GRIS);
    await txt(F, cx + 82, ccy + 44, e.dest, REGULAR, 12, GRIS_M);
    rect(F, cx + 82, ccy + 66, 84, 22, BORGONA_LIGHT, { radius: 4 });
    await txt(F, cx + 82, ccy + 71, "Plat. " + e.plat, BOLD, 10, BORGONA, { w: 84, align: "CENTER" });
  }
  return y + SEC_H;
}

// ─── SECTION: ACCESIBILIDAD ───────────────────────────────────────────────────
const ACCES = [
  { svg: SVG_WHEELCHAIR, title: "Espacios para silla de ruedas",
    desc: "Todos los micros: 2 espacios reservados con cinturón y anclaje para sillas de ruedas.", norm: "EN 1789" },
  { svg: SVG_RAMP,       title: "Rampas y ascensores",
    desc: "Rampas mecánicas en todos los andenes. Ascensor central, sin escalones desde la calle.", norm: "IRAM 11929" },
  { svg: SVG_AUDIO,      title: "Información sonora",
    desc: "Salidas y demoras anunciadas por altavoz cada 5 min. Atención telefónica 24/7.", norm: "WCAG 1.2.5" },
  { svg: SVG_EYE,        title: "Contraste y tipografía",
    desc: "Carteles con contraste 4.5:1 mínimo. Pantallas LED legibles a 10 metros de distancia.", norm: "WCAG 1.4.3 AA" },
  { svg: SVG_SIGNS,      title: "Señalización clara",
    desc: "Pictogramas universales en cada andén y baños. Mapa táctil a la entrada de Informes.", norm: "ISO 7001" },
  { svg: SVG_TOILET,     title: "Servicios accesibles",
    desc: "Baños con barra de apoyo, alarma de asistencia y espacio de giro de 1.5 m.", norm: "Decreto 914/97" },
];

async function _accesibilidad(F, y) {
  const CARD_W = Math.floor((CW - 2 * 24) / 3);
  const CARD_H = 220;
  const SEC_H = 96 + 130 + 2 * (CARD_H + 24) + 48 + 88 + 80;
  rect(F, 0, y, FW, SEC_H, BLANCO);
  let cy = y + 96;
  cy = await sectionHeading(F, cy, "05 · Accesibilidad", "Diseñado para que todos viajen",
    "TIM cumple WCAG 2.1 AA y Decreto 914/97. Podés solicitar asistencia sin costo al reservar o llamando al 0261 476-5875.");
  cy += 32;
  for (let i = 0; i < ACCES.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const a = ACCES[i];
    const cx = CX + col * (CARD_W + 24);
    const ccy = cy + row * (CARD_H + 24);
    rect(F, cx, ccy, CARD_W, CARD_H, GRIS_BG, { radius: 12, stroke: BORDE, sw: 1 });
    rect(F, cx + 28, ccy + 28, 64, 64, BLANCO, { radius: 16, stroke: BORDE, sw: 1 });
    svgNode(F, a.svg, cx + 44, ccy + 44, 32, 32);
    await txt(F, cx + 28, ccy + 108, a.title, BOLD, 17, GRIS);
    const desc = await txt(F, cx + 28, ccy + 134, a.desc, REGULAR, 13, GRIS_M);
    desc.textAutoResize = "HEIGHT";
    desc.resize(CARD_W - 56, desc.height);
    rect(F, cx + 28, ccy + CARD_H - 30, CARD_W - 56, 1, BORDE);
    await txt(F, cx + 28, ccy + CARD_H - 20, "Norma · " + a.norm, BOLD, 10, BORGONA);
  }
  cy += 2 * (CARD_H + 24) + 24;
  // CTA Banner
  rect(F, CX, cy, CW, 88, BORGONA, { radius: 12 });
  await txt(F, CX + 32, cy + 14, "¿NECESÍTÁS ASISTENCIA?", BOLD, 10, BLANCO, { opacity: 0.8 });
  await txt(F, CX + 32, cy + 36, "Coordinala antes de viajar — sin costo adicional.", SEMIBOLD, 19, BLANCO);
  rect(F, CX + CW - 302, cy + 22, 144, 44, BLANCO, { radius: 8 });
  await txt(F, CX + CW - 302, cy + 34, "Solicitar asistencia →", BOLD, 13, BORGONA, { w: 144, align: "CENTER" });
  rect(F, CX + CW - 146, cy + 22, 138, 44, null, { stroke: BLANCO, sw: 1.5, radius: 8 });
  await txt(F, CX + CW - 146, cy + 34, "0261 476-5875", BOLD, 13, BLANCO, { w: 138, align: "CENTER" });
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
    { title: "Navegación",  items: ["Inicio","Servicios","Accesibilidad","Contacto"],                                               x: 520 },
    { title: "Servicios",       items: ["Larga Distancia","Alta Montaña","Ruta del Vino","Aeropuerto","Universitario"],             x: 740 },
    { title: "Información",items: ["Llegar a la terminal","Tarifas","Política de privacidad","Términos y condiciones"],    x: 1000 },
  ];
  for (const col of fcols) {
    await txt(F, col.x, y + 64, col.title, BOLD, 12, BLANCO, { opacity: 0.9 });
    for (let i = 0; i < col.items.length; i++) {
      await txt(F, col.x, y + 90 + i * 26, col.items[i], REGULAR, 13, BLANCO, { opacity: 0.75 });
    }
  }
  rect(F, CX, y + 282, CW, 1, BLANCO, { opacity: 0.12 });
  await txt(F, CX, y + 298, "© 2026 Nexo Studio · Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.6 });
  await txt(F, 1200, y + 298, "Hecho en Mendoza, Argentina", REGULAR, 12, BLANCO, { opacity: 0.6 });
  return y + SEC_H;
}

// ─── PROTOTYPE CONNECTIONS ────────────────────────────────────────────────────
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

function addPrototypeConnections(ldFrame, hotspotHome, page) {
  const homeFrame = page.findOne(n => n.name === HOME_NAME && n.type === "FRAME");

  // ── LD → HOME: hotspot invisible en el logo TIM ──────────────────────────
  let back = 0;
  if (homeFrame) {
    if (makeNav(hotspotHome, homeFrame.id)) back++;
    post({ type: "log", text: "  LD → HOME: hotspot creado en logo TIM (" + back + ")" });
  } else {
    post({ type: "log", text: "  LD → HOME: frame HOME no encontrado — saltado" });
  }

  // ── HOME → LD: buscar elementos en HOME navbar ────────────────────────────
  if (!homeFrame) {
    post({ type: "log", text: "  HOME → LD: frame HOME no encontrado — saltado" });
    return;
  }

  let linked = 0;

  // Estrategia 1: hotspot nombrado en HOME (si el plugin HOME los creó)
  const homeHotspot = homeFrame.findOne(n => n.name === "hotspot-nav-ld");
  if (homeHotspot) {
    if (makeNav(homeHotspot, ldFrame.id)) linked++;
    post({ type: "log", text: "  HOME → LD via hotspot: " + linked });
  }

  // Estrategia 2: cualquier text node con characters === "Larga Distancia"
  const textNodes = homeFrame.findAll(n => n.type === "TEXT" && n.characters === "Larga Distancia");
  post({ type: "log", text: "  HOME: text nodes 'Larga Distancia' encontrados: " + textNodes.length });
  for (const n of textNodes) {
    if (makeNav(n, ldFrame.id)) linked++;
  }

  post({ type: "log", text: "  HOME → LD total: " + linked + " conexion(es)" });

  // ── Si HOME no tiene hotspots, crear uno encima del navbar LD text ────────
  if (linked === 0) {
    post({ type: "log", text: "  Creando hotspot en HOME sobre area navbar LD..." });
    // Crear rect transparente en HOME frame sobre el área donde debería estar "Larga Distancia" en el navbar
    // Posición aproximada basada en la estructura del HOME navbar
    const hs = figma.createRectangle();
    hs.name = "hotspot-nav-ld";
    hs.fills = [];
    hs.opacity = 0.01;
    // Navbar en HOME es y=0, h=76. "Larga Distancia" es el primer link a partir de x~350
    hs.x = 340; hs.y = 16;
    hs.resize(140, 52);
    homeFrame.appendChild(hs);
    if (makeNav(hs, ldFrame.id)) {
      post({ type: "log", text: "  Hotspot creado en HOME frame: OK" });
    }
  }
}

// ─── BUILD ────────────────────────────────────────────────────────────────────
async function buildLD() {
  const page = figma.root.children.find(p => p.name === PAGE_NAME);
  if (!page) {
    figma.ui.postMessage({ type: "error", text: "Página '" + PAGE_NAME + "' no encontrada. Ejecutá primero el plugin HOME." });
    return;
  }
  figma.currentPage = page;
  const homeFrame = page.findOne(n => n.name === HOME_NAME && n.type === "FRAME");
  const ldX = homeFrame ? homeFrame.x + homeFrame.width + 120 : 1560;
  post({ type: "log", text: "📐 LARGA DISTANCIA en x=" + ldX + " (HOME termina en x=" + (homeFrame ? homeFrame.x + homeFrame.width : "?") + ")" });
  // Remove existing
  page.findChildren(n => n.name === LD_NAME).forEach(n => n.remove());
  // Create frame
  const F = figma.createFrame();
  F.name = LD_NAME;
  F.x = ldX; F.y = 0;
  F.resize(FW, 100);
  F.fills = [{ type: "SOLID", color: hexRGB(BLANCO) }];
  F.clipsContent = false;
  page.appendChild(F);
  let y = 0;
  post({ type: "log", text: "🏗️ 1/8 — Navbar" });
  const navResult = await _navbar(F, y);
  const hotspotHome = navResult.hotspotHome;
  y = navResult.nextY;
  post({ type: "log", text: "🏗️ 2/8 — Hero" });
  y = await _hero(F, y);
  post({ type: "log", text: "🏗️ 3/8 — Destinos" });
  y = await _destinos(F, y);
  post({ type: "log", text: "🏗️ 4/8 — Horarios" });
  y = await _horarios(F, y);
  post({ type: "log", text: "🏗️ 5/8 — Mapa" });
  y = await _mapa(F, y);
  post({ type: "log", text: "🏗️ 6/8 — Empresas" });
  y = await _empresas(F, y);
  post({ type: "log", text: "🏗️ 7/8 — Accesibilidad" });
  y = await _accesibilidad(F, y);
  post({ type: "log", text: "🏗️ 8/8 — Footer" });
  y = await _footer(F, y);
  F.resize(FW, y);
  post({ type: "log", text: "✅ Frame: " + FW + "×" + y + "px" });
  post({ type: "log", text: "🔗 Conectando prototipo…" });
  addPrototypeConnections(F, hotspotHome, page);
  figma.viewport.scrollAndZoomIntoView([F]);
  return { type: "done" };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === "run") {
    post({ type: "log", text: "🚌 Iniciando — LARGA DISTANCIA — TIM" });
    try {
      const result = await buildLD();
      figma.ui.postMessage(result || { type: "done" });
      figma.notify("🚌 LARGA DISTANCIA — TIM generada!", { timeout: 4000 });
    } catch (e) {
      figma.ui.postMessage({ type: "error", text: e.message || String(e) });
    }
  }
  if (msg.type === "close") figma.closePlugin();
};
