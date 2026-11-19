// VISITOR
// Añade operaciones nuevas a una estructura de objetos sin modificar sus clases.
// Ejemplo: figuras geométricas con operaciones de área y exportación.

interface Visitante<R> {
  visitarCirculo(c: Circulo): R;
  visitarRectangulo(r: Rectangulo): R;
}

interface Figura {
  aceptar<R>(v: Visitante<R>): R;
}

class Circulo implements Figura {
  constructor(public radio: number) {}
  aceptar<R>(v: Visitante<R>) { return v.visitarCirculo(this); }
}

class Rectangulo implements Figura {
  constructor(public ancho: number, public alto: number) {}
  aceptar<R>(v: Visitante<R>) { return v.visitarRectangulo(this); }
}

// Operación 1: calcular área
class CalculadoraArea implements Visitante<number> {
  visitarCirculo(c: Circulo) { return Math.PI * c.radio ** 2; }
  visitarRectangulo(r: Rectangulo) { return r.ancho * r.alto; }
}

// Operación 2: exportar a SVG (sin tocar Circulo ni Rectangulo)
class ExportadorSVG implements Visitante<string> {
  visitarCirculo(c: Circulo) { return `<circle r="${c.radio}" />`; }
  visitarRectangulo(r: Rectangulo) { return `<rect width="${r.ancho}" height="${r.alto}" />`; }
}

const figuras: Figura[] = [new Circulo(2), new Rectangulo(3, 4)];

const area = new CalculadoraArea();
const svg = new ExportadorSVG();
figuras.forEach((f) => console.log(f.aceptar(area).toFixed(2), f.aceptar(svg)));

export {};
