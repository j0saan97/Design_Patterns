// FACTORY METHOD
// La superclase define el flujo y delega en las subclases qué objeto concreto crear.
// Ejemplo: notificadores por distintos canales.

interface Canal {
  enviar(mensaje: string): void;
}

class CanalTelegram implements Canal {
  enviar(mensaje: string) { console.log(`📨 Telegram: ${mensaje}`); }
}

class CanalEmail implements Canal {
  enviar(mensaje: string) { console.log(`📧 Email: ${mensaje}`); }
}

abstract class Notificador {
  // El "factory method"
  protected abstract crearCanal(): Canal;

  notificar(mensaje: string) {
    const canal = this.crearCanal();
    canal.enviar(mensaje.toUpperCase());
  }
}

class NotificadorTelegram extends Notificador {
  protected crearCanal() { return new CanalTelegram(); }
}

class NotificadorEmail extends Notificador {
  protected crearCanal() { return new CanalEmail(); }
}

const notificadores: Notificador[] = [new NotificadorTelegram(), new NotificadorEmail()];
notificadores.forEach((n) => n.notificar("Gol del Madrid"));

export {};
