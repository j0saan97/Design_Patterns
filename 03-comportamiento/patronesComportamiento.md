# 03 · Comportamiento (cómo se comunican)

| Patrón | Idea | Ejemplo |
|---|---|---|
| Chain of Responsibility | Pasar una petición por una cadena de manejadores | Middlewares HTTP |
| Command | Convertir una acción en un objeto | Editor con deshacer |
| Interpreter | Una gramática hecha de clases | `(bote + apuesta) * 2` |
| Iterator | Recorrer una colección sin ver su interior | Baraja con `for...of` |
| Mediator | Un objeto central coordina a los demás | Sala de chat |
| Memento | Guardar y restaurar el estado | Partida guardada |
| Observer | Avisar a los suscriptores cuando algo cambia | Marcador con alertas |
| State | El comportamiento cambia según el estado | Reproductor de música |
| Strategy | Algoritmos intercambiables | Estrategias de alertas de apuestas |
| Template Method | Esqueleto fijo, pasos variables | Exportar a CSV o JSON |
| Visitor | Añadir operaciones sin tocar las clases | Área y SVG de figuras |

---

## ¿Qué son los patrones de comportamiento?

Los creacionales responden a *"¿cómo creo objetos?"* y los estructurales a *"¿cómo los encajo?"*. Los **de comportamiento** responden a la tercera pregunta: **¿cómo se reparten el trabajo y se comunican los objetos sin depender demasiado unos de otros?**

La idea que se repite en casi todos es **convertir algo en un objeto**: una petición (Command), un algoritmo (Strategy), un estado (State), una operación (Visitor), una forma de recorrer (Iterator)… Al hacerlo objeto, se puede **guardar, pasar, cambiar o combinar**.

> 💡 **Consejo:** como en los estructurales, varios se parecen mucho en el código (State y Strategy son casi idénticos). Fíjate en **quién decide** y **para qué**.

---

## 1. Chain of Responsibility: "la cadena de ventanillas"

**En una frase:** pasa una petición por una **cadena de manejadores**; cada uno decide si la procesa, la corta o la pasa al siguiente.

**Problema que resuelve:** antes de atender una petición HTTP quieres registrarla, comprobar que hay usuario y limitar el número de peticiones por IP. Si lo metes todo en una función, crece sin control y no puedes reordenar ni reutilizar los pasos.

**Analogía:** el servicio de atención al cliente. Te atiende el primer nivel; si no sabe, te pasa al segundo, y así hasta que alguien lo resuelve.

**Roles:**

| Rol | Qué es | En `chain-of-responsibility.ts` |
|---|---|---|
| Handler | Base con la referencia al siguiente y el reenvío por defecto | `Manejador` (`setSiguiente`, `manejar`) |
| ConcreteHandler | Cada paso de la cadena | `Log`, `Auth`, `RateLimit` |
| Client | Monta la cadena y le envía la petición | El código del final |

```ts
const cadena = new Log();
cadena.setSiguiente(new Auth()).setSiguiente(new RateLimit());

cadena.manejar({ ip: "1.1.1.1", ruta: "/manos" });                    // ⛔ 401
cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" });  // ✅ 200 (1.ª)
cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" });  // ✅ 200 (2.ª)
cadena.manejar({ usuario: "josan", ip: "2.2.2.2", ruta: "/manos" });  // ⛔ 429 (3.ª)
```

Tres detalles de tu ejemplo:
- `setSiguiente` **devuelve el siguiente**, por eso puedes encadenar las llamadas.
- Si nadie corta, el último `super.manejar()` llega al final de la cadena y devuelve `"✅ 200 OK"`.
- Como `Auth` va **antes** que `RateLimit`, la petición sin usuario se corta ahí y **no cuenta** para el límite.

Tu versión es estilo **middleware**: cada eslabón hace su parte y luego pasa la petición. En la versión clásica del libro, **solo uno** se encarga de la petición (el primero que puede) y los demás no la tocan. Las dos son Chain of Responsibility.

**Úsalo cuando:**
- Una petición tiene que pasar por varios filtros o comprobaciones.
- Quieres poder cambiar el orden o añadir pasos sin tocar los demás.

**✅ Ventajas:**
- Cada paso es una clase pequeña (SRP).
- Añades o reordenas eslabones sin tocar los existentes (OCP).

**⚠️ Desventajas:**
- Puede que nadie atienda la petición.
- **El orden importa** y es fácil equivocarse.
- Es más difícil de depurar, porque la petición salta de clase en clase.

