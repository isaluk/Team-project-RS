const SVG_NS = 'http://www.w3.org/2000/svg';

const STROKE_PATHS = {
  cart: [
    'M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H5.1',
    'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    'M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  ],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'm20 20-3.5-3.5'],
  menu: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  close: ['M5 5l14 14', 'M19 5 5 19'],
  filter: ['M3 5h18', 'M6 12h12', 'M10 19h4'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6'],
  check: ['M20 6 9 17l-5-5'],
} as const;

export type IconName = keyof typeof STROKE_PATHS;

function createSvg(size: number): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return svg;
}

export function icon(name: IconName, size = 20): SVGSVGElement {
  const svg = createSvg(size);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.classList.add('icon');

  for (const d of STROKE_PATHS[name]) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}

export function star(size = 12): SVGSVGElement {
  const svg = createSvg(size);
  svg.setAttribute('fill', 'currentColor');
  svg.classList.add('star');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M12 2l1.8 7.2L21 12l-7.2 2.8L12 22l-1.8-7.2L3 12l7.2-2.8z');
  svg.append(path);
  return svg;
}

export function tornEdge(): SVGSVGElement {
  const width = 1440;
  const height = 28;

  let seed = 7;
  const random = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let d = `M0 ${height} L0 14`;
  let x = 0;
  while (x < width) {
    x = Math.min(width, x + 8 + random() * 22);
    d += ` L${x.toFixed(1)} ${(4 + random() * 18).toFixed(1)}`;
  }
  d += ` L${width} ${height} Z`;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('fill', 'currentColor');
  svg.classList.add('torn-edge');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}
