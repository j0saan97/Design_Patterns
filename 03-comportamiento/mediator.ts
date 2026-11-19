// MEDIATOR
// Centraliza la comunicación entre objetos para que no se referencien entre sí.
// Ejemplo: sala de chat.

class SalaChat {
  private usuarios = new Map<string, Usuario>();

  registrar(u: Usuario) {
    this.usuarios.set(u.nombre, u);
    u.sala = this;
  }

  enviar(de: string, mensaje: string, para?: string) {
    if (para) {
      this.usuarios.get(para)?.recibir(de, `(privado) ${mensaje}`);
      return;
    }
    this.usuarios.forEach((u) => {
      if (u.nombre !== de) u.recibir(de, mensaje);
    });
  }
}

class Usuario {
  sala?: SalaChat;
  constructor(public nombre: string) {}

  enviar(mensaje: string, para?: string) { this.sala?.enviar(this.nombre, mensaje, para); }
  recibir(de: string, mensaje: string) { console.log(`[${this.nombre}] ${de}: ${mensaje}`); }
}

const sala = new SalaChat();
const josan = new Usuario("Josan");
const mati = new Usuario("Mati");
const pedro = new Usuario("Pedro");
[josan, mati, pedro].forEach((u) => sala.registrar(u));

josan.enviar("¿Sesión esta tarde?");
mati.enviar("Yo me apunto", "Josan");

export {};
