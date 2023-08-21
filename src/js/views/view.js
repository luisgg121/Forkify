import icons from '../../img/icons.svg'; // Parcel 2
import fracty from "fracty";

// common code to all views
// como hay un código común a tidas las vistas, dicho código se establece en el archivo views.js


// b. En el archivo recipeView.js crea el método addHandlerRender dentro de la
// clase RecipeView y debajo del renderSpinner. Envíale como parámetro un handler
// y en el cuerpo, pega el código copiado del archivo controller.js
// c. Modifica los parámetros que recibe el listener, pásale el evento (ev) y el handler
// recibido.


export default class View {
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // in case of preview we actually don't need to render but to generate
    // markup only. But why do not we call generateMarkup directly
    // answer is that we need to set _data data member which is set in render
    if (!render) return markup;

    this._clear(); // to delete the spinner.
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // instead of the following line, simply attach an event handler to the load event to load the bookmarks.
    if (curElements.length !== newElements.length) return this.render(data);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update the attributes for all changed elements (مش هتخسر حاجة)
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
      </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRender(handler) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // a. En la clase RecipeView crea un nuevo método responsable de mostrar el
  // mensaje de error:
  // i. Nómbralo renderError y pásale como parámetro message =
  // this._errorMessage.
  // ii. Crea la variable _errorMessage y asígnale el siguiente texto: 'We could
  // not find that recipe. Please try another one!'.
  // iii. En el cuerpo de la función declara la constante markup.
  // iv. Colócale el código del div con clase error que se encuentra en el
  // archivo index.html.
  // v. Modifica el archivo iconos del href y colócale la variable ${icons}.
  // vi. Modifica el mensaje del párrafo y ponle la variable ${message}.
  // vii. Llama al método privado #clear y el insertAdjacentHTML como en
  // los otros métodos.
  // b. Manda a llamar el errorRender desde el catch de la función controlRecipes y
  // borra el console.log que se utilizaba.
  // c. Para poder propagar el error generado en loadRecipe, utiliza la función throw
  // err en el catch

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


//   3. Parecido al anterior, genera un manejador de mensajes exitosos. Utiliza la base del
// método renderError:
// a. Copia el método renderError y renómbralo como renderMessage.
// b. Pásale como parámetro message=this._message.
// c. Cambia el icono de icon-alert-triangle a icon-smile

  renderMessage() {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${this._message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
