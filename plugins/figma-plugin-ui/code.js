// TIM — Setup UI Kit | Figma Plugin
// Nexo Studio · UADE Desarrollo Web 2026
// Prompts 1–5: valida páginas, crea estilos de color/texto, construye UI Kit y Carpeta de Diseño

// ── PALETA ────────────────────────────────────────────────────────────────────
const BORGONA       = "722F37";
const BORGONA_DARK  = "5A2229";
const BORGONA_LIGHT = "F5EAEB";
const GRIS          = "333333";
const GRIS_FONDO    = "F7F7F7";
const BLANCO        = "FFFFFF";
const GRIS_BORDE    = "DDDDDD";
const GRIS_CAPTION  = "666666";
const GRIS_LIGHT    = "999999";

// ── FONTS ─────────────────────────────────────────────────────────────────────
const BOLD     = { family: "Inter", style: "Bold"     };
const SEMIBOLD = { family: "Inter", style: "Semi Bold" };
const REGULAR  = { family: "Inter", style: "Regular"  };

// ── PÁGINAS REQUERIDAS ────────────────────────────────────────────────────────
const REQUIRED_PAGES = [
  "Carpeta de Diseño",
];

// ── UTILS ─────────────────────────────────────────────────────────────────────
function rgb(hex) {
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}
const fill  = (hex)  => [{ type: "SOLID", color: rgb(hex) }];
const stroke = (hex) => [{ type: "SOLID", color: rgb(hex) }];

function rect(parent, x, y, w, h, hexFill, opts = {}) {
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  r.fills = hexFill ? fill(hexFill) : [];
  if (opts.stroke)  { r.strokes = stroke(opts.stroke); r.strokeWeight = opts.sw || 1; r.strokeAlign = "INSIDE"; }
  if (opts.radius)  r.cornerRadius = opts.radius;
  if (opts.opacity) r.opacity = opts.opacity;
  parent.appendChild(r);
  return r;
}

async function txt(parent, x, y, chars, font, size, hexColor, opts = {}) {
  await figma.loadFontAsync(font);
  const t = figma.createText();
  t.fontName = font;
  t.fontSize  = size;
  t.characters = chars;
  t.fills = fill(hexColor);
  t.x = x; t.y = y;
  if (opts.w)       { t.textAutoResize = "HEIGHT"; t.resize(opts.w, t.height); }
  if (opts.align)   t.textAlignHorizontal = opts.align;
  if (opts.opacity) t.opacity = opts.opacity;
  parent.appendChild(t);
  return t;
}

function frame(parent, name, x, y, w, h, hexFill) {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y;
  f.resize(w, h);
  f.fills = hexFill ? fill(hexFill) : [{ type: "SOLID", color: { r:1, g:1, b:1 } }];
  f.clipsContent = false;
  if (parent) parent.appendChild(f);
  return f;
}

// ── PASO 1: VALIDAR PÁGINAS ───────────────────────────────────────────────────
function validatePages() {
  const log = [];
  const existing = [...figma.root.children];
  const names    = existing.map(p => p.name);

  for (const req of REQUIRED_PAGES) {
    if (names.includes(req)) {
      log.push("✅ " + req);
    } else {
      // Buscar página con el mismo emoji (renombrar si existe, crear si no)
      const emoji   = [...req].slice(0, 2).join("");
      const partial = existing.find(p => p.name.startsWith(emoji) && !REQUIRED_PAGES.includes(p.name));
      if (partial) {
        const old = partial.name;
        partial.name = req;
        log.push("🔧 Renombrada: \"" + old + "\" → \"" + req + "\"");
      } else {
        const p = figma.createPage();
        p.name = req;
        existing.push(p);
        names.push(req);
        log.push("➕ Creada: " + req);
      }
    }
  }

  // Reordenar
  for (let i = 0; i < REQUIRED_PAGES.length; i++) {
    const p = figma.root.children.find(x => x.name === REQUIRED_PAGES[i]);
    if (p && figma.root.children.indexOf(p) !== i) figma.root.insertChild(i, p);
  }

  return log;
}

// ── PASO 2: ESTILOS DE COLOR ─────────────────────────────────────────────────
function createColorStyles() {
  const defs = [
    { name: "TIM/Borgoña",       hex: BORGONA       },
    { name: "TIM/Borgoña Dark",  hex: BORGONA_DARK  },
    { name: "TIM/Borgoña Light", hex: BORGONA_LIGHT },
    { name: "TIM/Gris Texto",    hex: GRIS          },
    { name: "TIM/Gris Fondo",    hex: GRIS_FONDO    },
    { name: "TIM/Blanco",        hex: BLANCO        },
    { name: "TIM/Gris Borde",    hex: GRIS_BORDE    },
  ];
  const existing = figma.getLocalPaintStyles();
  let created = 0, updated = 0;
  for (const d of defs) {
    let s = existing.find(x => x.name === d.name);
    if (!s) { s = figma.createPaintStyle(); created++; } else { updated++; }
    s.name   = d.name;
    s.paints = [{ type: "SOLID", color: rgb(d.hex) }];
  }
  return "✅ Colores: " + created + " creados, " + updated + " actualizados";
}

// ── PASO 3: ESTILOS DE TEXTO ─────────────────────────────────────────────────
async function createTextStyles() {
  const defs = [
    { name: "TIM/H1",      font: BOLD,     size: 48 },
    { name: "TIM/H2",      font: SEMIBOLD, size: 32 },
    { name: "TIM/H3",      font: SEMIBOLD, size: 24 },
    { name: "TIM/Body",    font: REGULAR,  size: 16 },
    { name: "TIM/Small",   font: REGULAR,  size: 14 },
    { name: "TIM/Caption", font: REGULAR,  size: 12 },
    { name: "TIM/Button",  font: BOLD,     size: 14 },
    { name: "TIM/NavLink", font: REGULAR,  size: 14 },
  ];
  await figma.loadFontAsync(BOLD);
  await figma.loadFontAsync(SEMIBOLD);
  await figma.loadFontAsync(REGULAR);
  const existing = figma.getLocalTextStyles();
  let created = 0, updated = 0;
  for (const d of defs) {
    let s = existing.find(x => x.name === d.name);
    if (!s) { s = figma.createTextStyle(); created++; } else { updated++; }
    s.name     = d.name;
    s.fontName = d.font;
    s.fontSize = d.size;
    // Nota: TextStyle no admite fills — el color se aplica a nivel de TextNode
  }
  return "✅ Textos: " + created + " creados, " + updated + " actualizados";
}

