// a. Crea una función asíncrona llamada showRecipe
async function showRecipe() {
    try {
      // b. Crea una constante resp, iguálala a un await para que espere el resultado de la función de búsqueda (fetch), la cual devolverá una promesa, y pásale como parámetro la siguiente URL válida para la API: https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
      const resp = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
      // c. Una vez que tengas el resultado, es necesario convertirlo a JSON. Para ello, declara una constante data, que será igual a resp, utilizando el método json() (no olvides utilizar el await)
      const data = await resp.json();
      // d. Envía a la consola las constantes resp y data
      console.log(resp);
      console.log(data);
    } catch (error) {
      // e. En caso de error, vas a enviar en una alerta el error generado
      alert(error);
    }
  }
  
  // f. Invoca a la función showRecipe
  showRecipe();
  
  