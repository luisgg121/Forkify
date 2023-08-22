// a. En la carpeta views, crea el archivo searchViews.js.
// b. Dentro de este, crea la clase SearchView.
// i. Crea el elemento padre privado (#parentEl) al cual le deberás asignar el
// elemento con la clase search utilizando un querySelector.
// ii. Crea un método getQuery que retorne el valor del elemento con la clase
// search__field utilizando el método querySelector del elemento padre.
// iii. Crea un listener que va a escuchar el evento clic.
// iv. No olvides exportar por defecto una invocación a la clase recién creada

class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clear();
    return query;
  }

  #clear() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  // d. Para hacer que se escuche el evento del botón, utiliza el patrón editor-suscriptor de la
  // siguiente manera:
  // i.. En la clase SearchView crea el método addHandlerSearch que recibirá a handler
  // como parámetro.
  // ii.. Para escuchar el evento, realiza lo siguiente:
  // 1. Utiliza el método addEventListener de this.#parentEl y pásale como
  // parámetros:
  // a. El evento ‘submit’.
  // b. Una función anónima con el evento(e) como parámetro y en el cuerpo
  // debe:
  // i. Enviar la acción predeterminada con el método preventDefault del
  // evento(e).
  // ii. Llamar a la función del controlador (handler()).

  addHandlerSearch(handler) {
    // recall: parent element is a form, so we need to prevent default before calling the handler
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