---

## 2. Command: "la comanda del restaurante"

**En una frase:** convierte una acción en un **objeto** con todo lo necesario para ejecutarla… y deshacerla.

**Problema que resuelve:** quieres un botón de **deshacer**. Si las acciones son simples llamadas a métodos, cuando ya se han ejecutado no queda nada que puedas deshacer. Si cada acción es un objeto, puedes **guardarlo en una pila**.

**Analogía:** la comanda de un restaurante. El camarero no cocina: apunta el pedido en un papel y lo deja en la cocina. Ese papel se puede poner en cola, guardar o cancelar.

**Roles:**

| Rol | Qué es | En `command.ts` |
|---|---|---|
| Command | La interfaz de las acciones | `Comando` (`ejecutar`, `deshacer`) |
| ConcreteCommand | Cada acción, con sus datos | `Escribir`, `Borrar` |
| Receiver | El objeto que de verdad se modifica | `Editor` |
| Invoker | Ejecuta los comandos y los guarda | `Historial` (`pila`) |

```ts
historial.ejecutar(new Escribir(editor, "Hola "));
historial.ejecutar(new Escribir(editor, "mundo"));  // "Hola mundo"
historial.ejecutar(new Borrar(editor, 5));          // "Hola "
historial.deshacer();                               // "Hola mundo"
historial.deshacer();                               // "Hola "
```

Fíjate en `Borrar`: **guarda lo que borró** (`this.borrado`) al ejecutarse. Sin eso no podría deshacerse. Cada comando es responsable de recordar lo que necesita para volver atrás.

> 📝 **Nota sobre tu ejemplo:** cuidado con `slice(0, -n)` cuando `n` es 0. `-0` es `0`, así que `slice(0, 0)` devuelve `""` y **se borra todo el texto**. Pasa con `new Escribir(editor, "")` al deshacer y con `new Borrar(editor, 0)` al ejecutar. Se arregla con `slice(0, texto.length - n)`.

**Úsalo cuando:**
- Necesitas deshacer y rehacer.
- Quieres encolar acciones, programarlas para más tarde o registrarlas.
- Quieres asociar acciones a botones, atajos o menús sin acoplarlos a la lógica.

**✅ Ventajas:**
- Separa **quién pide** la acción de **quién la hace**.
- Permite deshacer, colas, macros (un comando que agrupa otros) y registros.

**⚠️ Desventajas:** una clase por acción; el código crece mucho.

---

## 3. Interpreter: "la gramática hecha clases"

**En una frase:** representa cada regla de un lenguaje pequeño como una **clase**, y evalúa frases construyendo un **árbol** con ellas.

**Problema que resuelve:** quieres que el usuario escriba fórmulas como `(bote + apuesta) * 2` y calcularlas con distintos valores.

**Analogía:** una partitura. Cada símbolo tiene una regla, y el músico interpreta la secuencia completa siguiéndolas.

**Roles:**

| Rol | Qué es | En `interpreter.ts` |
|---|---|---|
| AbstractExpression | La interfaz común | `Expresion` (`interpretar(ctx)`) |
| TerminalExpression | Las hojas: valores sin más | `Numero`, `Variable` |
| NonterminalExpression | Reglas que combinan otras expresiones | `Suma`, `Multiplicacion` |
| Context | Los valores de las variables | `Contexto` (`{ bote, apuesta }`) |

```ts
// Árbol para: (bote + apuesta) * 2
const expr = new Multiplicacion(
  new Suma(new Variable("bote"), new Variable("apuesta")),
  new Numero(2),
);
expr.interpretar({ bote: 10, apuesta: 5 });  // 30
```

Es un **Composite** aplicado a un lenguaje: `Suma` y `Multiplicacion` son las ramas y `Numero` y `Variable`, las hojas. Cada nodo se evalúa llamando a sus hijos.

> 📝 **Nota sobre tu ejemplo:** el árbol lo construyes **a mano**. Pasar del texto `"(bote + apuesta) * 2"` al árbol es trabajo de un *parser*, que **no** forma parte del patrón. Además, `Variable` devuelve `0` si la variable no existe, así que una errata como `"bota"` no da error, solo un resultado incorrecto.

**Úsalo cuando:** tienes un lenguaje **pequeño y estable**, como reglas de filtros, expresiones o consultas sencillas. Para algo más grande, usa una librería de *parsing*.

