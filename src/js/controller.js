import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

// a. En el archivo controller.js crea la función asíncrona controlSearchResults con una
// estructura try – catch:
// i. Dentro del try realiza lo siguiente:
// 1. Invoca a la función model.loadsearchResults con el parámetro query,
// recuerda que esta función debe esperar(await).
// 2. Imprime en la consola el resultado (state.search.results).
// ii. Dentro del catch imprime en la consola el error (err).
// iii. Prueba la funcionalidad invocando a la función controlSerachResults

// c. En el archivo controller realiza lo siguiente:
// i. Importa la clase SearchView.
// ii. En la función controlSearchResults instancia la función searchView.getQuery
// y asígnala a la constante query.
// iii. Valida que, si no existe ninguna consulta, regrese inmediatamente

// c. En el archivo del controlador, en la función SearchResults, modifica la forma en la que
// se hace el render de los resultados para que se cambien los siguientes: en lugar de
// resultsView.render(model.state.search.results), que ahora tome los resultados de la función
// resultsView.render(model.getSearchResultsPage).

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    
    const query = searchView.getQuery();
    if (!query) return;

    
    await model.loadSearchResults(query);

    
    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const controlPagination = function (goto) {
  resultsView.render(model.getSearchResultPage(goto));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  
  recipeView.update(model.state.recipe);

  
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    
    recipeView.render(model.state.recipe);

    
    addRecipeView.renderMessage();

    
    bookmarkView.render(model.state.bookmarks);

    
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.restoreMarkup();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('🔥', error);
    addRecipeView.renderError(error.message);
  }
};

// d. En el archivo controller, crea la función init:
// i. Dentro del cuerpo instancia el método addHandlerRender recién creado
// y pásale como parámetro controlRecipes.
// ii. Invoca a la función init

// iii. En el controller, agrega a la función init el método
// searchView.addHandlerSearch con el parámetro controlSearchResults).

const init = function () {
  model.init();
  bookmarkView.addHandlerLoadBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

