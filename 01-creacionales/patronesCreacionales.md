# 01 · Creacionales (cómo se crean los objetos)

| Patrón | Idea | Ejemplo |
|---|---|---|
| Abstract Factory | Familias de objetos relacionados | Tema claro / oscuro |
| Builder | Construir paso a paso | Constructor de SQL |
| Factory Method | Las subclases deciden qué crear | Notificadores Telegram / Email |
| Prototype | Crear clonando | Plantillas de mesa |
| Singleton | Una única instancia | Logger |

---

## ¿Qué son los patrones creacionales?

Los **patrones de diseño** son soluciones ya probadas a problemas que aparecen una y otra vez al programar. Los popularizó en 1994 el libro *Design Patterns* de la "Gang of Four" (GoF), que recoge 23 patrones en tres grupos: **creacionales**, estructurales y de comportamiento.

Los **creacionales** responden a una pregunta: **¿quién decide qué objeto se crea y cómo?**

La idea clave es **no llenar el código de `new ClaseConcreta()`**. La decisión de qué crear se concentra en un solo sitio. Así, si mañana cambia la clase concreta, solo tocas ese sitio y el resto del programa ni se entera.

> Recomendación de lectura: empieza por **Factory Method** (es el más sencillo) y después sigue con **Abstract Factory**, que es su "hermano mayor".

---

## 1. Factory Method: "una subclase decide"

**En una frase:** una clase padre dice *"aquí hace falta crear algo"*, y cada clase hija decide *qué* se crea.

**Problema que resuelve:** tu código hace `new CanalTelegram()` en muchos sitios. Si mañana añades Email, tienes que ir cambiando todos esos sitios.

**Analogía:** una empresa de mensajería tiene una regla, "envía el paquete". La sede de carretera lo envía en camión y la sede del puerto en barco. La central no sabe ni le importa qué vehículo se usa.

**Roles:**

| Rol | Qué es | En `factory-method.ts` |
|---|---|---|
| Product | Interfaz de lo que se crea | `Canal` |
| ConcreteProduct | Implementaciones concretas | `CanalTelegram`, `CanalEmail` |
| Creator | Clase padre: declara el método fábrica y contiene la lógica que lo usa | `Notificador` (`crearCanal()` + `notificar()`) |
| ConcreteCreator | Clases hijas que deciden qué producto crear | `NotificadorTelegram`, `NotificadorEmail` |

```ts
abstract class Notificador {
  protected abstract crearCanal(): Canal;   // ← el "factory method"
  notificar(mensaje: string) {
    const canal = this.crearCanal();        // no sabe si es Telegram o Email
    canal.enviar(mensaje.toUpperCase());
  }
}
```

**Úsalo cuando:**
- No sabes de antemano qué tipo exacto de objeto vas a necesitar.
- Quieres que otros puedan añadir tipos nuevos sin tocar tu código.

**✅ Ventajas:**
- La creación queda en un solo sitio (principio de responsabilidad única, **SRP**).
- Añadir un canal nuevo (SMS) consiste en añadir clases, sin modificar las existentes (principio abierto/cerrado, **OCP**).

**⚠️ Desventajas:** puede llenar el proyecto de subclases, porque hace falta un creador por cada producto.

---

## 2. Abstract Factory: "un kit coherente"

**En una frase:** una fábrica que crea una **familia entera** de objetos que deben ir juntos.

**Problema que resuelve:** necesitas que varios objetos sean "del mismo estilo" y que nunca se mezclen. No quieres un botón oscuro con un checkbox claro.

**Analogía:** una tienda de muebles vende el juego completo (silla, sofá y mesa) en estilo moderno o en estilo clásico. Pides "estilo moderno" y todo lo que te llega combina.

**Roles:**

| Rol | Qué es | En `abstract-factory.ts` |
|---|---|---|
| AbstractProduct | Interfaz de cada tipo de producto | `Boton`, `Checkbox` |
| ConcreteProduct | Cada variante | `BotonClaro`, `CheckboxOscuro`... |
| AbstractFactory | Interfaz con un método por producto | `UIFactory` (`crearBoton()`, `crearCheckbox()`) |
| ConcreteFactory | Una fábrica por familia | `TemaClaro`, `TemaOscuro` |
| Client | Solo conoce las interfaces | `pintarUI()` |

