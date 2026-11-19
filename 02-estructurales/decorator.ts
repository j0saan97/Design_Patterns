// DECORATOR
// Añade responsabilidades a un objeto dinámicamente envolviéndolo, sin herencia.
// Ejemplo: café con extras.

interface Bebida {
  descripcion(): string;
  precio(): number;
}

class Cafe implements Bebida {
  descripcion() { return "Café"; }
  precio() { return 1.2; }
}

// Decorador base: envuelve otra Bebida
abstract class Extra implements Bebida {
  constructor(protected bebida: Bebida) {}
  abstract descripcion(): string;
  abstract precio(): number;
}

class ConLeche extends Extra {
  descripcion() { return this.bebida.descripcion() + " + leche"; }
  precio() { return this.bebida.precio() + 0.3; }
}

class ConCaramelo extends Extra {
  descripcion() { return this.bebida.descripcion() + " + caramelo"; }
  precio() { return this.bebida.precio() + 0.5; }
}

const pedido: Bebida = new ConCaramelo(new ConLeche(new Cafe()));
console.log(`${pedido.descripcion()} = ${pedido.precio().toFixed(2)} €`);

export {};
