# 02 · Estructurales (cómo se componen)

| Patrón | Idea | Ejemplo |
|---|---|---|
| Adapter | Adaptar una interfaz a otra | API heredada en céntimos → euros |
| Bridge | Separar abstracción e implementación | Mandos y dispositivos |
| Composite | Árboles: hoja y grupo se tratan igual | Archivos y carpetas |
| Decorator | Añadir funcionalidad envolviendo | Café con extras |
| Facade | Interfaz simple a un subsistema | Desplegar una web |
| Flyweight | Compartir estado para ahorrar memoria | 52 cartas para 10.000 manos |
| Proxy | Sustituto que controla el acceso | Caché delante de una API |

---

## ¿Qué son los patrones estructurales?

Los creacionales responden a *"¿cómo creo objetos?"*. Los **estructurales** responden a otra pregunta: **¿cómo encajo clases y objetos para formar estructuras más grandes sin que todo quede acoplado?**

Casi todos usan **composición**: un objeto guarda dentro otro y le pasa el trabajo (*delega*), en lugar de heredar de él. Por eso muchos se parecen por fuera, porque todos "envuelven" algo. Lo que los diferencia es la **intención**, es decir, *para qué* envuelven.

> 💡 **Consejo:** cuando dudes entre dos patrones, no mires el código, que puede ser casi idéntico. Pregúntate **qué problema resuelve**.

---

## 1. Adapter: "el traductor"

**En una frase:** hace que dos piezas con interfaces incompatibles puedan trabajar juntas.

**Problema que resuelve:** tu app trabaja con euros y la API antigua devuelve `{ uid, cents }`. No puedes (o no quieres) modificar esa API.

**Analogía:** el adaptador de enchufe para viajar. Ni el cargador ni la pared cambian; el adaptador hace de puente.

**Roles:**

| Rol | Qué es | En `adapter.ts` |
|---|---|---|
| Target | La interfaz que **espera tu código** | `ProveedorSaldo` (`getSaldoEuros`) |
| Adaptee | La clase incompatible (heredada o de terceros) | `ApiLegacy` (`fetchBalance`) |
| Adapter | Implementa el Target y traduce las llamadas al Adaptee | `ApiLegacyAdapter` |
| Client | Solo conoce el Target | `mostrarSaldo()` |

```ts
function mostrarSaldo(proveedor: ProveedorSaldo) {
  console.log(`Saldo: ${proveedor.getSaldoEuros("josan").toFixed(2)} €`);
}
mostrarSaldo(new ApiLegacyAdapter(new ApiLegacy()));
```

Tu ejemplo es un **adaptador de objeto**: recibe el `ApiLegacy` en el constructor y lo guarda dentro. Existe también el *adaptador de clase*, que usa herencia múltiple, pero no es posible en TypeScript. Fíjate en que tu adaptador no solo cambia el nombre del método: también **transforma los datos** (`cents / 100`).

**Úsalo cuando:** quieres usar una clase que ya existe cuya interfaz no encaja con la tuya. Es típico de código heredado y librerías de terceros.

**✅ Ventajas:**
- La conversión queda en un solo sitio (SRP).
- Puedes añadir adaptadores nuevos sin tocar el cliente (OCP).

**⚠️ Desventajas:** añade clases. A veces es más sencillo cambiar la clase original, si puedes hacerlo.

---

## 2. Bridge: "separa los dos ejes"

**En una frase:** divide una clase que varía en **dos dimensiones** en dos jerarquías separadas, **abstracción** e **implementación**, unidas por un "puente" (una referencia).

**Problema que resuelve:** la explosión de clases. Con herencia, para 2 tipos de mando y 2 dispositivos necesitarías `MandoBasicoTele`, `MandoBasicoRadio`, `MandoAvanzadoTele`… Cada mando o dispositivo nuevo **multiplica** las clases. Con Bridge solo **se suman**: el mando *tiene* un dispositivo, en vez de *ser* un mando-de-tele.

**Analogía:** un mando universal y los aparatos. Puedes inventar mandos nuevos sin tocar los aparatos, y al revés.