```ts
function pintarUI(factory: UIFactory) {
  console.log(factory.crearBoton().render(), factory.crearCheckbox().render());
}
pintarUI(new TemaClaro());   // todo claro
pintarUI(new TemaOscuro());  // todo oscuro, sin cambiar pintarUI
```

**Úsalo cuando:**
- Trabajas con varias familias de objetos relacionados.
- Quieres garantizar que los objetos que se combinan son compatibles.

**✅ Ventajas:**
- Es imposible mezclar familias por error.
- Añadir un tema nuevo (alto contraste) consiste en añadir una fábrica.

**⚠️ Desventajas:**
- Muchas interfaces y clases.
- Añadir un **tipo** de producto nuevo (por ejemplo `Slider`) obliga a modificar la interfaz y **todas** las fábricas.

### Factory Method vs Abstract Factory

| | Factory Method | Abstract Factory |
|---|---|---|
| Crea | **Un** producto | Una **familia** de productos |
| Cómo | **Herencia**: una subclase sobrescribe un método | **Composición**: le pasas un objeto fábrica |
| Relación | Es la pieza básica | Suele estar hecha de varios Factory Methods |

---

## 3. Builder: "paso a paso"

**En una frase:** construye un objeto complicado **pieza a pieza**, eligiendo solo las piezas que necesitas.

**Problema que resuelve:** el "constructor telescópico", es decir, un constructor con muchos parámetros opcionales que nadie recuerda en qué orden van:

```ts
new Query("manos", ["id"], ["stake='NL25'"], null, 10, true, false) // 😵 ¿qué era cada cosa?
```

**Analogía:** pedir un bocadillo en una cadena de bocatas. Vas eligiendo paso a paso: pan, relleno, verduras y salsa. Cuando terminas, te lo entregan.

**Roles:**

| Rol | Qué es | En `builder.ts` |
|---|---|---|
| Builder | Objeto que va acumulando los pasos | `QueryBuilder` (`from`, `select`, `where`, `limit`) |
| Product | El resultado final | El `string` SQL que devuelve `build()` |
| Director *(opcional)* | Guarda "recetas" con un orden fijo de pasos | No hay: el cliente elige los pasos |

```ts
const sql = new QueryBuilder()
  .from("manos")
  .select("id", "posicion", "resultado")
  .where("stake = 'NL25'")
  .where("resultado > 0")
  .limit(10)
  .build();
```

Tu ejemplo es la variante **fluida** (*fluent builder*): cada método devuelve `this`, así que puedes encadenar llamadas con `.`. Es la forma más habitual en TypeScript y JavaScript.

**Úsalo cuando:**
- Un objeto tiene muchas partes opcionales.
- Quieres crear variantes del mismo objeto con pasos parecidos.
- No quieres que nadie use el objeto "a medio construir".

**✅ Ventajas:**
- Código muy legible.
- Los pasos se pueden repetir, como `where()` dos veces.
- La lógica de construcción queda separada del objeto.

**⚠️ Desventajas:** es demasiado para objetos simples. Si tu objeto tiene 2 campos, usa un constructor normal.

### Builder vs Abstract Factory

| | Builder | Abstract Factory |
|---|---|---|
| Se centra en | **Cómo** se construye **un** objeto complejo | **Qué familia** de objetos se crea |
| Entrega | Al final, con `build()` | Cada producto al momento |

---

## 4. Prototype: "copia y pega"

**En una frase:** en vez de crear un objeto desde cero, **clonas** uno que ya existe y le cambias lo que necesites.

**Problema que resuelve:**
- Configurar un objeto desde cero es pesado o repetitivo.
- Copiarlo "desde fuera" exige conocer su clase y todos sus campos, incluidos los privados.

La solución es que el propio objeto sepa copiarse.

**Analogía:** una plantilla de documento. No escribes el contrato de cero: duplicas la plantilla y cambias el nombre y la fecha.

**Roles:**

| Rol | Qué es | En `prototype.ts` |
|---|---|---|
| Prototype | Interfaz con `clonar()` | `Prototipo<T>` |
| ConcretePrototype | Sabe copiarse a sí mismo | `ConfigMesa` |
| Registry *(opcional)* | Catálogo de prototipos listos para clonar | No hay |

```ts
const base = new ConfigMesa("NL25 6-max", [0.1, 0.25], 6, ["cash", "zoom"]);

const headsUp = base.clonar();
headsUp.nombre = "NL25 HU";
headsUp.jugadores = 2;
headsUp.tags.push("hu");   // base.tags NO cambia gracias a la copia profunda
```

