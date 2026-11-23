import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearServidor, validarTitulo } from '../server.js';

async function conServidor(prueba) {
  const servidor = crearServidor();
  await new Promise((listo) => servidor.listen(0, '127.0.0.1', listo));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  try {
    await prueba(base);
  } finally {
    await new Promise((listo) => servidor.close(listo));
  }
}

test('validarTitulo acepta títulos normales y rechaza vacíos o largos', () => {
  assert.equal(validarTitulo('  Comprar pan '), 'Comprar pan');
  assert.equal(validarTitulo('   '), null);
  assert.equal(validarTitulo(42), null);
  assert.equal(validarTitulo('x'.repeat(121)), null);
});

test('la lista empieza vacía', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/tareas`);
    assert.equal(respuesta.status, 200);
    assert.deepEqual(await respuesta.json(), []);
  });
});

test('crear una tarea válida la devuelve y la guarda', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Escribir informe' }),
    });
    assert.equal(respuesta.status, 201);
    const tarea = await respuesta.json();
    assert.equal(tarea.titulo, 'Escribir informe');
    assert.equal(tarea.hecha, false);
    const lista = await (await fetch(`${base}/tareas`)).json();
    assert.equal(lista.length, 1);
    assert.equal(lista[0].id, tarea.id);
  });
});

test('un título inválido o un JSON roto responden 400', async () => {
  await conServidor(async (base) => {
    const sinTitulo = await fetch(`${base}/tareas`, { method: 'POST', body: JSON.stringify({ titulo: '' }) });
    assert.equal(sinTitulo.status, 400);
    const jsonRoto = await fetch(`${base}/tareas`, { method: 'POST', body: '{no es json' });
    assert.equal(jsonRoto.status, 400);
  });
});

test('una ruta desconocida responde 404', async () => {
  await conServidor(async (base) => {
    const respuesta = await fetch(`${base}/no-existe`);
    assert.equal(respuesta.status, 404);
  });
});
