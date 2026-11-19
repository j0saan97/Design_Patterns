// PROTOTYPE
// Crea objetos nuevos clonando uno existente en vez de construirlos desde cero.
// Ejemplo: plantillas de configuración de mesa.

interface Prototipo<T> {
  clonar(): T;
}

class ConfigMesa implements Prototipo<ConfigMesa> {
  constructor(
    public nombre: string,
    public ciegas: [number, number],
    public jugadores: number,
    public tags: string[],
  ) {}

  clonar(): ConfigMesa {
    // Copia profunda de los arrays para no compartir referencias
    return new ConfigMesa(this.nombre, [...this.ciegas] as [number, number], this.jugadores, [...this.tags]);
  }
}

const base = new ConfigMesa("NL25 6-max", [0.1, 0.25], 6, ["cash", "zoom"]);

const headsUp = base.clonar();
headsUp.nombre = "NL25 HU";
headsUp.jugadores = 2;
headsUp.tags.push("hu");

console.log(base);
console.log(headsUp);

export {};