### ⚠️ La trampa: copia superficial vs profunda

- **Copia superficial (shallow):** copia los valores simples, pero los arrays y objetos internos se **comparten**. Si haces `headsUp.tags.push("hu")`, ¡también cambias `base.tags`!
- **Copia profunda (deep):** duplica también lo de dentro. Tu `ConfigMesa.clonar()` copia `ciegas` y `tags` con este propósito.

**Úsalo cuando:**
- Crear el objeto es costoso o tiene mucha configuración.
- Tienes muchas variantes que solo se diferencian en sus valores.

**✅ Ventajas:**
- Te ahorras repetir la inicialización.
- No necesitas subclases para cada variante.

**⚠️ Desventajas:**
- Clonar bien objetos con referencias anidadas o circulares es delicado.

---

## 5. Singleton: "solo uno"

**En una frase:** garantiza que de una clase exista **una única instancia** y que todo el programa acceda a la misma.

**Problema que resuelve:** hay cosas de las que solo debe haber una, como el logger, la configuración o la conexión a la base de datos. Si cada parte del código crea la suya, los datos se separan y se pierden.

**Analogía:** el gobierno de un país. Hay uno solo, y cualquiera que diga "el Gobierno" se refiere al mismo.

**Cómo funciona** (tu `Logger`):
1. **Constructor `private`**: nadie puede hacer `new Logger()`.
2. **Campo `private static instancia`**: guarda la única instancia.
3. **`static getInstance()`**: la crea la primera vez (*lazy*, perezosa) y después devuelve siempre la misma.

```ts
const a = Logger.getInstance();
const b = Logger.getInstance();
a.log("Arranca la app");
b.log("Usuario conectado");
console.log(a === b);  // true → es el mismo objeto
a.volcar();            // muestra las dos líneas
```

**Úsalo cuando:** de verdad debe haber **exactamente una** instancia compartida.

**✅ Ventajas:**
- Una sola instancia garantizada.
- Acceso fácil desde cualquier parte.
- Solo se crea cuando hace falta.

**⚠️ Desventajas** (muchos lo consideran un **antipatrón** si se abusa de él):
- **Es estado global disfrazado.** Cualquier parte del código puede cambiarlo.
- **Oculta dependencias.** Una clase usa `Logger.getInstance()` por dentro y no lo dice en su constructor.
- **Complica los tests.** No puedes sustituirlo fácilmente por un objeto falso (*mock*). Además, su estado se arrastra de un test al siguiente.
- **Multihilo.** En lenguajes con hilos (Java, C#), dos hilos podrían crear dos instancias a la vez. En JS/TS no pasa, porque se ejecuta en un solo hilo.

**💡 Alternativa recomendada: inyección de dependencias.** Creas **un** logger en el `main` y se lo pasas a quien lo necesite por el constructor. Sigue habiendo uno solo, pero la dependencia está a la vista y en los tests puedes pasar uno falso.

---

## Tabla comparativa final

| Patrón | Pregunta que responde | Qué produce | Mecanismo | Riesgo principal |
|---|---|---|---|---|
| **Factory Method** | ¿Qué clase concreta creo? | 1 producto | Herencia | Muchas subclases |
| **Abstract Factory** | ¿Qué familia de objetos compatibles creo? | Varios productos relacionados | Composición (objeto fábrica) | Añadir un tipo de producto obliga a tocar todas las fábricas |
| **Builder** | ¿Cómo monto un objeto complejo? | 1 objeto complejo, al final | Pasos encadenados (+ Director opcional) | Excesivo para objetos simples |
| **Prototype** | ¿Cómo copio sin conocer la clase? | Un clon | `clonar()` | Copia superficial vs profunda |
| **Singleton** | ¿Cómo aseguro que solo haya uno? | Siempre la misma instancia | Constructor privado + `getInstance()` | Estado global, tests difíciles |

### 🧠 Para recordarlos

- **Factory Method:** "una subclase decide".
- **Abstract Factory:** "un kit coherente".
- **Builder:** "paso a paso".
- **Prototype:** "copia y pega".
- **Singleton:** "solo uno".

---

**Fuentes:**
- [Refactoring.Guru – Patrones creacionales](https://refactoring.guru/es/design-patterns/creational-patterns)
- Gamma, Helm, Johnson y Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994).
