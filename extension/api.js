// Imports
import { openDatabase } from './indexdb.js';
import { favoritesList } from './favorites.js';
import { productsList, createProductElement } from './panel.js';
import { OAUTH_USERNAME, OAUTH_PASSWORD, OAUTH_TOKEN_URL } from './config.js';

// Constants
const username = OAUTH_USERNAME;
const password = OAUTH_PASSWORD;
const tokenUrl = OAUTH_TOKEN_URL;


// Retrieves the value of a specified query parameter from the current page's URL
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


// Gets the token from the API
export function getToken() {
  const tokenData = new URLSearchParams();
  tokenData.append("grant_type", "client_credentials");
  tokenData.append("scope", "technology.catalog.read");

  // Fetch the token
  return fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: tokenData.toString()
  })
  .then(response => {
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error fetching the token: ${response.status}`);
    }
    return response.json();
  })
  .then(tokenResponse => tokenResponse.id_token);
}


// Use the token to call the API with the image
export function callApiWithImage(imageUrl, attempt = 1, maxAttempts = 2) {
  const productList = document.getElementById('productList');
  const productListLabel = document.querySelector('.productList'); 

  // Hide the text while waiting for the API response
  if (productListLabel) {
    productListLabel.style.display = "none";
  }

  // Show the loader while waiting for the API response
  productList.innerHTML = "<div class='loader'></div>";

  // Fetch the token and call the API
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
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error in the GET request: ${response.status}`);
      }
      return response.json();
    })
    // Gets the products data and filters the repeated products
    .then(json => {
      const products = Array.isArray(json) ? json : json.products;
      const uniqueProducts = products.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id && p.name === product.name)
      );

      // If no products are found, retry the request for a maximum of 2 attempts
      if (uniqueProducts.length === 0 && attempt < maxAttempts) {
        console.log(`Retrying petition... Attempt ${attempt + 1}`);
        return callApiWithImage(imageUrl, attempt + 1, maxAttempts);
      }

      // Clear the loader before showing the results
      productList.innerHTML = "";

      // Show the text in case of finding products
      if (productListLabel) {
        productListLabel.style.display = "block";
      }

      // If there are products, show them and save them un the productsList array
      if (uniqueProducts && uniqueProducts.length > 0) {
        uniqueProducts.forEach(product => {
          const isFavorite = favoritesList.some(fav => fav.id === product.id);
          productsList.push(product);
          const productElement = createProductElement(product, isFavorite);
          productList.appendChild(productElement);
        });
      } else {
        productList.innerHTML = "<p>No products found.</p>";
      }
    })
    // Catch errors
    .catch(error => {
      console.error("Error:", error);
      productList.innerHTML = `<p>Error: ${error.message}</p>`;
    });

  // Open the favorite products database
  openDatabase().then(() => {
      console.log('Database opened succesfuly.');
  }).catch(error => {
      console.error('Error opening the database:', error);
  });
}


// Use the token to call the API with text
export function callApiWithText(queryText, brand) {
    const productList = document.getElementById('productList');
    const productListLabel = document.querySelector('.productList');

    // Hide the text while waiting for the API response
    if (productListLabel) {
      productListLabel.style.display = "none";
    }

    // Show the loader while waiting for the API response
    productList.innerHTML = "<div class='loader'></div>";
  
    // Fetch the token and call the API
    getToken()
      .then(token => {
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
        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error in the GET request: ${response.status}`);
        }
        return response.json();
      })
      // Gets the products data and filters the repeated products
      .then(json => {
        const products = Array.isArray(json) ? json : json.products;
        const uniqueProducts = products.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id && p.name === product.name)
        );
  
        // Clear the loader before showing the results
        productList.innerHTML = "";

        // Show the text in case of finding products
        if (productListLabel) {
          productListLabel.style.display = "block";
        }
  
        // If there are products, show them and save them un the productsList array
        if (uniqueProducts && uniqueProducts.length > 0) {
          uniqueProducts.forEach(product => {
            const isFavorite = favoritesList.some(fav => fav.id === product.id);
            productsList.push(product);
            const productElement = createProductElement(product, isFavorite);
            productList.appendChild(productElement);
          });
        } else {
          productList.innerHTML = "<p>No products found.</p>";
        }
      })
      // Catch errors
      .catch(error => {
        console.error("Error:", error);
        productList.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  
    // Open the favorite products database
    openDatabase().then(() => {
        console.log('Database opened succesfuly.');
    }).catch(error => {
        console.error('Error opening the database:', error);
    });
  }
  