**Roles:**

| Rol | Qué es | En `bridge.ts` |
|---|---|---|
| Abstraction | La lógica de alto nivel; guarda la referencia | `Mando` |
| RefinedAbstraction | Una variante con más funciones | `MandoAvanzado` (`silenciar()`) |
| Implementor | La interfaz de la parte "de bajo nivel" | `Dispositivo` |
| ConcreteImplementor | Las implementaciones concretas | `Tele`, `Radio` |

```ts
new Mando(new Tele()).power();
const mando = new MandoAvanzado(new Radio());
mando.power();
mando.subirVolumen();
mando.silenciar();
```

> 📝 **Nota sobre tu ejemplo:** tu `Dispositivo` solo tiene **datos** (`nombre`, `encendido`, `volumen`) y ningún método. `Mando` cambia esos datos directamente (`this.dispositivo.volumen++`). En el Bridge clásico, el Implementor declara **operaciones** (`encender()`, `setVolumen()`) y **cada dispositivo las implementa a su manera**. Ahí está la gracia del patrón. Para mejorar el ejemplo, añade esos métodos y haz que la Tele y la Radio se comporten de forma distinta.

**Úsalo cuando:**
- Una clase varía en 2 o más dimensiones independientes, como forma × color, mando × dispositivo o app × plataforma.
- Quieres cambiar la implementación en tiempo de ejecución.

**✅ Ventajas:**
- Cada jerarquía crece por su lado (OCP).
- El código de alto nivel no depende de la plataforma.

**⚠️ Desventajas:** complica las cosas si la clase solo varía en una dimensión.

### Bridge vs Adapter

Se parecen mucho, porque los dos usan composición. Lo que cambia es **cuándo** y **para qué**:
- **Bridge** se diseña **antes**, para que dos partes evolucionen por separado.
- **Adapter** se aplica **después**, para que encajen piezas que ya existen.

---

## 3. Composite: "el árbol"

**En una frase:** organiza objetos en forma de **árbol** y permite tratar igual a **un elemento suelto (hoja)** y a **un grupo (rama)**.

**Problema que resuelve:** quieres saber el tamaño total de una carpeta que tiene archivos y otras carpetas dentro. Con Composite no necesitas preguntar en cada paso "¿esto es archivo o carpeta?": llamas a `getTamano()` y cada uno sabe qué hacer.

**Analogía:** un ejército. El general da una orden a la división, la división a las brigadas, y así hasta el soldado. Cada nivel la pasa hacia abajo.

**Roles:**

| Rol | Qué es | En `composite.ts` |
|---|---|---|
| Component | La interfaz común | `Nodo` (`getTamano`, `imprimir`) |
| Leaf | Elemento sin hijos; hace el trabajo real | `Archivo` |
| Composite | Tiene hijos, les delega y combina sus resultados | `Carpeta` (`hijos: Nodo[]`, `agregar`) |

```ts
const src = new Carpeta("src")
  .agregar(new Archivo("index.ts", 4))
  .agregar(new Carpeta("components").agregar(new Archivo("Mesa.tsx", 12)).agregar(new Archivo("Carta.tsx", 3)));

const proyecto = new Carpeta("proyecto").agregar(src).agregar(new Archivo("package.json", 1));
proyecto.imprimir();
```

La "magia" es la **recursión**. `Carpeta.getTamano()` suma `getTamano()` de cada hijo. Si el hijo es otra carpeta, esta hace lo mismo con los suyos, y así hasta llegar a los archivos.

Tu ejemplo sigue el diseño **"seguro"**: `agregar` solo existe en `Carpeta` y no en `Nodo`, así que no puedes añadir hijos a un archivo por error. En el diseño **"transparente"**, `agregar` iría en la interfaz común, y entonces habría que decidir qué hace en una hoja.

**Úsalo cuando:** tu modelo es un árbol, como carpetas, menús y submenús, componentes de una interfaz gráfica u organigramas.

**✅ Ventajas:**
- Árboles complejos con muy poco código.
- Puedes añadir tipos nuevos de nodo sin cambiar el resto.