// ── PASO 4: FRAME UI KIT ─────────────────────────────────────────────────────
async function buildUIKit() {
  const page = figma.root.children.find(p => p.name === "Carpeta de Diseño");
  if (!page) throw new Error("Página '🎨 UI Kit' no encontrada.");
  figma.currentPage = page;

  // Eliminar frame anterior si existe
  page.findChildren(n => n.name === "UI Kit — TIM").forEach(n => n.remove());

  const F = frame(page, "UI Kit — TIM", 0, 0, 1440, 100, BLANCO);
  let y = 60;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 0 — TÍTULO
  // ─────────────────────────────────────────────────────────────────────────
  await txt(F, 80, y, "UI Kit — Sistema de Diseño", BOLD, 48, BORGONA);
  y += 68;
  await txt(F, 80, y, "Terminal Inteligente de Mendoza  ·  Nexo Studio 2026", REGULAR, 16, GRIS_CAPTION);
  y += 32;
  rect(F, 80, y, 1280, 2, BORGONA);
  y += 32;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 1 — PALETA DE COLORES
  // ─────────────────────────────────────────────────────────────────────────
  await txt(F, 80, y, "01 — Paleta de Colores", SEMIBOLD, 24, BORGONA);
  y += 44;

  const SW = 260, SH = 190, SGAP = 48;
  const swatches = [
    { hex: BORGONA,    label: "#722F37", name: "Borgoña / Vino Tinto", uso: "Acción · Botones · Títulos",   tc: BLANCO,        border: false },
    { hex: BLANCO,     label: "#FFFFFF", name: "Blanco Nieve",          uso: "Fondos · Espacios en blanco",  tc: GRIS,          border: true  },
    { hex: GRIS,       label: "#333333", name: "Gris Cordillera",        uso: "Texto · Estructura",           tc: BLANCO,        border: false },
  ];

  for (let i = 0; i < swatches.length; i++) {
    const s  = swatches[i];
    const sx = 80 + i * (SW + SGAP);
    rect(F, sx, y, SW, SH, s.hex, { radius: 12, stroke: s.border ? GRIS_BORDE : null, sw: 1 });
    // Texto dentro del swatch
    const lbl = await txt(F, sx + 20, y + 68, s.label, BOLD, 22, s.tc);
    const nm  = await txt(F, sx + 20, y + 98, s.name,  SEMIBOLD, 13, s.tc);
    const uso = await txt(F, sx + 20, y + 118, s.uso,  REGULAR,  12, s.tc, { opacity: 0.75 });
    // Texto debajo del swatch
    await txt(F, sx, y + SH + 10, s.name, SEMIBOLD, 13, GRIS);
    await txt(F, sx, y + SH + 28, s.uso,  REGULAR,  12, GRIS_CAPTION);
  }

  // Swatches pequeños
  const ssx = 80 + 3 * (SW + SGAP);
  rect(F, ssx, y,       160, 80, BORGONA_LIGHT, { radius: 8, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, ssx, y + 90,  "#F5EAEB  —  Borgoña Light", REGULAR, 12, GRIS_CAPTION);
  rect(F, ssx, y + 120, 160, 80, GRIS_FONDO,    { radius: 8, stroke: GRIS_BORDE, sw: 1 });
  await txt(F, ssx, y + 210, "#F7F7F7  —  Gris Fondo",    REGULAR, 12, GRIS_CAPTION);

  y += SH + 72;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 2 — TIPOGRAFÍA
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "02 — Escala Tipográfica · Inter", SEMIBOLD, 24, BORGONA);
  y += 48;

  const typo = [
    { label: "H1  ·  48px  ·  Bold",      text: "Terminal Inteligente de Mendoza",                    font: BOLD,     size: 48, color: BORGONA      },
    { label: "H2  ·  32px  ·  SemiBold",  text: "Servicios de Transporte",                             font: SEMIBOLD, size: 32, color: BORGONA      },
    { label: "H3  ·  24px  ·  SemiBold",  text: "Horarios y Frecuencias",                              font: SEMIBOLD, size: 24, color: GRIS         },
    { label: "Body  ·  16px  ·  Regular", text: "Consulte los horarios disponibles hacia su destino.", font: REGULAR,  size: 16, color: GRIS         },
    { label: "Small  ·  14px  ·  Regular",text: "Salida desde Andén 7  ·  Plataforma A",               font: REGULAR,  size: 14, color: GRIS         },
    { label: "Caption  ·  12px  ·  Reg",  text: "Última actualización: 20 may 2026",                  font: REGULAR,  size: 12, color: GRIS_CAPTION  },
  ];

  for (let i = 0; i < typo.length; i++) {
    const row = typo[i];
    const rh  = row.size + 28;
    if (i % 2 === 0) rect(F, 80, y - 6, 1280, rh, GRIS_FONDO);
    await txt(F, 88, y + Math.max(0, (row.size - 11) / 2), row.label, REGULAR, 11, GRIS_LIGHT);
    await txt(F, 320, y, row.text, row.font, row.size, row.color);
    y += rh;
  }
  y += 24;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 3 — BOTONES
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "03 — Botón Primario", SEMIBOLD, 24, BORGONA);
  y += 48;

  const btns = [
    { label: "Normal",     bg: BORGONA,      tc: BLANCO,  border: null        },
    { label: "Hover",      bg: BORGONA_DARK, tc: BLANCO,  border: null        },
    { label: "Secundario", bg: BLANCO,       tc: BORGONA, border: BORGONA     },
  ];
  for (let i = 0; i < btns.length; i++) {
    const b  = btns[i];
    const bx = 80 + i * 240;
    await txt(F, bx, y, b.label, REGULAR, 12, GRIS_CAPTION);
    rect(F, bx, y + 22, 180, 48, b.bg, { radius: 8, stroke: b.border, sw: 2 });
    const bt = await txt(F, bx, y + 36, "Ver Horarios", BOLD, 14, b.tc, { w: 180, align: "CENTER" });
  }
  y += 100;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 4 — NAVBAR
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "04 — Navbar", SEMIBOLD, 24, BORGONA);
  y += 48;

  const nav = frame(F, "Navbar", 80, y, 1280, 72, BORGONA);
  nav.cornerRadius = 8;
  await txt(nav, 24, 13, "TIM", BOLD, 24, BLANCO);
  await txt(nav, 24, 43, "Terminal Inteligente de Mendoza", REGULAR, 11, BLANCO, { opacity: 0.6 });
  let nx = 220;
  for (const lk of ["Inicio", "Larga Distancia", "Alta Montaña", "Ruta del Vino", "Aeropuerto", "Universitario"]) {
    const lt = await txt(nav, nx, 28, lk, REGULAR, 14, BLANCO);
    nx += lt.width + 28;
  }
  y += 72 + 40;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 5 — SERVICE CARD
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "05 — Tarjeta de Servicio", SEMIBOLD, 24, BORGONA);
  y += 48;

  const card = frame(F, "Service Card", 80, y, 260, 200, BLANCO);
  card.cornerRadius  = 12;
  card.strokes       = stroke(GRIS_BORDE);
  card.strokeWeight  = 1;
  card.strokeAlign   = "INSIDE";
  card.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 2 }, radius: 12, spread: 0,
    visible: true, blendMode: "NORMAL",
  }];
  rect(card, 16, 16, 44, 44, BORGONA_LIGHT, { radius: 8 });
  await txt(card, 16, 76,  "Larga Distancia",                    SEMIBOLD, 18, BORGONA);
  await txt(card, 16, 102, "Buenos Aires  ·  Córdoba  ·  Rosario", REGULAR,  13, GRIS_CAPTION, { w: 228 });
  await txt(card, 16, 166, "Ver horarios →",                       SEMIBOLD, 14, BORGONA);
  y += 200 + 40;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 6 — FOOTER
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "06 — Footer", SEMIBOLD, 24, BORGONA);
  y += 48;

  const foot = frame(F, "Footer", 80, y, 1280, 120, GRIS);
  foot.cornerRadius = 8;
  await txt(foot, 32, 18, "TIM — Terminal Inteligente de Mendoza",        BOLD,    16, BLANCO);
  await txt(foot, 32, 44, "Juan B. Alberdi s/n, M5519 Guaymallén, Mendoza", REGULAR, 13, BLANCO, { opacity: 0.6 });
  await txt(foot, 450, 50, "Inicio  ·  Servicios  ·  Accesibilidad  ·  Contacto", REGULAR, 14, BLANCO, { opacity: 0.7 });
  await txt(foot, 1072, 50, "© 2026 Nexo Studio",                          REGULAR, 12, BLANCO, { opacity: 0.4 });
  y += 120 + 80;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 7 — LOGOTIPO
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "07 — Logotipo", SEMIBOLD, 24, BORGONA);
  y += 48;

  // Variante 1: Principal — sobre borgoña
  const logo1 = frame(F, "Logo / Principal", 80, y, 320, 100, BORGONA);
  logo1.cornerRadius = 10;
  await txt(logo1, 24, 16, "TIM", BOLD, 32, BLANCO);
  await txt(logo1, 24, 56, "Terminal Inteligente de Mendoza", REGULAR, 12, BLANCO, { opacity: 0.7 });
  await txt(F, 80, y + 110, "Principal — sobre borgoña", REGULAR, 12, GRIS_CAPTION);

  // Variante 2: Sobre blanco
  const logo2 = frame(F, "Logo / Sobre Blanco", 440, y, 320, 100, BLANCO);
  logo2.cornerRadius = 10;
  logo2.strokes      = stroke(GRIS_BORDE);
  logo2.strokeWeight = 1;
  logo2.strokeAlign  = "INSIDE";
  await txt(logo2, 24, 16, "TIM", BOLD, 32, BORGONA);
  await txt(logo2, 24, 56, "Terminal Inteligente de Mendoza", REGULAR, 12, GRIS_CAPTION);
  await txt(F, 440, y + 110, "Sobre fondo blanco", REGULAR, 12, GRIS_CAPTION);

  // Variante 3: Ícono tema claro
  const logo3 = frame(F, "Logo / Ícono", 800, y, 80, 80, BORGONA);
  logo3.cornerRadius = 14;
  await txt(logo3, 0, 22, "TIM", BOLD, 24, BLANCO, { w: 80, align: "CENTER" });
  await txt(F, 800, y + 90, "Ícono — tema claro", REGULAR, 12, GRIS_CAPTION);

  // Variante 4: Ícono tema oscuro
  const logo4 = frame(F, "Logo / Ícono Dark", 920, y, 80, 80, BORGONA_LIGHT);
  logo4.cornerRadius = 14;
  logo4.strokes      = stroke(GRIS_BORDE);
  logo4.strokeWeight = 1;
  logo4.strokeAlign  = "INSIDE";
  await txt(logo4, 0, 22, "TIM", BOLD, 24, BORGONA, { w: 80, align: "CENTER" });
  await txt(F, 920, y + 90, "Ícono — tema oscuro", REGULAR, 12, GRIS_CAPTION);

  y += 130;

  // Reglas de uso
  rect(F, 80, y, 1280, 1, GRIS_BORDE);
  y += 16;
  await txt(F, 80, y, "Reglas de uso", SEMIBOLD, 13, GRIS);
  y += 22;
  await txt(F, 80, y,
    "OK  Usar sobre fondos borgoña (#722F37) o blanco (#FFFFFF)  ·  Respetar proporciones  ·  Mantener área de respiro mínima equivalente a la altura de la T",
    REGULAR, 12, GRIS_CAPTION, { w: 1280 });
  y += 20;
  await txt(F, 80, y,
    "NO  Rotar ni distorsionar  ·  Cambiar la tipografía  ·  Usar sobre fondos con bajo contraste  ·  Reemplazar por otra fuente",
    REGULAR, 12, GRIS_CAPTION, { w: 1280 });
  y += 60;

  // ─────────────────────────────────────────────────────────────────────────
  // SECCIÓN 8 — MAPA DE SITIO
  // ─────────────────────────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "08 — Mapa de Sitio", SEMIBOLD, 24, BORGONA);
  y += 48;

  // Leyenda
  rect(F, 80,  y + 2, 16, 16, BORGONA,       { radius: 4 });
  await txt(F, 104, y, "Página principal",          REGULAR, 13, GRIS);
  rect(F, 290, y + 2, 16, 16, BORGONA_LIGHT,  { radius: 4, stroke: BORGONA,      sw: 1 });
  await txt(F, 314, y, "Secciones de navegación",   REGULAR, 13, GRIS);
  rect(F, 540, y + 2, 16, 16, BLANCO,         { radius: 4, stroke: GRIS_BORDE,   sw: 1 });
  await txt(F, 564, y, "Sub-páginas",               REGULAR, 13, GRIS);
  rect(F, 700, y + 2, 16, 16, GRIS_FONDO,     { radius: 4, stroke: BORGONA_LIGHT, sw: 2 });
  await txt(F, 724, y, "Páginas globales",           REGULAR, 13, GRIS);
  y += 48;

  // Dimensiones del árbol
  const SM_HOME_W = 220, SM_HOME_H = 64;
  const SM_HOME_X  = (1440 - SM_HOME_W) / 2;
  const SM_HOME_CX = SM_HOME_X + SM_HOME_W / 2;

  const SM_SEC_W = 200, SM_SEC_H = 60, SM_SEC_GAP = 56;
  const SM_TOTAL_W = 5 * SM_SEC_W + 4 * SM_SEC_GAP;
  const SM_SEC_X   = (1440 - SM_TOTAL_W) / 2;

  const SM_HOME_Y  = y;
  const SM_HLINE_Y = SM_HOME_Y + SM_HOME_H + 40;
  const SM_SEC_Y   = SM_HOME_Y + SM_HOME_H + 80;

  const SM_SUB_W = SM_SEC_W, SM_SUB_H = 44, SM_SUB_GAP = 10;
  const SM_SUB_Y = SM_SEC_Y + SM_SEC_H + 60;

  // HOME
  rect(F, SM_HOME_X, SM_HOME_Y, SM_HOME_W, SM_HOME_H, BORGONA, { radius: 10 });
  await txt(F, SM_HOME_X, SM_HOME_Y + 10, "HOME",            BOLD,    20, BLANCO, { w: SM_HOME_W, align: "CENTER" });
  await txt(F, SM_HOME_X, SM_HOME_Y + 36, "Página de inicio", REGULAR, 11, BLANCO, { w: SM_HOME_W, align: "CENTER", opacity: 0.7 });
  rect(F, SM_HOME_CX - 1, SM_HOME_Y + SM_HOME_H, 2, 40, BORGONA_LIGHT);

  // Línea horizontal que une las secciones
  const SM_LEFT_CX  = SM_SEC_X + SM_SEC_W / 2;
  const SM_RIGHT_CX = SM_SEC_X + 4 * (SM_SEC_W + SM_SEC_GAP) + SM_SEC_W / 2;
  rect(F, SM_LEFT_CX, SM_HLINE_Y, SM_RIGHT_CX - SM_LEFT_CX, 2, BORGONA_LIGHT);

  // Secciones y sub-páginas
  const smSections = [
    { name: "Larga Distancia", subs: ["Destinos", "Horarios y Tarifas", "Compra de Pasajes"] },
    { name: "Alta Montaña",    subs: ["Destinos", "Horarios y Clima",   "Temporadas"]        },
    { name: "Ruta del Vino",   subs: ["Circuitos", "Bodegas y Paradas", "Horarios"]          },
    { name: "Aeropuerto",      subs: ["Llegadas",  "Salidas",           "Conexiones"]        },
    { name: "Universitario",   subs: ["Rutas",     "Horarios y Pases",  "Mapa de Paradas"]   },
  ];

  for (let i = 0; i < smSections.length; i++) {
    const sx  = SM_SEC_X + i * (SM_SEC_W + SM_SEC_GAP);
    const scx = sx + SM_SEC_W / 2;

    // Conector vertical desde la línea horizontal al box de sección
    rect(F, scx - 1, SM_HLINE_Y, 2, SM_SEC_Y - SM_HLINE_Y, BORGONA_LIGHT);

    // Box de sección
    rect(F, sx, SM_SEC_Y, SM_SEC_W, SM_SEC_H, BORGONA_LIGHT, { radius: 8, stroke: BORGONA, sw: 1 });
    await txt(F, sx, SM_SEC_Y + 8,  smSections[i].name,   SEMIBOLD, 14, BORGONA,      { w: SM_SEC_W, align: "CENTER" });
    await txt(F, sx, SM_SEC_Y + 32, "Sección " + (i + 1), REGULAR,  10, GRIS_CAPTION, { w: SM_SEC_W, align: "CENTER" });

    // Conector vertical al primer sub-página
    rect(F, scx - 1, SM_SEC_Y + SM_SEC_H, 2, 60, GRIS_BORDE);

    // Sub-páginas
    for (let j = 0; j < smSections[i].subs.length; j++) {
      const suby = SM_SUB_Y + j * (SM_SUB_H + SM_SUB_GAP);
      if (j > 0) rect(F, scx - 1, suby - SM_SUB_GAP, 2, SM_SUB_GAP, GRIS_BORDE);
      rect(F, sx, suby, SM_SUB_W, SM_SUB_H, BLANCO, { radius: 6, stroke: GRIS_BORDE, sw: 1 });
      await txt(F, sx, suby + 6,  smSections[i].subs[j], REGULAR, 13, GRIS,       { w: SM_SUB_W, align: "CENTER" });
      await txt(F, sx, suby + 25, "Sub-página",           REGULAR, 10, GRIS_LIGHT, { w: SM_SUB_W, align: "CENTER" });
    }
  }

  const smSubBottom = SM_SUB_Y + 3 * (SM_SUB_H + SM_SUB_GAP) - SM_SUB_GAP;
  y = smSubBottom + 60;

  // Páginas globales
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "Páginas Globales", SEMIBOLD, 20, BORGONA);
  await txt(F, 340, y + 4,
    "Accesibles desde cualquier sección a través de la barra de navegación",
    REGULAR, 12, GRIS_CAPTION);
  y += 40;

  const smGlobals = [
    { name: "Accesibilidad",    sub: "Guía de uso del sitio" },
    { name: "Contacto / Ayuda", sub: "Consultas y soporte"   },
  ];
  for (let i = 0; i < smGlobals.length; i++) {
    rect(F, 80 + i * 240, y, 200, 56, GRIS_FONDO, { radius: 8, stroke: BORGONA_LIGHT, sw: 2 });
    await txt(F, 80 + i * 240, y + 8,  smGlobals[i].name, SEMIBOLD, 14, BORGONA,      { w: 200, align: "CENTER" });
    await txt(F, 80 + i * 240, y + 32, smGlobals[i].sub,  REGULAR,  10, GRIS_CAPTION, { w: 200, align: "CENTER" });
  }
  y += 56 + 80;

  // Ajustar altura del frame al contenido
  F.resize(1440, y);
  figma.viewport.scrollAndZoomIntoView([F]);
  return "✅ Frame UI Kit construido (" + y + "px de alto)";
}

