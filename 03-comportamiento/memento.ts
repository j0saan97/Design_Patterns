// MEMENTO
// Guarda y restaura el estado de un objeto sin romper su encapsulación.
// Ejemplo: partida guardada de un juego.

class Memento {
  constructor(private readonly estado: { nivel: number; vida: number }) {}
  getEstado() { return { ...this.estado }; }
}

class Partida {
  private nivel = 1;
  private vida = 100;

  jugar() {
    this.nivel++;
    this.vida -= 30;
    console.log(`Nivel ${this.nivel}, vida ${this.vida}`);
  }

  guardar() { return new Memento({ nivel: this.nivel, vida: this.vida }); }

  restaurar(m: Memento) {
    ({ nivel: this.nivel, vida: this.vida } = m.getEstado());
    console.log(`↩️  Restaurado: nivel ${this.nivel}, vida ${this.vida}`);
  }
}

// Caretaker: guarda los mementos sin mirar dentro
const guardados: Memento[] = [];
const partida = new Partida();

partida.jugar();
guardados.push(partida.guardar());
partida.jugar();
partida.jugar();
partida.restaurar(guardados.pop()!);

export {};