**✅ Ventajas:** es fácil añadir reglas nuevas (una clase más).

**⚠️ Desventajas:** con muchas reglas se vuelve inmanejable y lento.

---

## 4. Iterator: "el mando de la tele"

**En una frase:** permite **recorrer** una colección elemento a elemento **sin saber cómo está guardada por dentro**.

**Problema que resuelve:** tu `Baraja` guarda valores y palos por separado. El código que la usa no debería saberlo: solo quiere ir carta por carta.

**Analogía:** cambiar de canal con los botones + y −. No necesitas saber en qué frecuencia emite cada canal.

**Roles:**

| Rol | Qué es | En `iterator.ts` |
|---|---|---|
| Iterable (Aggregate) | La colección que se puede recorrer | `Baraja` (`implements Iterable<string>`) |
| Iterator | El objeto que sabe ir al siguiente | El que crea `*[Symbol.iterator]()` |
| Client | Recorre sin conocer la estructura | `for...of`, spread `[...baraja]` |

```ts
for (const carta of baraja) cartas.push(carta);  // A♠ K♠ Q♠ … T♣
[...baraja].length;                              // 20
```

En TypeScript/JavaScript, **el patrón ya viene incluido en el lenguaje**: si una clase tiene `[Symbol.iterator]`, funciona con `for...of`, spread y `Array.from`. Tu ejemplo usa un **generador** (`function*` + `yield`), que crea el iterador por ti y genera las cartas **bajo demanda** (*lazy*), sin montar ningún array.

> 📝 Solo hay 5 valores (`A K Q J T`) × 4 palos, así que salen **20 cartas**, no 52.

**Úsalo cuando:**
- Tu colección tiene una estructura interna compleja (árbol, grafo, varias listas).
- Quieres ofrecer varias formas de recorrerla (en orden, al revés, por palo…).

**✅ Ventajas:**
- Esconde la estructura interna.
- Puedes tener varios recorridos a la vez, cada uno con su posición.

**⚠️ Desventajas:** para un array normal es innecesario; ya es iterable.

---

## 5. Mediator: "la torre de control"

**En una frase:** los objetos **no hablan entre sí**: hablan con un **mediador**, que reparte los mensajes.

**Problema que resuelve:** en un chat, si cada usuario guardase una referencia a todos los demás, con *n* usuarios tendrías *n × (n − 1)* conexiones. Con un mediador, cada uno solo conoce la sala.

**Analogía:** la torre de control de un aeropuerto. Los aviones no se comunican entre ellos; todos hablan con la torre, y ella coordina.

**Roles:**

| Rol | Qué es | En `mediator.ts` |
|---|---|---|
| Mediator | El centro que coordina | `SalaChat` (`registrar`, `enviar`) |
| Colleague | Los objetos que se comunican a través de él | `Usuario` (`sala`, `enviar`, `recibir`) |

```ts
josan.enviar("¿Sesión esta tarde?");   // les llega a Mati y Pedro
mati.enviar("Yo me apunto", "Josan");  // privado: solo le llega a Josan
```

`Usuario` no sabe que existen los demás usuarios. Solo conoce la sala. **Las reglas** (a quién se reenvía, mensajes privados, no enviarte a ti mismo) **viven en un único sitio**: `SalaChat.enviar()`.

> 📝 Si envías un privado a alguien que no existe (`"Pepe"`), el `?.` hace que se pierda **sin avisar**. Convendría devolver un error.

**Úsalo cuando:** muchos objetos se comunican de forma enredada, como en un chat, en formularios donde unos campos afectan a otros o en componentes de una interfaz.

**✅ Ventajas:**
- Los compañeros quedan desacoplados y se pueden reutilizar.
- Toda la lógica de coordinación está en un solo sitio.

**⚠️ Desventajas:** el mediador puede acabar siendo un **objeto dios**.

---

## 6. Memento: "la partida guardada"

**En una frase:** guarda una **foto del estado** de un objeto para restaurarla después, **sin exponer sus detalles internos**.

**Problema que resuelve:** quieres volver a un punto anterior de la partida, pero `nivel` y `vida` son privados. No quieres hacerlos públicos solo para poder copiarlos.

**Analogía:** guardar partida en un videojuego. Tú solo ves "Ranura 1"; lo que hay dentro solo lo entiende el juego.

**Roles:**

