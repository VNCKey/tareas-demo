import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escaparHtml, filaTarea, resumen, validarEntrada } from '../public/lista.js';

test('escaparHtml neutraliza etiquetas y comillas', () => {
  assert.equal(escaparHtml('<b>"hola"</b>'), '&lt;b&gt;&quot;hola&quot;&lt;/b&gt;');
});

test('validarEntrada limpia espacios y rechaza vacíos o largos', () => {
  assert.equal(validarEntrada('  Llamar  '), 'Llamar');
  assert.equal(validarEntrada('   '), null);
  assert.equal(validarEntrada('y'.repeat(121)), null);
  assert.equal(validarEntrada(undefined), null);
});

test('filaTarea marca el estado y escapa el título', () => {
  const html = filaTarea({ id: 7, titulo: '<script>x</script>', hecha: true });
  assert.match(html, /class="hecha"/);
  assert.match(html, /data-id="7"/);
  assert.ok(!html.includes('<script>'));
});

test('resumen cuenta tareas y hechas con singular y plural', () => {
  assert.equal(resumen([]), '0 tareas, 0 hechas');
  assert.equal(resumen([{ hecha: true }]), '1 tarea, 1 hecha');
  assert.equal(resumen([{ hecha: false }, { hecha: true }, { hecha: true }]), '3 tareas, 2 hechas');
});