// ── PASO 5: CARPETA DE DISEÑO ────────────────────────────────────────────────
async function buildDocumentation() {
  const page = figma.root.children.find(p => p.name === "Carpeta de Diseño");
  if (!page) throw new Error("Página 'Carpeta de Diseño' no encontrada.");
  figma.currentPage = page;

  page.findChildren(n => n.name === "Carpeta de Diseño — TIM").forEach(n => n.remove());

  const uiKitFrame = page.findChildren(n => n.name === "UI Kit — TIM")[0];
  const startX = uiKitFrame ? uiKitFrame.x + uiKitFrame.width + 120 : 0;

  const F = frame(page, "Carpeta de Diseño — TIM", startX, 0, 1440, 100, BLANCO);
  let y = 60;

  // ── ENCABEZADO ──────────────────────────────────────────────────────────
  await txt(F, 80, y, "Carpeta de Diseño", BOLD, 48, BORGONA);
  y += 68;
  await txt(F, 80, y, "Terminal Inteligente de Mendoza  ·  Nexo Studio  ·  UADE DDW1C26  ·  Mayo 2026", REGULAR, 16, GRIS_CAPTION);
  y += 32;
  rect(F, 80, y, 1280, 2, BORGONA);
  y += 48;

  // ── 01 — PRESENTACIÓN DEL PROYECTO ──────────────────────────────────────
  await txt(F, 80, y, "01 — Presentación del Proyecto", SEMIBOLD, 24, BORGONA);
  y += 44;

  const brief = frame(F, "Brief del Proyecto", 80, y, 840, 180, GRIS_FONDO);
  brief.cornerRadius = 12;
  await txt(brief, 24, 18, "TIM — Terminal Inteligente de Mendoza", BOLD, 16, BORGONA);
  await txt(brief, 24, 46,
    "Plataforma web informativa para el Centro de Transporte de Mendoza. Centraliza horarios,\n" +
    "destinos y servicios de sus cinco líneas de transporte. Objetivo: brindar una herramienta\n" +
    "digital ágil, clara y accesible para planificar viajes y consultar horarios en tiempo real.",
    REGULAR, 13, GRIS, { w: 792 });
  await txt(brief, 24, 128, "Tipos de transporte:", SEMIBOLD, 12, GRIS);
  await txt(brief, 24, 148,
    "Larga Distancia  ·  Alta Montaña  ·  Ruta del Vino  ·  Aeropuerto / Metrotranvía  ·  Universitario",
    REGULAR, 12, GRIS_CAPTION, { w: 792 });

  const metaCard = frame(F, "Ficha del Proyecto", 940, y, 400, 180, BORGONA_LIGHT);
  metaCard.cornerRadius = 12;
  await txt(metaCard, 24, 18, "Ficha del Proyecto", SEMIBOLD, 13, BORGONA);
  const metaRows = [
    ["Consultora",    "Nexo Studio"],
    ["Materia",       "Desarrollo Web  1C 2026"],
    ["Universidad",   "UADE"],
    ["Fecha",         "Mayo 2026"],
  ];
  for (let i = 0; i < metaRows.length; i++) {
    await txt(metaCard, 24, 48 + i * 30, metaRows[i][0] + ":", SEMIBOLD, 12, BORGONA);
    await txt(metaCard, 150, 48 + i * 30, metaRows[i][1],      REGULAR,  12, GRIS);
  }
  y += 180 + 40;

  // ── 02 — UBICACIÓN Y CONTEXTO ────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "02 — Ubicación y Contexto", SEMIBOLD, 24, BORGONA);
  y += 44;

  const locCard = frame(F, "Ubicación", 80, y, 1280, 110, GRIS_FONDO);
  locCard.cornerRadius = 12;
  await txt(locCard, 24, 16, "Juan B. Alberdi s/n, M5519 Guaymallén, Mendoza", BOLD, 14, BORGONA);
  await txt(locCard, 24, 44,
    "La terminal se ubica en el límite entre la Ciudad de Mendoza y el Municipio de Guaymallén. " +
    "Es el punto de conexión de la Ruta Nacional 7 (Acceso Este) con la Ruta 40,\n" +
    "siendo el principal paso terrestre hacia la cordillera y la República de Chile. " +
    "Hub de movilidad más importante de la provincia.",
    REGULAR, 13, GRIS, { w: 1232 });
  await txt(locCard, 24, 90, "Contexto: Mixto  —  altamente urbano y turístico", REGULAR, 11, GRIS_CAPTION);
  y += 110 + 40;

  // ── 03 — PÚBLICO OBJETIVO ────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "03 — Público Objetivo", SEMIBOLD, 24, BORGONA);
  y += 44;

  const publicos = [
    {
      titulo: "Turistas Nacionales e Internacionales",
      items: [
        "Buscan información rápida y mapas claros.",
        "Priorizan iconos universales para orientarse.",
        "No necesariamente dominan el idioma local.",
      ],
    },
    {
      titulo: "Estudiantes y Trabajadores",
      items: [
        "Viajeros frecuentes con necesidades diarias.",
        "Consultan demoras, frecuencias y paradas.",
        "Valoran velocidad de carga y uso móvil.",
      ],
    },
    {
      titulo: "Adultos Mayores y Personas con Discapacidad",
      items: [
        "Requieren accesibilidad cognitiva y visual.",
        "Botones amplios de mínimo 44x44px (WCAG).",
        "Contraste alto y tipografía grande.",
      ],
    },
  ];
  for (let i = 0; i < publicos.length; i++) {
    const px = 80 + i * 430;
    const pc = frame(F, publicos[i].titulo, px, y, 400, 160, GRIS_FONDO);
    pc.cornerRadius = 10;
    pc.strokes = stroke(BORGONA_LIGHT); pc.strokeWeight = 1.5; pc.strokeAlign = "INSIDE";
    await txt(pc, 20, 16, publicos[i].titulo, SEMIBOLD, 13, BORGONA, { w: 360 });
    for (let j = 0; j < publicos[i].items.length; j++) {
      await txt(pc, 20, 54 + j * 30, "- " + publicos[i].items[j], REGULAR, 12, GRIS, { w: 360 });
    }
  }
  y += 160 + 40;

  // ── 04 — IDENTIDAD VISUAL ────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "04 — Identidad Visual", SEMIBOLD, 24, BORGONA);
  y += 44;

  await txt(F, 80, y, "Paleta de Colores", SEMIBOLD, 14, GRIS);
  y += 28;

  const colores = [
    { hex: BORGONA,       nombre: "Borgoña / Vino",  uso: "Acción · Botones · Títulos",    textCol: BLANCO,  borde: false },
    { hex: BLANCO,        nombre: "Blanco Nieve",     uso: "Fondos · Espacios en blanco",   textCol: GRIS,    borde: true  },
    { hex: GRIS,          nombre: "Gris Cordillera",  uso: "Texto · Estructura",            textCol: BLANCO,  borde: false },
    { hex: BORGONA_LIGHT, nombre: "Borgoña Claro",    uso: "Fondos suaves · Hover",         textCol: BORGONA, borde: false },
    { hex: GRIS_FONDO,    nombre: "Gris Fondo",       uso: "Fondos de tarjetas",            textCol: GRIS,    borde: true  },
  ];
  for (let i = 0; i < colores.length; i++) {
    const cx = 80 + i * 258;
    const sw = frame(F, "Color/" + colores[i].nombre, cx, y, 228, 84, colores[i].hex);
    sw.cornerRadius = 10;
    if (colores[i].borde) {
      sw.strokes = stroke(GRIS_BORDE); sw.strokeWeight = 1; sw.strokeAlign = "INSIDE";
    }
    await txt(sw, 16, 12, "#" + colores[i].hex,    BOLD,    14, colores[i].textCol);
    await txt(sw, 16, 36, colores[i].nombre,        REGULAR, 11, colores[i].textCol, { opacity: 0.8 });
    await txt(sw, 16, 56, colores[i].uso,           REGULAR, 10, colores[i].textCol, { opacity: 0.6 });
  }
  y += 84 + 28;

  await txt(F, 80, y, "Tipografía  —  Inter (Google Fonts)", SEMIBOLD, 14, GRIS);
  y += 28;

  const tipos = [
    { nombre: "H1 — Título",    size: 22, font: BOLD,     muestra: "Terminal Inteligente"        },
    { nombre: "H2 — Sección",   size: 18, font: BOLD,     muestra: "Servicios de Transporte"     },
    { nombre: "H3 — Subtítulo", size: 15, font: SEMIBOLD, muestra: "Horarios y Frecuencias"      },
    { nombre: "Body",           size: 13, font: REGULAR,  muestra: "Consulte los horarios disp." },
    { nombre: "Caption",        size: 11, font: REGULAR,  muestra: "Ult. actualiz.: 20 may 2026" },
  ];
  for (let i = 0; i < tipos.length; i++) {
    const tc = frame(F, "Tipo/" + tipos[i].nombre, 80 + i * 258, y, 228, 120, GRIS_FONDO);
    tc.cornerRadius = 8;
    await txt(tc, 16, 10, tipos[i].nombre,   REGULAR, 10, GRIS_CAPTION);
    await txt(tc, 16, 32, tipos[i].muestra,  tipos[i].font, tipos[i].size, GRIS, { w: 196 });
    await txt(tc, 16, 100, "Inter " + tipos[i].size + "px  ·  pesos 400/600/700", REGULAR, 10, BORGONA);
  }
  y += 120 + 60;

  // ── 05 — JUSTIFICACIÓN DE DISEÑO ─────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "05 — Justificación de Diseño", SEMIBOLD, 24, BORGONA);
  y += 44;

  const justif = [
    {
      titulo: "Colores y Tipografía",
      body:
        "Inter sin serifas con alta altura de x. " +
        "Contraste #333333 / #FFFFFF cumple WCAG AA/AAA. " +
        "Borgoña (#722F37) exclusivo para CTAs: guía el ojo sin saturar la interfaz.",
    },
    {
      titulo: "Navegación y UX",
      body:
        "Heurísticas de Nielsen: de lo general a lo particular. " +
        "Pantalla principal resuelve el 80% de las necesidades. " +
        "Arquitectura plana, máximo 2 niveles de profundidad.",
    },
    {
      titulo: "Accesibilidad WCAG",
      body:
        "Botones Mobile-First mínimo 44x44px (WCAG 2.5.5). " +
        "Contraste mayor a 4.5:1 (WCAG 1.4.3 AA). " +
        "Alt-text en todas las imágenes. Tabla ARIA navegable por teclado.",
    },
    {
      titulo: "Estética General",
      body:
        "Minimalismo funcional (Flat Design). " +
        "Espacio en blanco para reducir carga cognitiva. " +
        "Cada elemento visual tiene una función clara.",
    },
  ];
  for (let i = 0; i < justif.length; i++) {
    const jx = 80 + i * 322;
    const jc = frame(F, "Justif/" + justif[i].titulo, jx, y, 292, 170, GRIS_FONDO);
    jc.cornerRadius = 10;
    jc.strokes = stroke(BORGONA_LIGHT); jc.strokeWeight = 1.5; jc.strokeAlign = "INSIDE";
    await txt(jc, 20, 16, justif[i].titulo, SEMIBOLD, 13, BORGONA);
    await txt(jc, 20, 46, justif[i].body,   REGULAR,  12, GRIS, { w: 252 });
  }
  y += 170 + 40;

  // ── 06 — MAPA DE SITIO ───────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "06 — Mapa de Sitio", SEMIBOLD, 24, BORGONA);
  y += 44;

  const sitemap = [
    { tipo: "HOME",    nombre: "Terminal Inteligente de Mendoza",    desc: "Página principal: buscador de viajes, horarios destacados y accesos rápidos." },
    { tipo: "Pag. 1",  nombre: "Larga Distancia (Nacional)",          desc: "Micros hacia Buenos Aires, Córdoba, Rosario y otros destinos nacionales." },
    { tipo: "Pag. 2",  nombre: "Interurbano (Alta Montaña)",          desc: "Línea interurbana hacia Uspallata, Potrerillos y Valle de Uco." },
    { tipo: "Pag. 3",  nombre: "Turismo (Ruta del Vino)",             desc: "Combis y micros turísticos hacia bodegas y destinos enoturisticos." },
    { tipo: "Pag. 4",  nombre: "Aeropuerto / Metrotranvía",           desc: "Conexión al Aeropuerto Francisco Gabrielli y la red de Metrotranvía." },
    { tipo: "Pag. 5",  nombre: "Transporte Universitario",            desc: "UNCuyo, UTN y campus del Gran Mendoza. Frecuencias académicas." },
    { tipo: "Global",  nombre: "Accesibilidad",                       desc: "Guía de uso del sitio. Accesible desde cualquier sección." },
    { tipo: "Global",  nombre: "Contacto / Ayuda",                    desc: "Consultas y soporte al usuario." },
  ];

  const TH = 36, TD = 46, tableW = 1280;
  rect(F, 80, y, tableW, TH, BORGONA, { radius: 8 });
  await txt(F, 96,  y + 10, "Tipo",        SEMIBOLD, 12, BLANCO);
  await txt(F, 220, y + 10, "Página",      SEMIBOLD, 12, BLANCO);
  await txt(F, 610, y + 10, "Descripción", SEMIBOLD, 12, BLANCO);
  y += TH;

  for (let i = 0; i < sitemap.length; i++) {
    const rowBg   = i % 2 === 0 ? GRIS_FONDO : BLANCO;
    const isHome   = sitemap[i].tipo === "HOME";
    const isGlobal = sitemap[i].tipo === "Global";
    const tipoFont = isHome ? SEMIBOLD : REGULAR;
    const tipoCol  = isHome ? BORGONA  : (isGlobal ? GRIS_CAPTION : GRIS);
    rect(F, 80, y, tableW, TD, rowBg, { stroke: GRIS_BORDE, sw: 1 });
    await txt(F, 96,  y + 14, sitemap[i].tipo,   tipoFont, 12, tipoCol);
    await txt(F, 220, y + 14, sitemap[i].nombre,  isHome ? SEMIBOLD : REGULAR, 13, GRIS);
    await txt(F, 610, y + 14, sitemap[i].desc,    REGULAR, 12, GRIS_CAPTION, { w: 720 });
    y += TD;
  }
  y += 40;

  // ── 07 — FRAMEWORKS Y TECNOLOGÍAS ─────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "07 — Frameworks y Tecnologías", SEMIBOLD, 24, BORGONA);
  y += 44;

  const techs = [
    {
      nombre:  "Tailwind CSS",
      funcion: "Framework CSS utilitario. Diseño 100% responsive mediante clases de utilidad.",
      just:    "Archivos livianos. Esencial para buena carga en conexiones 3G/4G en ruta.",
    },
    {
      nombre:  "React.js",
      funcion: "Librería front-end para interfaces modulares y gestión del estado sin recarga.",
      just:    "Componentes aislados: cada integrante desarrolla su pagina de forma independiente.",
    },
    {
      nombre:  "React Router",
      funcion: "Enrutamiento SPA: navegación entre páginas sin recarga completa del navegador.",
      just:    "Transiciones fluidas entre HOME y las 5 páginas de servicio en mobile.",
    },
    {
      nombre:  "Figma",
      funcion: "Diseño UI/UX: wireframes, prototipos interactivos y sistema de diseño colaborativo.",
      just:    "Cada integrante diseña su página con componentes compartidos del UI Kit.",
    },
  ];
  for (let i = 0; i < techs.length; i++) {
    const tx = 80 + i * 322;
    const tc = frame(F, "Tech/" + techs[i].nombre, tx, y, 292, 180, GRIS_FONDO);
    tc.cornerRadius = 10;
    await txt(tc, 20, 16, techs[i].nombre,  BOLD,    15, BORGONA);
    await txt(tc, 20, 44, techs[i].funcion,  REGULAR, 12, GRIS,        { w: 252 });
    rect(tc, 20, 112, 252, 1, GRIS_BORDE);
    await txt(tc, 20, 122, "Por qué:", SEMIBOLD, 11, GRIS_CAPTION);
    await txt(tc, 20, 140, techs[i].just,    REGULAR, 11, GRIS_CAPTION, { w: 252 });
  }
  y += 180 + 40;

  // ── 08 — PERSONAS UX ─────────────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "08 — Personas UX", SEMIBOLD, 24, BORGONA);
  y += 44;

  const personas = [
    {
      nombre: "Lucía Fernández",
      perfil: "28 años  |  Viajera frecuente  |  Smartphone iOS",
      needs: [
        "Consultar horarios rápido sin crear cuenta.",
        "Comparar frecuencias de Alta Montaña.",
        "Recibir alertas de demoras.",
      ],
      pain: "Sitios lentos o con mucho texto.",
    },
    {
      nombre: "Marco Pellegrini",
      perfil: "35 años  |  Turista (Italia)  |  Notebook macOS",
      needs: [
        "Encontrar combis a bodegas de Luján de Cuyo.",
        "Entender servicios sin dominar el español.",
        "Ver un mapa de recorridos.",
      ],
      pain: "Interfaces sin iconos o solo en texto.",
    },
    {
      nombre: "Elvira Gómez",
      perfil: "67 años  |  Adulta mayor  |  Computadora Windows",
      needs: [
        "Texto grande y botones amplios (mín 44px).",
        "Información de accesibilidad física de la terminal.",
        "Llamar a informes desde el sitio.",
      ],
      pain: "Contraste bajo y tipografía pequeña.",
    },
  ];
  for (let i = 0; i < personas.length; i++) {
    const px = 80 + i * 430;
    const pc = frame(F, "Persona/" + personas[i].nombre, px, y, 400, 230, GRIS_FONDO);
    pc.cornerRadius = 12;
    pc.strokes = stroke(BORGONA); pc.strokeWeight = 1.5; pc.strokeAlign = "INSIDE";
    await txt(pc, 20, 18, personas[i].nombre,  BOLD,    16, BORGONA);
    await txt(pc, 20, 46, personas[i].perfil,  REGULAR, 11, GRIS_CAPTION, { w: 360 });
    rect(pc, 20, 66, 360, 1, GRIS_BORDE);
    await txt(pc, 20, 76, "Necesidades:", SEMIBOLD, 12, GRIS);
    for (let j = 0; j < personas[i].needs.length; j++) {
      await txt(pc, 20, 100 + j * 26, "- " + personas[i].needs[j], REGULAR, 12, GRIS, { w: 360 });
    }
    await txt(pc, 20, 180, "Punto de dolor:", SEMIBOLD, 11, BORGONA);
    await txt(pc, 20, 200, personas[i].pain,   REGULAR,  12, GRIS_CAPTION, { w: 360 });
  }
  y += 230 + 40;

  // ── 09 — EQUIPO Y LINKS ÚTILES ────────────────────────────────────────────
  rect(F, 80, y, 1280, 2, GRIS_BORDE);
  y += 24;
  await txt(F, 80, y, "09 — Equipo y Links Útiles", SEMIBOLD, 24, BORGONA);
  y += 44;

  const teamCard = frame(F, "Equipo — Nexo Studio", 80, y, 380, 168, BORGONA_LIGHT);
  teamCard.cornerRadius = 12;
  await txt(teamCard, 24, 18, "Equipo — Nexo Studio", BOLD, 14, BORGONA);
  const integrantes = [
    { nombre: "Lucía Gavilanes",            rol: "Diseñadora UI"        },
    { nombre: "Valentina Martins",          rol: "Diseñadora UX"        },
    { nombre: "M. del Rosario Presedo V.",  rol: "Front-end Developer"  },
    { nombre: "Mora Raimondo",              rol: "Marketing"            },
    { nombre: "Martina Sol Sama",           rol: "Research"             },
  ];
  for (let i = 0; i < integrantes.length; i++) {
    const ry = 50 + i * 24;
    await txt(teamCard, 24, ry, integrantes[i].nombre, SEMIBOLD, 12, GRIS);
    await txt(teamCard, 220, ry, integrantes[i].rol,   REGULAR,  12, GRIS_CAPTION);
  }

  // ── Grupo TIM: 5 páginas del proyecto (grid 3x2 al lado del card Equipo) ──
  const timLinks = [
    { label: "TIM — Larga Distancia",           url: "mrosariopresedo.github.io/tim-larga-distancia/" },
    { label: "TIM — Ruta del Vino",             url: "valmartins222.github.io/Ruta-del-vino/" },
    { label: "TIM — Transporte Universitario",  url: "martinasama2005.github.io/ciudaduniversitaria/" },
    { label: "TIM — Alta Montaña",              url: "luligavilanes.github.io/altamonta-a/" },
    { label: "TIM — Aeropuerto / Metrotranvía", url: "Pendiente — link a confirmar" },
  ];
  const timW = 270, timH = 72, timGapX = 25, timGapY = 12, timCols = 3;
  await txt(F, 500, y - 22, "Páginas del Proyecto (GitHub Pages)", SEMIBOLD, 12, BORGONA);
  for (let i = 0; i < timLinks.length; i++) {
    const col = i % timCols;
    const row = Math.floor(i / timCols);
    const lx = 500 + col * (timW + timGapX);
    const ly = y + row * (timH + timGapY);
    rect(F, lx, ly, timW, timH, BORGONA_LIGHT, { radius: 8, stroke: GRIS_BORDE, sw: 1 });
    await txt(F, lx + 16, ly + 12, timLinks[i].label, SEMIBOLD, 13, BORGONA,      { w: timW - 32 });
    await txt(F, lx + 16, ly + 38, timLinks[i].url,   REGULAR,  11, GRIS_CAPTION, { w: timW - 32 });
  }
  const timGridH = 2 * timH + timGapY; // 156px
  const topRowH = Math.max(168, timGridH);

  // ── Grupo Consultora: Nexo Studio + Figma (fila inferior, centrada) ──────
  const consLinks = [
    { label: "Nexo Studio — Sitio Consultora", url: "mrosariopresedo.github.io/nexo-studio/" },
    { label: "Figma — Archivo TIM",            url: "figma.com/design/nBxnFJ0ZE88FZ88FiJNLRX/TIM---Terminal-Inteligente-de-Mendoza" },
  ];
  const consW = 400, consH = 72, consGapX = 40;
  const consTotalW = consLinks.length * consW + (consLinks.length - 1) * consGapX; // 840
  const consStartX = Math.round((1440 - consTotalW) / 2); // centrado en frame 1440
  const consY = y + topRowH + 28;
  await txt(F, consStartX, consY - 22, "Consultora y Diseño", SEMIBOLD, 12, BORGONA);
  for (let i = 0; i < consLinks.length; i++) {
    const lx = consStartX + i * (consW + consGapX);
    rect(F, lx, consY, consW, consH, BORGONA_LIGHT, { radius: 8, stroke: GRIS_BORDE, sw: 1 });
    await txt(F, lx + 16, consY + 12, consLinks[i].label, SEMIBOLD, 13, BORGONA,      { w: consW - 32 });
    await txt(F, lx + 16, consY + 38, consLinks[i].url,   REGULAR,  11, GRIS_CAPTION, { w: consW - 32 });
  }
  y += topRowH + 28 + consH + 80;

  F.resize(1440, y);
  figma.viewport.scrollAndZoomIntoView([F]);
  return "Carpeta de Diseño construida (" + y + "px de alto)";
}

