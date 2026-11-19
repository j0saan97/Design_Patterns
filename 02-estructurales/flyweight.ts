// FLYWEIGHT
// Comparte el estado común entre muchos objetos para ahorrar memoria.
// Ejemplo: miles de manos que reutilizan las mismas 52 cartas.

class Carta {
  // Estado intrínseco (compartido e inmutable)
  constructor(public readonly valor: string, public readonly palo: string) {}
  toString() { return this.valor + this.palo; }
}

class FabricaCartas {
  private static cache = new Map<string, Carta>();

  static get(valor: string, palo: string): Carta {
    const clave = valor + palo;
    if (!this.cache.has(clave)) this.cache.set(clave, new Carta(valor, palo));
    return this.cache.get(clave)!;
  }

  static total() { return this.cache.size; }
}

// Estado extrínseco (propio de cada mano): jugador e id
const manos = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  jugador: `player${i % 6}`,
  cartas: [FabricaCartas.get("A", "s"), FabricaCartas.get("K", "h")],
}));

console.log(`Manos creadas: ${manos.length}`);
console.log(`Objetos Carta en memoria: ${FabricaCartas.total()}`);
console.log(`¿Misma carta compartida?`, manos[0].cartas[0] === manos[9999].cartas[0]);

export {};
