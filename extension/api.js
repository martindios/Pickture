import { openDatabase } from './indexdb.js';
import { favorites } from './favorites.js';
import { productsList, createProductElement } from './panel.js';

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función para obtener el token
export function getToken() {
  const username = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
  const password = "A3@X[K}2i7@I~@nF";
  const tokenUrl = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

  const tokenData = new URLSearchParams();
  tokenData.append("grant_type", "client_credentials");
  tokenData.append("scope", "technology.catalog.read");

  return fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: tokenData.toString()
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP al obtener el token: ${response.status}`);
    }
    return response.json();
  })
  .then(tokenResponse => tokenResponse.id_token);
}

// Función que utiliza el token para llamar a la API con la imagen
export function callApiWithImage(imageUrl, attempt = 1, maxAttempts = 2) {
  const productList = document.getElementById('productList');
  
  // Mostrar el loader mientras se espera la respuesta de la API
  productList.innerHTML = "<div class='loader'></div>";

  getToken()
    .then(token => { 
      const getUrl = `https://api.inditex.com/pubvsearch/products?image=${encodeURIComponent(imageUrl)}&page=1&perPage=5`;
      return fetch(getUrl, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP en la petición GET: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      const products = Array.isArray(json) ? json : json.products;
      const uniqueProducts = products.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id && p.name === product.name)
      );

      // Si no se encontraron productos y aún no se alcanzó el máximo de intentos, se reintenta la petición
      if (uniqueProducts.length === 0 && attempt < maxAttempts) {
        console.log(`Reintentando petición... intento ${attempt + 1}`);
        return callApiWithImage(imageUrl, attempt + 1, maxAttempts);
      }

      // Limpiar el spinner antes de mostrar los resultados
      productList.innerHTML = "";

      if (uniqueProducts && uniqueProducts.length > 0) {
        uniqueProducts.forEach(product => {
          const isFavorite = favorites.some(fav => fav.id === product.id);
          productsList.push(product);
          const productElement = createProductElement(product, isFavorite);
          productList.appendChild(productElement);
        });
      } else {
        productList.innerHTML = "<p>No se encontraron productos.</p>";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      productList.innerHTML = `<p>Error: ${error.message}</p>`;
    });

  openDatabase().then(() => {
      console.log('Base de datos abierta con éxito');
  }).catch(error => {
      console.error('Error al abrir la base de datos:', error);
  });
}

export function callApiWithText(queryText, brand) {
    const productList = document.getElementById('productList');
    
    // Mostrar el loader mientras se espera la respuesta de la API
    productList.innerHTML = "<div class='loader'></div>";
  
    getToken()
      .then(token => {
        // Construir la URL con el query de texto y, si se proporciona, la marca
        let url = `https://api.inditex.com/searchpmpa/products?query=${encodeURIComponent(queryText)}`;
        if (brand) {
          url += `&brand=${encodeURIComponent(brand)}`;
        }
        console.log('URL:', url);
        return fetch(url, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP en la petición GET: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        // Suponiendo que la respuesta devuelva un arreglo de productos o un objeto con la propiedad "products"
        const products = Array.isArray(json) ? json : json.products;
        const uniqueProducts = products.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id && p.name === product.name)
        );
  
        // Limpiar el spinner antes de mostrar los resultados
        productList.innerHTML = "";
  
        if (uniqueProducts && uniqueProducts.length > 0) {
          uniqueProducts.forEach(product => {
            const isFavorite = favorites.some(fav => fav.id === product.id);
            productsList.push(product);
            const productElement = createProductElement(product, isFavorite);
            productList.appendChild(productElement);
          });
        } else {
          productList.innerHTML = "<p>No se encontraron productos.</p>";
        }
      })
      .catch(error => {
        console.error("Error:", error);
        productList.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  
    openDatabase()
      .then(() => {
        console.log('Base de datos abierta con éxito');
      })
      .catch(error => {
        console.error('Error al abrir la base de datos:', error);
      });
  }
  