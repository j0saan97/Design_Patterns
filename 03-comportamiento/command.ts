// COMMAND
// Encapsula una petición como objeto: permite deshacer, encolar o registrar acciones.
// Ejemplo: editor de texto con undo.

class Editor {
  texto = "";
}

interface Comando {
  ejecutar(): void;
  deshacer(): void;
}

class Escribir implements Comando {
  constructor(private editor: Editor, private contenido: string) {}
  ejecutar() { this.editor.texto += this.contenido; }
  deshacer() { this.editor.texto = this.editor.texto.slice(0, -this.contenido.length); }
}

class Borrar implements Comando {
  private borrado = "";
  constructor(private editor: Editor, private n: number) {}
  ejecutar() {
    this.borrado = this.editor.texto.slice(-this.n);
    this.editor.texto = this.editor.texto.slice(0, -this.n);
  }
  deshacer() { this.editor.texto += this.borrado; }
}

class Historial {
  private pila: Comando[] = [];
  ejecutar(c: Comando) { c.ejecutar(); this.pila.push(c); }
  deshacer() { this.pila.pop()?.deshacer(); }
}

const editor = new Editor();
const historial = new Historial();

historial.ejecutar(new Escribir(editor, "Hola "));
historial.ejecutar(new Escribir(editor, "mundo"));
console.log(editor.texto);
historial.ejecutar(new Borrar(editor, 5));
console.log(editor.texto);
historial.deshacer();
console.log(editor.texto);
historial.deshacer();
console.log(editor.texto);

export {};
