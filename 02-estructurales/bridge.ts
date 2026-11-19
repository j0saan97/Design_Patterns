// BRIDGE
// Separa una abstracción de su implementación para que ambas puedan variar por separado.
// Ejemplo: mandos (abstracción) y dispositivos (implementación).

interface Dispositivo {
  nombre: string;
  encendido: boolean;
  volumen: number;
}

class Tele implements Dispositivo { nombre = "Tele"; encendido = false; volumen = 10; }
class Radio implements Dispositivo { nombre = "Radio"; encendido = false; volumen = 5; }

class Mando {
  constructor(protected dispositivo: Dispositivo) {}

  power() {
    this.dispositivo.encendido = !this.dispositivo.encendido;
    console.log(`${this.dispositivo.nombre} ${this.dispositivo.encendido ? "ON" : "OFF"}`);
  }

  subirVolumen() {
    this.dispositivo.volumen++;
    console.log(`${this.dispositivo.nombre} volumen: ${this.dispositivo.volumen}`);
  }
}

// Ampliamos la abstracción sin tocar los dispositivos
class MandoAvanzado extends Mando {
  silenciar() {
    this.dispositivo.volumen = 0;
    console.log(`${this.dispositivo.nombre} silenciado`);
  }
}

new Mando(new Tele()).power();
const mando = new MandoAvanzado(new Radio());
mando.power();
mando.subirVolumen();
mando.silenciar();

export {};
