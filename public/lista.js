// Lógica de presentación sin DOM, para poder probarla con `node --test`.

/** Escapa texto para insertarlo en HTML. Los títulos son datos no confiables. */
export function escaparHtml(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Valida el texto escrito en el formulario. Devuelve el título limpio o null. */
export function validarEntrada(texto) {
  if (typeof texto !== 'string') return null;
  const limpio = texto.trim();
  return limpio.length > 0 && limpio.length <= 120 ? limpio : null;
}

/** Devuelve el HTML de una fila de la lista. */
export function filaTarea(tarea) {
  const marca = tarea.hecha ? 'hecha' : 'pendiente';
  return `<li data-id="${escaparHtml(tarea.id)}" class="${marca}">${escaparHtml(tarea.titulo)}</li>`;
}

/** Resumen de la lista: «3 tareas, 1 hecha». */
export function resumen(tareas) {
  const hechas = tareas.filter((t) => t.hecha).length;
  const total = tareas.length;
  return `${total} ${total === 1 ? 'tarea' : 'tareas'}, ${hechas} ${hechas === 1 ? 'hecha' : 'hechas'}`;
}
