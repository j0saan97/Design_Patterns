// ABSTRACT FACTORY
// Crea familias de objetos relacionados sin acoplarse a sus clases concretas.
// Ejemplo: componentes de UI para tema claro / oscuro.

interface Boton { render(): string; }
interface Checkbox { render(): string; }

interface UIFactory {
  crearBoton(): Boton;
  crearCheckbox(): Checkbox;
}

class BotonClaro implements Boton { render() { return "[ Botón claro ]"; } }
class CheckboxClaro implements Checkbox { render() { return "[x] Checkbox claro"; } }
class BotonOscuro implements Boton { render() { return "[ Botón oscuro ]"; } }
class CheckboxOscuro implements Checkbox { render() { return "[x] Checkbox oscuro"; } }

class TemaClaro implements UIFactory {
  crearBoton() { return new BotonClaro(); }
  crearCheckbox() { return new CheckboxClaro(); }
}

class TemaOscuro implements UIFactory {
  crearBoton() { return new BotonOscuro(); }
  crearCheckbox() { return new CheckboxOscuro(); }
}

// El cliente solo conoce la interfaz UIFactory
function pintarUI(factory: UIFactory) {
  console.log(factory.crearBoton().render(), factory.crearCheckbox().render());
}

pintarUI(new TemaClaro());
pintarUI(new TemaOscuro());

export {};
