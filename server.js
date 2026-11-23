// Servidor de tareas en memoria. Sin dependencias: solo módulos integrados de Node.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const MAX_TITULO = 120;
const MAX_CUERPO = 4096;

/** Valida el título de una tarea. Devuelve el título limpio o null si no es válido. */
export function validarTitulo(valor) {
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim();
  if (limpio.length === 0 || limpio.length > MAX_TITULO) return null;
  return limpio;
}

function responderJson(res, estado, cuerpo) {
  const datos = JSON.stringify(cuerpo);
  res.writeHead(estado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(datos),
  });
  res.end(datos);
}

async function leerJson(req) {
  let total = 0;
  const trozos = [];
  for await (const trozo of req) {
    total += trozo.length;
    if (total > MAX_CUERPO) throw new Error('cuerpo demasiado grande');
    trozos.push(trozo);
  }
  return JSON.parse(Buffer.concat(trozos).toString('utf8'));
}

async function servirArchivo(res, ruta, tipo) {
  try {
    const contenido = await readFile(join(aqui, 'public', ruta));
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(contenido);
  } catch {
    responderJson(res, 404, { error: 'no_encontrado' });
  }
}

/** Crea el servidor. Cada servidor tiene su propia lista de tareas en memoria. */
export function crearServidor() {
  const tareas = [];
  let siguienteId = 1;

  return createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && pathname === '/') {
      return servirArchivo(res, 'index.html', 'text/html; charset=utf-8');
    }
    if (req.method === 'GET' && pathname === '/lista.js') {
      return servirArchivo(res, 'lista.js', 'text/javascript; charset=utf-8');
    }
    if (req.method === 'GET' && pathname === '/tareas') {
      return responderJson(res, 200, tareas);
    }
    if (req.method === 'POST' && pathname === '/tareas') {
      let entrada;
      try {
        entrada = await leerJson(req);
      } catch {
        return responderJson(res, 400, { error: 'json_invalido' });
      }
      const titulo = validarTitulo(entrada?.titulo);
      if (titulo === null) return responderJson(res, 400, { error: 'titulo_invalido' });
      const tarea = { id: siguienteId++, titulo, hecha: false };
      tareas.push(tarea);
      return responderJson(res, 201, tarea);
    }
    return responderJson(res, 404, { error: 'no_encontrado' });
  });
}

// Arranca solo si se ejecuta directamente: `node server.js`.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const puerto = Number(process.env.PORT ?? 3000);
  crearServidor().listen(puerto, '127.0.0.1', () => {
    console.log(`tareas-demo escuchando en http://127.0.0.1:${puerto}/`);
  });
}
