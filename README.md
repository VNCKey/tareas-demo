# tareas-demo

Proyecto base **sin dependencias** para la demostración multiagente de gndeep-assembly.
Solo usa módulos integrados de Node.js (24 o superior) y su ejecutor de pruebas.

## Estructura
- `server.js`: API en memoria. `GET /tareas`, `POST /tareas` con `{ "titulo": "…" }`.
- `public/index.html` y `public/lista.js`: la pantalla y su lógica de presentación.
- `test/api.test.js`: pruebas del backend. `test/ui.test.js`: pruebas del frontend.

## Uso
```sh
npm test      # node --test, sin red ni dependencias
npm start     # http://127.0.0.1:3000/
```

## Tarea de la demostración
> Añade el campo **prioridad** (`alta`, `media` o `baja`) a las tareas. El **backend** lo valida
> (por defecto `media`; cualquier otro valor responde 400) y lo devuelve en cada tarea.
> El **frontend** lo muestra en cada fila y permite elegirlo al crear la tarea.
> Cada uno añade y ejecuta sus pruebas.

Reparto esperado: el agente de backend toca `server.js` y `test/api.test.js`; el de frontend
toca `public/` y `test/ui.test.js`.