**⚠️ Desventajas:** si las hojas y las ramas se parecen poco, la interfaz común acaba siendo demasiado genérica.

---

## 4. Decorator: "capas de ropa"

**En una frase:** añade funciones a un objeto **envolviéndolo** en otros objetos con **la misma interfaz**, y se pueden **apilar**.

**Problema que resuelve:** un café puede llevar leche, caramelo, nata… y **cualquier combinación**. Con herencia necesitarías `CafeConLeche`, `CafeConLecheYCaramelo`, `CafeConNata`… una explosión de subclases.

**Analogía:** la ropa. Te pones camiseta, jersey y abrigo. Cada capa añade algo, puedes combinarlas como quieras y no forman parte de ti.

**Roles:**

| Rol | Qué es | En `decorator.ts` |
|---|---|---|
| Component | La interfaz común | `Bebida` |
| ConcreteComponent | El objeto base | `Cafe` |
| Decorator | Clase base que envuelve un Component | `Extra` (`protected bebida`) |
| ConcreteDecorator | Añaden su parte y delegan el resto | `ConLeche`, `ConCaramelo` |

```ts
const pedido: Bebida = new ConCaramelo(new ConLeche(new Cafe()));
console.log(`${pedido.descripcion()} = ${pedido.precio().toFixed(2)} €`);
```

Cómo funciona:
1. `ConCaramelo.precio()` le pregunta su precio a lo que tiene dentro, que es `ConLeche`.
2. `ConLeche` hace lo mismo con `Cafe`.
3. A la vuelta, cada capa suma lo suyo.

Tu `Extra` declara `descripcion()` y `precio()` como **abstractos**, así que cada extra tiene que llamar a la bebida de dentro por su cuenta. En la versión clásica, el decorador base ya hace ese reenvío por defecto.

**Úsalo cuando:**
- Quieres combinar funciones en tiempo de ejecución.
- La herencia te llevaría a demasiadas subclases.

**✅ Ventajas:**
- Combinaciones ilimitadas sin subclases.
- Cada decorador hace una sola cosa (SRP).

**⚠️ Desventajas:**
- **El orden de las capas puede cambiar el resultado.**
- Es difícil quitar una capa del medio.

### Composite vs Decorator

Los dos envuelven de forma recursiva, pero:
- **Composite** tiene **muchos hijos** y **combina** sus resultados.
- **Decorator** tiene **un solo hijo** y le **añade** algo.

---

## 5. Facade: "la ventanilla única"

**En una frase:** ofrece **una interfaz sencilla** para un subsistema complicado.

**Problema que resuelve:** para publicar una web tienes que compilar, subir por FTP y purgar la caché de la CDN, en ese orden y con sus detalles. No quieres que todo tu código conozca esos pasos.

**Analogía:** llamar a la tienda por teléfono. El operador (la fachada) se encarga del almacén, el pago y el envío, y tú solo hablas con él.

**Roles:**

| Rol | Qué es | En `facade.ts` |
|---|---|---|
| Facade | Punto de entrada simple; coordina el subsistema | `Despliegue` (`publicar()`) |
| Subsistema | Las clases que hacen el trabajo real (no saben que existe la fachada) | `Compilador`, `ClienteFTP`, `Cdn` |

```ts
// El cliente solo llama a un método
new Despliegue().publicar("ftp.mihosting.com");
```

> 📝 **Nota sobre tu ejemplo:** `Despliegue` crea ella misma sus piezas (`private compilador = new Compilador()`). Funciona, pero la ata a esas clases concretas y la hace difícil de probar. Si las recibiera por el constructor, podrías pasarle versiones falsas en los tests.

**Úsalo cuando:**
- Quieres esconder una librería o un subsistema complejo.
- Quieres organizar el sistema en capas, con una fachada como entrada a cada capa.

**✅ Ventajas:**
- Tu código no depende de los detalles internos del subsistema.
- Si el subsistema cambia, solo tocas la fachada.

