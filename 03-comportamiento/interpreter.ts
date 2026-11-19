// INTERPRETER
// Define una gramática como clases y un intérprete que evalúa frases de ese lenguaje.
// Ejemplo: expresiones aritméticas con variables.

type Contexto = Record<string, number>;

interface Expresion {
  interpretar(ctx: Contexto): number;
}

class Numero implements Expresion {
  constructor(private valor: number) {}
  interpretar() { return this.valor; }
}

class Variable implements Expresion {
  constructor(private nombre: string) {}
  interpretar(ctx: Contexto) { return ctx[this.nombre] ?? 0; }
}

class Suma implements Expresion {
  constructor(private izq: Expresion, private der: Expresion) {}
  interpretar(ctx: Contexto) { return this.izq.interpretar(ctx) + this.der.interpretar(ctx); }
}

class Multiplicacion implements Expresion {
  constructor(private izq: Expresion, private der: Expresion) {}
  interpretar(ctx: Contexto) { return this.izq.interpretar(ctx) * this.der.interpretar(ctx); }
}

// Árbol para: (bote + apuesta) * 2
const expr = new Multiplicacion(
  new Suma(new Variable("bote"), new Variable("apuesta")),
  new Numero(2),
);

console.log(expr.interpretar({ bote: 10, apuesta: 5 })); // 30

export {};