// ── ENTRY POINT ───────────────────────────────────────────────────────────────
figma.showUI(__html__, { width: 420, height: 460, title: "TIM — UI Kit" });

figma.ui.onmessage = async (msg) => {
  const post = (text) => figma.ui.postMessage({ type: "log", text });

  if (msg.type === "run") {
    try {
      post("Cargando fuentes Inter...");
      await figma.loadFontAsync(BOLD);
      await figma.loadFontAsync(SEMIBOLD);
      await figma.loadFontAsync(REGULAR);
      post("Fuentes cargadas");

      post("");
      post("-- Paso 1: Validando paginas --");
      const pageLog = validatePages();
      pageLog.forEach(l => post(l));

      post("");
      post("-- Paso 2: Estilos de color --");
      post(createColorStyles());

      post("");
      post("-- Paso 3: Estilos de texto --");
      post(await createTextStyles());

      post("");
      post("-- Paso 4: Frame UI Kit --");
      post(await buildUIKit());

      post("");
      post("-- Paso 5: Carpeta de Diseño --");
      post(await buildDocumentation());

      post("");
      post("UI Kit TIM listo en la página Carpeta de Diseño");
      figma.ui.postMessage({ type: "done" });
      figma.notify("UI Kit TIM generado!", { timeout: 4000 });
    } catch (err) {
      figma.ui.postMessage({ type: "error", text: err.message });
      figma.notify("Error: " + err.message, { error: true });
      console.error(err);
    }
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};
};
