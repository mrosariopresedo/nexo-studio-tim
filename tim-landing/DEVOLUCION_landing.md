# Devolución — Landing / HOME (`tim-landing/`) vs. Documento de Proyecto TIM

Revisión de coherencia de la página principal del sitio (`tim-landing/`: `index.html` + `estilos/style.css` + `js/main.js`) contra el documento de proyecto y el UI Kit. **Solo contradicciones**, no mejoras de excelencia.

## Lo que sí cumple (para no tocar)

Es la página más fiel al sistema de diseño:

- **Paleta exacta:** `#722F37`, `#5A2229` (hover), `#FFFFFF`, `#333333`, más apoyos del kit (`#F5EAEB`, `#F7F7F7`, `#DDDDDD`, `#666666`). Sin colores fuera de sistema en el modo normal.
- **Componentes del kit:** navbar sticky borgoña con "TIM" + 5 links + botón Accesibilidad; footer oscuro de 4 columnas; service cards (5, con ícono/nombre/acceso); search bar de 3 campos.
- **Mapa de sitio correcto:** los 5 links del navbar y del footer apuntan a las páginas reales de cada integrante en GitHub Pages.
- **Iconografía propia:** sprite SVG e íconos de servicio SVG (sin fotos en esas piezas).
- **Tipografía Inter** cargada desde Google Fonts.
- **Accesibilidad real:** el botón Accesibilidad **funciona** — panel con `role="dialog"`, toggles `role="switch"` + `aria-checked`, `aria-expanded`, y modos "alto contraste" y "texto grande". Tap target del toggle de 44px. Supera lo que pide el documento.

## Incoherencias detectadas

| # | Aspecto | Documento | En la página | Severidad |
|---|---|---|---|---|
| 1 | **Fotos de stock** | "Sin fotografías de stock genéricas. Se priorizarán ilustraciones del sistema de diseño." | Usa **fotos de Unsplash**: 4 en el hero (difuminadas de fondo, `alt=""` decorativas → aceptable) y **3 en "Destacados"** como contenido editorial con `alt`. Estas últimas contradicen la regla. | Media |
| 2 | **Responsive / Mobile-First** | Mobile-First, escala desde 375px | Grids de columnas fijas sin breakpoints: `grid-cols-5` (servicios), `grid-cols-3` (cómo usar / destacados), footer `2fr_1fr_1fr_1fr`. En móvil quedan comprimidos (solo el navbar usa `overflow-x-auto`). | Media-alta |
| 3 | **Pesos tipográficos** | Inter 400/600/700 | Carga y usa `500` (`font-medium`) y `800` (`font-extrabold`, en H1, section-title y logo). | Media |
| 4 | **Contraste** | ≥4.5:1 (WCAG AA) | `#888888` (tim-subtle) sobre blanco ≈3.5:1, usado en fechas de "Destacados" y placeholder del buscador. | Media |
| 5 | **Cuerpo mínimo** | Tipografía de cuerpo mínima 16px | Labels del buscador a `10px` y varias etiquetas a `11px`/`13px`. Aceptables como *caption* del kit, pero por debajo del mínimo de cuerpo. | Baja |
| 6 | **Foco visible** | Navegación por teclado | A diferencia de las páginas de servicio, el CSS no define `:focus-visible` propio (queda el del navegador). | Baja |

## Recomendación de foco

Dos puntos de fondo: **(1)** reemplazar las 3 fotos de stock de "Destacados" por ilustraciones del sistema (o acordar con la cátedra una excepción para piezas editoriales), y **(2)** hacer responsive los grids con breakpoints de Tailwind (`sm:`/`md:`/`lg:`) para cumplir el Mobile-First desde 375px. El resto son ajustes rápidos: limitar pesos a 400/600/700 y subir el contraste de `#888888` a `#666666` en texto informativo.

*Generado el 18/06/2026 · Nexo Studio — control de coherencia Actividad 2.*