| Rol | Qué es | En `memento.ts` |
|---|---|---|
| Originator | El objeto cuyo estado se guarda; crea y lee los mementos | `Partida` (`guardar`, `restaurar`) |
| Memento | La foto del estado (inmutable) | `Memento` (`readonly estado`) |
| Caretaker | Guarda los mementos **sin mirar dentro** | El array `guardados` |

```ts
partida.jugar();                     // Nivel 2, vida 70
guardados.push(partida.guardar());
partida.jugar();                     // Nivel 3, vida 40
partida.jugar();                     // Nivel 4, vida 10
partida.restaurar(guardados.pop()!); // ↩️ Restaurado: nivel 2, vida 70
```

Fíjate en que `getEstado()` devuelve una **copia** (`{ ...this.estado }`), así nadie puede modificar el memento desde fuera.

> 📝 **Nota sobre tu ejemplo:** `getEstado()` es **público**, así que el caretaker *podría* mirar dentro, aunque el comentario diga lo contrario. En la versión estricta, solo el Originator puede leer el memento. En TypeScript se puede acercar a eso no exportando la clase `Memento` del módulo de `Partida`, o guardando el estado en un `#campo` privado que solo `Partida` sepa leer.

**Úsalo cuando:** necesitas puntos de restauración, deshacer basado en "fotos" o transacciones que se pueden revertir.

**✅ Ventajas:** guarda el estado sin romper la encapsulación.

**⚠️ Desventajas:** si el estado es grande y guardas muchas fotos, **consume mucha memoria**.

### Memento vs Command (para deshacer)

Los dos sirven para deshacer, pero de forma distinta:
- **Command** guarda **la acción** y sabe hacer la contraria (`Borrar` vuelve a escribir lo borrado).
- **Memento** guarda **el estado completo** y lo restaura tal cual.

Se combinan a menudo: un comando guarda un memento antes de ejecutarse y lo usa para deshacer.

---

## 7. Observer: "la suscripción"

**En una frase:** cuando un objeto cambia, **avisa automáticamente** a todos los que se han suscrito.

**Problema que resuelve:** cuando cambia el marcador quieres avisar por Telegram y guardar en la base de datos. `Partido` no debería saber nada de Telegram ni de bases de datos, y no quieres que nadie pregunte cada segundo si ha cambiado.

**Analogía:** suscribirte a un canal de YouTube. No entras cada día a ver si hay vídeo nuevo: te llega la notificación. Y puedes darte de baja cuando quieras.

**Roles:**

| Rol | Qué es | En `observer.ts` |
|---|---|---|
| Subject (Publisher) | El objeto observado; guarda la lista y avisa | `Partido` (`suscribir`, `desuscribir`, `setMarcador`) |
| Observer | La interfaz de los suscriptores | `Observador` (`actualizar`) |
| ConcreteObserver | Cada suscriptor concreto | `AlertaTelegram`, `LogBD` |

```ts
partido.suscribir(telegram);
partido.suscribir(new LogBD());
partido.setMarcador("1-0");      // 📲 Telegram + 💾 BD
partido.desuscribir(telegram);
partido.setMarcador("1-1");      // solo 💾 BD
```

Es la base de los **eventos** (`addEventListener`), de `EventEmitter` en Node, de RxJS y de la reactividad de React o Vue.

> 📝 El tipo `{ partido: string; marcador: string }` se repite tres veces. Un `type EventoMarcador = …` lo dejaría en un solo sitio.

**Úsalo cuando:** un cambio en un objeto tiene que provocar reacciones en otros, y no sabes de antemano cuántos ni cuáles.

**✅ Ventajas:**
- Puedes añadir suscriptores sin tocar el publicador (OCP).
- Las suscripciones se cambian en tiempo de ejecución.

**⚠️ Desventajas:**
- No conviene depender del **orden de aviso**: en tu ejemplo es el de suscripción, pero el patrón no lo garantiza.
- Si olvidas desuscribirte, el objeto sigue vivo en la lista: **fugas de memoria**.

### Observer vs Mediator

- **Observer:** comunicación **de uno a muchos**. El publicador ni sabe quién escucha.
- **Mediator:** comunicación **de muchos a muchos** pasando por el centro, que **decide** a quién va cada mensaje.

---

## 8. State: "cada estado es una clase"

**En una frase:** el objeto **cambia de comportamiento** según su estado interno, y cada estado es una clase propia.

