// CHAIN OF RESPONSIBILITY
// Pasa una petición por una cadena de manejadores; cada uno la procesa o la pasa al siguiente.
// Ejemplo: middlewares de una petición HTTP.

interface Peticion {
  usuario?: string;
  ip: string;
  ruta: string;
}

abstract class Manejador {
  private siguiente: Manejador | null = null;

  setSiguiente(m: Manejador): Manejador {
    this.siguiente = m;
    return m; // permite encadenar
  }

  manejar(p: Peticion): string {
    return this.siguiente ? this.siguiente.manejar(p) : "✅ 200 OK";
  }
}

class Auth extends Manejador {
  manejar(p: Peticion) {
    if (!p.usuario) return "⛔ 401 No autenticado";
    return super.manejar(p);
  }
}

class RateLimit extends Manejador {
  private contador = new Map<string, number>();
  manejar(p: Peticion) {
    const n = (this.contador.get(p.ip) ?? 0) + 1;
    this.contador.set(p.ip, n);
    if (n > 2) return "⛔ 429 Demasiadas peticiones";
    return super.manejar(p);
  }
}

class Log extends Manejador {
  manejar(p: Peticion) {
    console.log(`  log: ${p.ip} -> ${p.ruta}`);
    return super.manejar(p);
  }
}

const cadena = new Log();
cadena.setSiguiente(new Auth()).setSiguiente(new RateLimit());

console.log(cadena.manejar({ ip: "1.1.1.1", ruta: "/manos" }));
console.log(cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" }));
console.log(cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" }));
console.log(cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" }));

export {};
