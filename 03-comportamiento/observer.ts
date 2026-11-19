// OBSERVER
// Cuando un objeto cambia, notifica automáticamente a todos sus suscriptores.
// Ejemplo: marcador de un partido con alertas.

interface Observador {
  actualizar(evento: { partido: string; marcador: string }): void;
}

class Partido {
  private observadores: Observador[] = [];
  private marcador = "0-0";

  constructor(public nombre: string) {}

  suscribir(o: Observador) { this.observadores.push(o); }
  desuscribir(o: Observador) { this.observadores = this.observadores.filter((x) => x !== o); }

  setMarcador(m: string) {
    this.marcador = m;
    this.observadores.forEach((o) => o.actualizar({ partido: this.nombre, marcador: this.marcador }));
  }
}

class AlertaTelegram implements Observador {
  actualizar(e: { partido: string; marcador: string }) {
    console.log(`📲 Telegram: ${e.partido} ${e.marcador}`);
  }
}

class LogBD implements Observador {
  actualizar(e: { partido: string; marcador: string }) {
    console.log(`💾 Guardado en BD: ${e.partido} ${e.marcador}`);
  }
}

const partido = new Partido("Betis - Sevilla");
const telegram = new AlertaTelegram();
partido.suscribir(telegram);
partido.suscribir(new LogBD());

partido.setMarcador("1-0");
partido.desuscribir(telegram);
partido.setMarcador("1-1");

export {};