**Problema que resuelve:** el botón ▶️ hace cosas distintas según el reproductor esté parado, sonando o en pausa. Sin el patrón, cada método se llena de `if (estado === "parado") … else if …`, y cada estado nuevo obliga a tocarlos todos.

**Analogía:** el botón de un móvil. Si está bloqueado, lo desbloquea; si está desbloqueado, lo bloquea. Es el mismo botón; lo que cambia es el estado.

**Roles:**

| Rol | Qué es | En `state.ts` |
|---|---|---|
| Context | El objeto con el estado; delega en él | `Reproductor` (`setEstado`, `play`, `stop`) |
| State | La interfaz de los estados | `Estado` (`play`, `stop`) |
| ConcreteState | Cada estado, con sus transiciones | `Parado`, `Sonando`, `Pausado` |

```ts
const r = new Reproductor();
r.stop();  // Ya está parado
r.play();  // ▶️ Empieza a sonar   (Parado → Sonando)
r.play();  // ⏸️ Pausa             (Sonando → Pausado)
r.play();  // ▶️ Reanuda           (Pausado → Sonando)
r.stop();  // ⏹️ Stop              (Sonando → Parado)
```

**Los propios estados deciden el siguiente estado** (`r.setEstado(new Sonando())`). El `Reproductor` no tiene ni un `if`.

> 📝 Cada transición crea un estado nuevo (`new Sonando()`). Como tus estados no guardan datos, podrías crear **una sola instancia** de cada uno y reutilizarla.

**Úsalo cuando:** un objeto tiene varios estados, su comportamiento depende mucho de ellos y hay muchos `if` o `switch` sobre el estado.

**✅ Ventajas:**
- Elimina las condicionales sobre el estado.
- Cada estado está aislado; añadir uno no rompe los demás (OCP).

**⚠️ Desventajas:** con 2 estados y poca lógica, es demasiado; un `boolean` basta.

---

## 9. Strategy: "elige el algoritmo"

**En una frase:** pon cada algoritmo en su propia clase, todos con la **misma interfaz**, para poder **intercambiarlos**.

**Problema que resuelve:** tienes varias reglas para lanzar una alerta en un partido. Si las metes todas en un método con `if (estrategia === "over05") … else if …`, crece sin parar y no puedes probarlas por separado.

**Analogía:** ir al aeropuerto. Puedes ir en coche, en autobús o en taxi. El objetivo es el mismo; tú eliges cómo según el tiempo y el dinero.

**Roles:**

| Rol | Qué es | En `strategy.ts` |
|---|---|---|
| Strategy | La interfaz común de los algoritmos | `Estrategia` (`cumple`) |
| ConcreteStrategy | Cada algoritmo | `Over05Descanso`, `GolTardio` |
| Context | Usa la estrategia sin saber cuál es | `Evaluador` (`setEstrategia`, `evaluar`) |

```ts
const datos = { minuto: 32, goles: 0, tirosPuerta: 5 };
const evaluador = new Evaluador(new Over05Descanso());
evaluador.evaluar(datos);                  // Over 0.5 al descanso: 🔔 ALERTA

evaluador.setEstrategia(new GolTardio());
evaluador.evaluar(datos);                  // Gol tardío: —   (minuto < 70)
```

En TypeScript, cuando la estrategia es un solo método, a menudo basta con **pasar una función**: `(d: DatosPartido) => boolean`. Las clases tienen sentido si cada estrategia tiene más datos o métodos, como tu `nombre`.

**Úsalo cuando:**
- Tienes varias formas de hacer lo mismo y quieres elegir en tiempo de ejecución.
- Quieres sustituir un `switch` grande sobre "tipos de algoritmo".

**✅ Ventajas:**
- Cada algoritmo se prueba por separado.
- Añades estrategias sin tocar el contexto (OCP).

**⚠️ Desventajas:** el cliente tiene que conocer las estrategias para elegir una.

### State vs Strategy

El código es **casi idéntico**: un contexto que delega en un objeto intercambiable. La diferencia es **quién cambia ese objeto**:
- **Strategy:** lo elige **el cliente desde fuera** (`setEstrategia`). Las estrategias no se conocen entre sí.
- **State:** lo cambian **los propios estados desde dentro** (`r.setEstado(new Pausado())`). Los estados conocen a los demás.

---

## 10. Template Method: "la receta con huecos"

**En una frase:** la superclase fija **los pasos y su orden**; las subclases rellenan **algunos de esos pasos**.