**⚠️ Desventajas:** puede crecer hasta convertirse en un **"objeto dios"** que lo sabe y lo hace todo.

---

## 6. Flyweight: "comparte lo que se repite"

**En una frase:** ahorra memoria **compartiendo** entre muchos objetos la parte de su estado que es **idéntica**, en lugar de que cada uno tenga su copia.

**Problema que resuelve:** si 10.000 manos de póker crean cada una sus propios objetos `Carta`, tendrás miles de cartas "A♠" idénticas ocupando memoria. Pero un As de picas es siempre el mismo.

**Analogía:** en un editor de texto, la letra "a" (su forma y su fuente) se guarda **una sola vez**. Cada aparición en el documento solo apunta a ella y añade *dónde* está.

### 🔑 La clave: estado intrínseco vs extrínseco

| | Intrínseco | Extrínseco |
|---|---|---|
| Qué es | Lo que es **igual** en todos los usos | Lo que es **propio de cada uso** |
| Dónde vive | **Dentro** del flyweight (compartido) | **Fuera**, en el objeto que lo usa |
| ¿Puede cambiar? | ❌ Inmutable (`readonly`) | ✅ Sí |
| En tu ejemplo | `valor` + `palo` de la carta | `id` y `jugador` de cada mano |

**Regla práctica:** si el dato se repite igual en miles de objetos, es intrínseco y se comparte.

**Roles:**

| Rol | Qué es | En `flyweight.ts` |
|---|---|---|
| Flyweight | Objeto compartido con solo el estado intrínseco | `Carta` |
| FlyweightFactory | Guarda los flyweights; si ya existe uno, lo reutiliza | `FabricaCartas` (`cache: Map`, `get`) |
| Context | Guarda el estado extrínseco y apunta al flyweight | Cada objeto mano `{ id, jugador, cartas }` |

```ts
const manos = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  jugador: `player${i % 6}`,
  cartas: [FabricaCartas.get("A", "s"), FabricaCartas.get("K", "h")],
}));

console.log(`Objetos Carta en memoria: ${FabricaCartas.total()}`);  // 2, no 20.000
console.log(manos[0].cartas[0] === manos[9999].cartas[0]);          // true
```

> 📝 **Nota sobre tu ejemplo:** el comentario habla de "52 cartas", pero el código solo pide el As de picas y el Rey de corazones, así que `total()` imprime **2**. La idea es la misma: como mucho habrá 52 cartas, aunque haya un millón de manos.

**Úsalo cuando:** **solo** cuando tienes una cantidad enorme de objetos parecidos y la memoria es un problema real. Es una **optimización**: no lo apliques "por si acaso".

**✅ Ventajas:** puede ahorrar muchísima memoria.

**⚠️ Desventajas:**
- Más complejidad, porque separar el estado en dos no resulta intuitivo.
- A veces ahorras memoria a costa de más CPU.

### Flyweight vs Singleton

- **Singleton:** **una** instancia en total, y puede cambiar.
- **Flyweight:** **una instancia por cada valor distinto** (una por carta), y no cambian.

---

## 7. Proxy: "el portero"

**En una frase:** un **sustituto** con **la misma interfaz** que el objeto real, que se pone delante para **controlar el acceso** a él.

**Problema que resuelve:** la API de cuotas tarda 300 ms en cada llamada. Si pides la misma cuota dos veces, no tiene sentido esperar otra vez.

**Analogía:** la tarjeta de crédito. Paga igual que el dinero de tu cuenta, pero controla el acceso a él con el PIN, los límites y el registro de cada pago.

**Roles:**

| Rol | Qué es | En `proxy.ts` |
|---|---|---|
| Subject | Interfaz común del real y del proxy | `ServicioCuotas` (`getCuota`) |
| RealSubject | El objeto real (lento, caro, remoto...) | `ApiCuotas` |
| Proxy | Mismo interfaz; hace su trabajo extra y delega | `ApiCuotasProxy` (`cache: Map`) |

