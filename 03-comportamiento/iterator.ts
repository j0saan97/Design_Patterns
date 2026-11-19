// ITERATOR
// Recorre una colección sin exponer su estructura interna.
// Ejemplo: baraja que se recorre con for...of.

class Baraja implements Iterable<string> {
  private valores = ["A", "K", "Q", "J", "T"];
  private palos = ["♠", "♥", "♦", "♣"];

  // Iterador propio: genera las cartas bajo demanda
  *[Symbol.iterator](): Iterator<string> {
    for (const p of this.palos) {
      for (const v of this.valores) {
        yield v + p;
      }
    }
  }
}

const baraja = new Baraja();

const cartas: string[] = [];
for (const carta of baraja) cartas.push(carta);
console.log(cartas.join(" "));

// También funciona con spread porque es iterable
console.log("Total:", [...baraja].length);

export {};
