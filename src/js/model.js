import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PAGE_SIZE, KEY } from './config.js';
import { AJAX } from './helpers.js';


// 2. Para almacenar esta información, realiza los siguientes cambios:
// a. En el objeto state, crea una nueva propiedad llamada search y como valor
// tendrá un objeto que a su vez tendrá dos propiedades:
// i. La propiedad query que tendrá inicialmente la cadena vacía como valor.
// ii. La propiedad results que tendrá como valor un arreglo vacío

// b. En el archivo del modelo, realiza los siguientes cambios:
// i. Importa la constante RES_PER_PAGE.
// ii. En el state agrega las siguientes propiedades:
// 1. Page con el valor 1 por defecto.
// 2. A resultsPerPage asígnale el valor de la constante RES_PER_PAGE

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    pagesNum: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(`${err} 🥲`);
    throw err;
  }
};

// b. En la función loadSearchResults realiza estos cambios:
// i. Asigna la variable query a state.search.results.
// ii. Asigna a state.search.results la matriz con los nuevos objetos.
// iii. Envía a la consola los resultados, deberían ser similares a esto

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //destructuring
    const {
      data: { recipes: searchRecipes },
    } = data;

    state.search.query = query;
    state.search.results = searchRecipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.pagesNum = parseInt(
      Math.ceil(state.search.results.length / RESULT_PAGE_SIZE)
    );

    // A SOLUTION FOR A BUG...
    state.search.page = 1;
  } catch (err) {
    console.log(`${err} 🥲`);
    throw err;
  }
};

// iii. En la parte final del archivo crea una función expresada con las siguientes
// características:
// 1. Asígnale el nombre getSearchResultsPage.
// 2. La función recibe el parámetro page (iguálalo a state.search.page para
// prevenir algún error si es que no se pasa nada en page).
// 3. Exporta la función recién creada
// 4. En el cuerpo de la función haz lo siguiente:
// a. Asigna el valor de page pasado como parámetro a
// starte.search.page.
// b. Crea las constantes start y end, para hacer que su contenido sea
// dinámico, realiza lo siguiente:
// i. start asígnale el valor de (page –1) y multiplícalo por
// state.search.resultPerPage
// ii. end solo multiplícalo por state.search.resultPerPage
// c. Retorna una parte del arreglo state.search.results utilizando el
// método slice que recibirá como parámetros las constantes start y end

export function getSearchResultPage(page = 1) {
  state.search.page = page;
  const start = (page - 1) * RESULT_PAGE_SIZE;
  const end = page * RESULT_PAGE_SIZE;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings = 1) {
  this.state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  this.state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export function addBookmark(recipe) {
  if (recipe.bookmarked) return;

  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);

  if (index === -1) return;

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

export function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

export const uploadRecipe = async function (newRecipe) {
  try {
    // convert array of 2-length arrays to object and vice versa
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // replace all & start with functions
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error('please follow the format of ingridents');

        // array destructring
        const [quantity, unit, description] = ingArr;

        // ES2022 wirting object literals
        // convert string to int
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
