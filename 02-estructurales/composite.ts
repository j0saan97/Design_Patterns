// COMPOSITE
// Compone objetos en estructuras de árbol y trata igual a hojas y a grupos.
// Ejemplo: sistema de archivos (archivos y carpetas).

interface Nodo {
  nombre: string;
  getTamano(): number;
  imprimir(indent?: string): void;
}

class Archivo implements Nodo {
  constructor(public nombre: string, private tamano: number) {}
  getTamano() { return this.tamano; }
  imprimir(indent = "") { console.log(`${indent}📄 ${this.nombre} (${this.tamano} KB)`); }
}

class Carpeta implements Nodo {
  private hijos: Nodo[] = [];
  constructor(public nombre: string) {}

  agregar(nodo: Nodo) { this.hijos.push(nodo); return this; }

  getTamano() { return this.hijos.reduce((total, h) => total + h.getTamano(), 0); }

  imprimir(indent = "") {
    console.log(`${indent}📁 ${this.nombre} (${this.getTamano()} KB)`);
    this.hijos.forEach((h) => h.imprimir(indent + "  "));
  }
}

const src = new Carpeta("src")
  .agregar(new Archivo("index.ts", 4))
  .agregar(new Carpeta("components").agregar(new Archivo("Mesa.tsx", 12)).agregar(new Archivo("Carta.tsx", 3)));

const proyecto = new Carpeta("proyecto").agregar(src).agregar(new Archivo("package.json", 1));

proyecto.imprimir();

export {};
