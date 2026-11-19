// FACADE
// Ofrece una interfaz simple a un subsistema complejo.
// Ejemplo: publicar una web (build + subir + limpiar caché).

class Compilador {
  build() { console.log("🔨 Compilando con Vite..."); return "dist/"; }
}

class ClienteFTP {
  conectar(host: string) { console.log(`🔌 Conectando a ${host}`); }
  subir(carpeta: string) { console.log(`⬆️  Subiendo ${carpeta}`); }
  desconectar() { console.log("🔌 Desconectado"); }
}

class Cdn {
  purgar() { console.log("🧹 Caché purgada"); }
}

// La fachada
class Despliegue {
  private compilador = new Compilador();
  private ftp = new ClienteFTP();
  private cdn = new Cdn();

  publicar(host: string) {
    const carpeta = this.compilador.build();
    this.ftp.conectar(host);
    this.ftp.subir(carpeta);
    this.ftp.desconectar();
    this.cdn.purgar();
    console.log("✅ Web publicada");
  }
}

// El cliente solo llama a un método
new Despliegue().publicar("ftp.mihosting.com");

export {};