**Problema que resuelve:** exportar a CSV o a JSON sigue siempre el mismo proceso: filtrar, cabecera, cuerpo y pie. Sin el patrón, cada exportador repite ese orden por su cuenta, y es fácil que uno se lo salte.

**Analogía:** construir casas en serie. El plano es siempre el mismo (cimientos, estructura, tejado), pero cada comprador elige los acabados.

**Roles:**

| Rol | Qué es | En `template-method.ts` |
|---|---|---|
| AbstractClass | Define el método plantilla y los pasos | `Exportador` (`exportar`) |
| Pasos abstractos | **Obligatorios** para cada subclase | `cabecera()`, `cuerpo()` |
| Hooks | Opcionales: tienen un comportamiento por defecto | `filtrar()` (no filtra), `pie()` (vacío) |
| ConcreteClass | Rellena los pasos | `ExportadorCSV`, `ExportadorJSONGanancias` |

```ts
new ExportadorCSV().exportar(sesiones);
// fecha,resultado
// 2026-11-17,42.5
// 2026-11-18,-18

new ExportadorJSONGanancias().exportar(sesiones);
// [{"fecha":"2026-11-17","resultado":42.5}]   ← solo las ganancias
```

`ExportadorCSV` no sobrescribe ningún hook: usa los de por defecto. `ExportadorJSONGanancias` sobrescribe los dos (`filtrar` y `pie`). El orden de los pasos **solo está en `exportar()`**.

Es el **principio de Hollywood**: *"No nos llames, ya te llamaremos"*. La subclase no llama a la superclase; la superclase llama a los pasos de la subclase cuando le toca.

> 📝 TypeScript no tiene `final`, así que una subclase **podría** sobrescribir `exportar()` y romper el orden. Es un acuerdo que hay que respetar.

**Úsalo cuando:** varias clases hacen lo mismo con pequeñas diferencias en algunos pasos.

**✅ Ventajas:** el código común está en un sitio y el orden no se puede saltar.

**⚠️ Desventajas:**
- Usa **herencia**, y por tanto acopla las subclases a la superclase.
- Con muchos pasos, cuesta saber cuáles hay que sobrescribir.

### Template Method vs Strategy

- **Template Method:** usa **herencia** y cambia **partes** del algoritmo. Se decide **al escribir el código** (qué subclase usas).
- **Strategy:** usa **composición** y cambia **el algoritmo entero**. Se puede cambiar **en tiempo de ejecución**.

---

## 11. Visitor: "el inspector que visita"

**En una frase:** pon una operación nueva en una clase aparte (el visitante) que **recorre** tus objetos, en lugar de añadir un método a cada uno.

**Problema que resuelve:** tienes `Circulo` y `Rectangulo`. Hoy quieres calcular el área; mañana, exportar a SVG; pasado, a PDF. Si añades un método a cada figura por cada operación, las clases de figuras se llenan de cosas que no tienen que ver con ellas.

**Analogía:** un inspector de seguros que visita distintos edificios. Hace lo mismo (calcular la póliza), pero de forma distinta en una casa, un banco o una fábrica. Los edificios solo tienen que dejarle entrar.

**Roles:**

| Rol | Qué es | En `visitor.ts` |
|---|---|---|
| Visitor | Un método `visitar…` por cada tipo de elemento | `Visitante<R>` |
| ConcreteVisitor | Cada operación | `CalculadoraArea`, `ExportadorSVG` |
| Element | La interfaz con `aceptar` | `Figura` |
| ConcreteElement | Cada tipo, que llama a su método del visitante | `Circulo`, `Rectangulo` |

```ts
const figuras: Figura[] = [new Circulo(2), new Rectangulo(3, 4)];
figuras.forEach((f) => console.log(f.aceptar(area).toFixed(2), f.aceptar(svg)));
// 12.57 <circle r="2" />
// 12.00 <rect width="3" height="4" />
```

### 🔑 La clave: el doble despacho

¿Por qué no llamar directamente a `area.visitar(f)`? Porque `f` es una `Figura` y TypeScript no sabe si es un círculo o un rectángulo. El truco es hacer **dos llamadas**:
1. `f.aceptar(area)`: se decide **qué figura** es (cada clase tiene su `aceptar`).
2. Dentro, `Circulo` llama a `v.visitarCirculo(this)`: se decide **qué operación** se hace.

