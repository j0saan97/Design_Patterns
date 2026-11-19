// TEMPLATE METHOD
// La superclase define el esqueleto de un algoritmo; las subclases rellenan algunos pasos.
// Ejemplo: exportar un informe a distintos formatos.

type Fila = { fecha: string; resultado: number };

abstract class Exportador {
  // El método plantilla: el orden de pasos es fijo
  exportar(datos: Fila[]): string {
    const filtrados = this.filtrar(datos);
    return this.cabecera() + this.cuerpo(filtrados) + this.pie();
  }

  // Paso común (hook) que se puede sobrescribir
  protected filtrar(datos: Fila[]) { return datos; }

  // Pasos que cada subclase implementa
  protected abstract cabecera(): string;
  protected abstract cuerpo(datos: Fila[]): string;
  protected pie() { return ""; }
}

class ExportadorCSV extends Exportador {
  protected cabecera() { return "fecha,resultado\n"; }
  protected cuerpo(d: Fila[]) { return d.map((f) => `${f.fecha},${f.resultado}`).join("\n"); }
}

class ExportadorJSONGanancias extends Exportador {
  protected filtrar(d: Fila[]) { return d.filter((f) => f.resultado > 0); }
  protected cabecera() { return "["; }
  protected cuerpo(d: Fila[]) { return d.map((f) => JSON.stringify(f)).join(","); }
  protected pie() { return "]"; }
}

const sesiones: Fila[] = [
  { fecha: "2026-11-17", resultado: 42.5 },
  { fecha: "2026-11-18", resultado: -18 },
];

console.log(new ExportadorCSV().exportar(sesiones));
console.log(new ExportadorJSONGanancias().exportar(sesiones));

export {};