```ts
const servicio: ServicioCuotas = new ApiCuotasProxy(new ApiCuotas());
console.log(await servicio.getCuota("Nadal vs Alcaraz"));  // lenta: va a la API
console.log(await servicio.getCuota("Nadal vs Alcaraz"));  // instantánea: sale de la caché
```

El cliente **no sabe** si está hablando con el proxy o con la API real. Esa es la clave.

### Tipos de proxy

| Tipo | Qué controla | Ejemplo |
|---|---|---|
| **Caché** ← *el tuyo* | Guarda resultados repetidos | Respuestas de una API |
| **Virtual** | Crea el objeto pesado solo cuando hace falta (*lazy*) | Cargar una imagen grande al mostrarla |
| **Protección** | Comprueba permisos antes de dejar pasar | Solo un administrador puede borrar |
| **Remoto** | Representa un objeto que está en otro servidor | Clientes de gRPC |
| **Logging** | Registra cada llamada | Auditoría |

> 📝 Tu caché **nunca caduca**. En la vida real, las cuotas cambian, así que convendría añadir un tiempo de expiración (TTL).

**✅ Ventajas:**
- Añade control sin que el cliente se entere.
- Puedes añadir proxies nuevos sin tocar el servicio (OCP).

**⚠️ Desventajas:**
- Más clases.
- Puede añadir retraso a las respuestas, o devolver datos desactualizados si es de caché.

---

## 🎯 Los cuatro que "envuelven": Adapter vs Decorator vs Proxy vs Facade

Es la confusión más habitual. La pregunta que los distingue es: **¿qué le pasa a la interfaz?**

| Patrón | Interfaz | ¿Qué envuelve? | Intención | ¿Quién monta el envoltorio? |
|---|---|---|---|---|
| **Adapter** | La **cambia** | Un objeto | Que encajen piezas incompatibles | El desarrollador, una vez |
| **Decorator** | La **mantiene** (y añade comportamiento) | Un objeto, apilable | Añadir funciones por capas | **El cliente** elige las capas |
| **Proxy** | La **mantiene** idéntica | Un objeto | **Controlar** el acceso | **El proxy** gestiona el objeto real |
| **Facade** | **Crea una nueva** más simple | **Un subsistema entero** | Ocultar complejidad | El desarrollador |

> **Adapter traduce · Decorator añade · Proxy controla · Facade simplifica.**

---

## Tabla comparativa final

| Patrón | Pregunta que responde | Analogía | Riesgo principal | Se confunde con |
|---|---|---|---|---|
| **Adapter** | ¿Cómo encajo algo incompatible? | Adaptador de enchufe | Clases extra | Bridge, Facade |
| **Bridge** | ¿Cómo evito la explosión de clases con 2 ejes? | Mando + aparato | Complicar algo simple | Adapter, Strategy |
| **Composite** | ¿Cómo trato igual a uno y a un grupo? | Jerarquía militar | Interfaz demasiado genérica | Decorator |
| **Decorator** | ¿Cómo añado funciones combinables? | Capas de ropa | El orden importa | Proxy, Composite |
| **Facade** | ¿Cómo simplifico algo complejo? | Operador telefónico | Objeto dios | Adapter, Proxy |
| **Flyweight** | ¿Cómo ahorro memoria con millones de objetos? | Letras de un editor | Más complejidad y CPU | Singleton |
| **Proxy** | ¿Cómo controlo el acceso a un objeto? | Tarjeta de crédito | Latencia, datos viejos | Decorator |

### 🧠 Para recordarlos

- **Adapter:** "el traductor".
- **Bridge:** "separa los dos ejes".
- **Composite:** "el árbol".
- **Decorator:** "capas de ropa".
- **Facade:** "la ventanilla única".
- **Flyweight:** "comparte lo que se repite".
- **Proxy:** "el portero".

---

**Fuentes:**
- [Refactoring.Guru – Patrones estructurales](https://refactoring.guru/es/design-patterns/structural-patterns) (y las páginas de cada patrón).
- [Wikipedia – Structural pattern](https://en.wikipedia.org/wiki/Structural_pattern).
- Gamma, Helm, Johnson y Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994).
