// SINGLETON
// Garantiza que una clase tenga una única instancia y da un punto de acceso global.
// Ejemplo: logger de la aplicación.

class Logger {
  private static instancia: Logger | null = null;
  private lineas: string[] = [];

  private constructor() {} // nadie puede hacer "new Logger()"

  static getInstance(): Logger {
    if (!Logger.instancia) Logger.instancia = new Logger();
    return Logger.instancia;
  }

  log(msg: string) {
    this.lineas.push(`[${this.lineas.length + 1}] ${msg}`);
  }

  volcar() {
    console.log(this.lineas.join("\n"));
  }
}

const a = Logger.getInstance();
const b = Logger.getInstance();

a.log("Arranca la app");
b.log("Usuario conectado");

console.log("¿Misma instancia?", a === b);
a.volcar();

export {};
