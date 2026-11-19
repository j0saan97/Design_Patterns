# Patrones de diseño (GoF) en TypeScript

Los 23 patrones del libro *Design Patterns* (Gamma, Helm, Johnson y Vlissides), cada uno con un ejemplo corto y ejecutable.

## Cómo ejecutar

```bash
npm install
npx tsx 03-comportamiento/observer.ts   # un patrón concreto
npm run todos                            # todos seguidos
npm run check                            # comprobar tipos
```

## Índice

### 01 · Creacionales (cómo se crean los objetos)
| Patrón | Idea | Ejemplo |
|---|---|---|
| Abstract Factory | Familias de objetos relacionados | Tema claro / oscuro |
| Builder | Construir paso a paso | Constructor de SQL |
| Factory Method | Las subclases deciden qué crear | Notificadores Telegram / Email |
| Prototype | Crear clonando | Plantillas de mesa |
| Singleton | Una única instancia | Logger |

### 02 · Estructurales (cómo se componen)
| Patrón | Idea | Ejemplo |
|---|---|---|
| Adapter | Adaptar una interfaz a otra | API heredada en céntimos → euros |
| Bridge | Separar abstracción e implementación | Mandos y dispositivos |
| Composite | Árboles: hoja y grupo se tratan igual | Archivos y carpetas |
| Decorator | Añadir funcionalidad envolviendo | Café con extras |
| Facade | Interfaz simple a un subsistema | Desplegar una web |
| Flyweight | Compartir estado para ahorrar memoria | 52 cartas para 10.000 manos |
| Proxy | Sustituto que controla el acceso | Caché delante de una API |

### 03 · De comportamiento (cómo se comunican)
| Patrón | Idea | Ejemplo |
|---|---|---|
| Chain of Responsibility | Cadena de manejadores | Middlewares HTTP |
| Command | Petición como objeto (undo) | Editor con deshacer |
| Interpreter | Gramática + evaluador | Expresiones con variables |
| Iterator | Recorrer sin exponer la estructura | Baraja con `for...of` |
| Mediator | Comunicación centralizada | Sala de chat |
| Memento | Guardar y restaurar estado | Partida guardada |
| Observer | Avisar a los suscriptores | Marcador → alertas |
| State | El comportamiento depende del estado | Reproductor de música |
| Strategy | Algoritmos intercambiables | Estrategias de alerta en partidos |
| Template Method | Esqueleto fijo, pasos variables | Exportar CSV / JSON |
| Visitor | Operaciones nuevas sin tocar clases | Área y SVG de figuras |

## Los 8 para empezar (según el libro)
Abstract Factory, Factory Method, Adapter, Composite, Decorator, Observer, Strategy y Template Method.

## Principios de fondo
- Programa para una interfaz, no para una implementación.
- Prefiere la composición a la herencia.
- Encapsula lo que varía.
