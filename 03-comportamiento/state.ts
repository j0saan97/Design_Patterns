// STATE
// Un objeto cambia su comportamiento cuando cambia su estado interno (cada estado es una clase).
// Ejemplo: reproductor de música.

interface Estado {
  play(r: Reproductor): void;
  stop(r: Reproductor): void;
}

class Parado implements Estado {
  play(r: Reproductor) { console.log("▶️  Empieza a sonar"); r.setEstado(new Sonando()); }
  stop() { console.log("Ya está parado"); }
}

class Sonando implements Estado {
  play(r: Reproductor) { console.log("⏸️  Pausa"); r.setEstado(new Pausado()); }
  stop(r: Reproductor) { console.log("⏹️  Stop"); r.setEstado(new Parado()); }
}

class Pausado implements Estado {
  play(r: Reproductor) { console.log("▶️  Reanuda"); r.setEstado(new Sonando()); }
  stop(r: Reproductor) { console.log("⏹️  Stop"); r.setEstado(new Parado()); }
}

class Reproductor {
  private estado: Estado = new Parado();
  setEstado(e: Estado) { this.estado = e; }
  play() { this.estado.play(this); }
  stop() { this.estado.stop(this); }
}

const r = new Reproductor();
r.stop();
r.play();
r.play();
r.play();
r.stop();

export {};
