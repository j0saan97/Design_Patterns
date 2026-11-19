// STRATEGY
// Encapsula algoritmos intercambiables detrás de una misma interfaz.
// Ejemplo: distintas estrategias para decidir si lanzar una alerta en un partido.

interface DatosPartido {
  minuto: number;
  goles: number;
  tirosPuerta: number;
}

interface Estrategia {
  nombre: string;
  cumple(d: DatosPartido): boolean;
}

class Over05Descanso implements Estrategia {
  nombre = "Over 0.5 al descanso";
  cumple(d: DatosPartido) { return d.minuto >= 25 && d.minuto <= 40 && d.goles === 0 && d.tirosPuerta >= 4; }
}

class GolTardio implements Estrategia {
  nombre = "Gol tardío";
  cumple(d: DatosPartido) { return d.minuto >= 70 && d.tirosPuerta >= 8; }
}

class Evaluador {
  constructor(private estrategia: Estrategia) {}
  setEstrategia(e: Estrategia) { this.estrategia = e; }

  evaluar(d: DatosPartido) {
    const ok = this.estrategia.cumple(d);
    console.log(`${this.estrategia.nombre}: ${ok ? "🔔 ALERTA" : "—"}`);
  }
}

const datos: DatosPartido = { minuto: 32, goles: 0, tirosPuerta: 5 };
const evaluador = new Evaluador(new Over05Descanso());
evaluador.evaluar(datos);

evaluador.setEstrategia(new GolTardio());
evaluador.evaluar(datos);

export {};
