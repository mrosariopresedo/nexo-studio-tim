// ─── TIM · METROTRANVÍA — Figma Plugin (Multi-frame) ─────────────────────────
// Builds 3 frames (INICIO/RECORRIDO/HORARIOS) next to the last existing frame.
// Header propio Metrotranvía con tabs internos. Logo → HOME — TIM.
// Conexión HOME → INICIO via text node "Aeropuerto" del HOME navbar.
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 420, height: 460, title: "TIM — Metrotranvía" });

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PAGE_NAME = "Pagina Web";
const HOME_NAME = "HOME — TIM";

const FRAMES = [
  { id: "inicio",    name: "METROTRANVÍA — INICIO",    label: "Inicio" },
  { id: "recorrido", name: "METROTRANVÍA — RECORRIDO", label: "Recorrido" },
  { id: "horarios",  name: "METROTRANVÍA — HORARIOS",  label: "Horarios" }
];

const FW = 1440, CX = 80, CW = 1280;
const NAVBAR_H = 80;

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
const VERDE_DOT     = "10B981";

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
const SVG_TRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M8 17l-2 4M16 17l2 4M4 11h16"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/></svg>`;
const SVG_BOLT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
const SVG_LINK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"/></svg>`;
const SVG_LEAF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l-3-2.5L4.4 4 4 4.4 8.5 13 11 16l8.2 1.8a1 1 0 0 0 1-1zM4 4l8 8"/></svg>`;
const SVG_PHONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>`;
const SVG_CLOCK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const SVG_WHEELCHAIR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1.8"/><path d="M9 7v6h6l2 5M5 14a6 6 0 109 5"/><circle cx="11" cy="18" r="3.5"/></svg>`;
const SVG_SEAT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"/><path d="M3 22h18"/><path d="M5 14h14"/></svg>`;
const SVG_SIGN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#722F37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect x="3" y="5" width="14" height="5" rx="1"/><rect x="7" y="13" width="14" height="5" rx="1"/></svg>`;