Tu ejemplo usa un **genérico** `Visitante<R>`, así que cada visitante devuelve su propio tipo (`number` para el área y `string` para el SVG), con tipos correctos y sin `any`.

**Úsalo cuando:** tienes una estructura con **pocos tipos de elementos que casi no cambian**, y **muchas operaciones** que van creciendo, como en compiladores (árboles de sintaxis) o exportaciones a varios formatos.

**✅ Ventajas:** añadir una operación nueva es una clase nueva, sin tocar las figuras (OCP).

**⚠️ Desventajas:**
- **Añadir un tipo de elemento nuevo** (`Triangulo`) obliga a cambiar **todos** los visitantes. Es el problema inverso.
- El visitante necesita que los elementos le muestren sus datos (`public radio`), y eso rompe un poco la encapsulación.

> 💡 En TypeScript moderno, con una **unión discriminada** (`type Figura = { tipo: "circulo"; … } | { tipo: "rect"; … }`) y un `switch`, consigues algo parecido con menos código.

---

## 🎯 Los que delegan en un objeto intercambiable: State vs Strategy vs Command vs Template Method

Todos "sacan un comportamiento a otra parte". Los distingue **qué se saca** y **quién decide**:

| Patrón | Qué encapsula | ¿Quién decide cuál se usa? | Mecanismo |
|---|---|---|---|
| **Strategy** | **Cómo** hacer algo (un algoritmo) | El cliente, desde fuera | Composición |
| **State** | **Cómo comportarse** según el estado | Los estados, desde dentro | Composición |
| **Command** | **Qué** hacer (una acción concreta, con sus datos) | Quien la crea; se puede guardar para luego | Composición |
| **Template Method** | **Algunos pasos** de un algoritmo fijo | La subclase elegida | Herencia |

> **Strategy elige · State cambia solo · Command recuerda · Template Method rellena.**

---

## Tabla comparativa final

| Patrón | Pregunta que responde | Analogía | Riesgo principal | Se confunde con |
|---|---|---|---|---|
| **Chain of Responsibility** | ¿Cómo paso una petición por varios filtros? | Atención al cliente por niveles | Que nadie la atienda; el orden | Decorator |
| **Command** | ¿Cómo guardo una acción para deshacerla o encolarla? | Comanda del restaurante | Muchas clases | Strategy, Memento |
| **Interpreter** | ¿Cómo evalúo frases de un lenguaje pequeño? | Partitura | Inmanejable si la gramática crece | Composite |
| **Iterator** | ¿Cómo recorro algo sin ver su interior? | Botones + y − de la tele | Innecesario para arrays | — |
| **Mediator** | ¿Cómo evito que todos se conozcan entre sí? | Torre de control | Objeto dios | Observer, Facade |
| **Memento** | ¿Cómo vuelvo a un estado anterior? | Partida guardada | Memoria | Command |
| **Observer** | ¿Cómo aviso a quien le interese? | Suscripción de YouTube | Fugas si no te desuscribes | Mediator |
| **State** | ¿Cómo cambio de comportamiento según el estado? | Botón de bloqueo del móvil | Exceso para casos simples | Strategy |
| **Strategy** | ¿Cómo intercambio algoritmos? | Coche, bus o taxi | El cliente debe conocerlas | State, Template Method |
| **Template Method** | ¿Cómo fijo los pasos y varío algunos? | Casas en serie | Acoplamiento por herencia | Strategy |
| **Visitor** | ¿Cómo añado operaciones sin tocar las clases? | Inspector de seguros | Añadir tipos nuevos es caro | Iterator, Composite |

### 🧠 Para recordarlos

- **Chain of Responsibility:** "la cadena de ventanillas".
- **Command:** "la comanda del restaurante".
- **Interpreter:** "la gramática hecha clases".
- **Iterator:** "el mando de la tele".
- **Mediator:** "la torre de control".
- **Memento:** "la partida guardada".
- **Observer:** "la suscripción".
- **State:** "cada estado es una clase".
- **Strategy:** "elige el algoritmo".
- **Template Method:** "la receta con huecos".
- **Visitor:** "el inspector que visita".

---

**Fuentes:**
- [Refactoring.Guru – Patrones de comportamiento](https://refactoring.guru/es/design-patterns/behavioral-patterns) (y las páginas de cada patrón).
- [Wikipedia – Behavioral pattern](https://en.wikipedia.org/wiki/Behavioral_pattern).
- Gamma, Helm, Johnson y Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994).
