// Lista de favoritos
let favorites = [];

// Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función para añadir un producto a favoritos
function addToFavorites(product) {
  favorites.push(product);
  console.log("Producto añadido a favoritos:", product);
  alert(`"${product.name}" añadido a favoritos.`);
}

// Función para mostrar los productos
function displayProducts(products) {
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  if (products && products.length > 0) {
    products.forEach(product => {
      // Crear un div para cada producto
      const productDiv = document.createElement('div');
      productDiv.className = 'product';

      // Espacio para la foto
      const productImage = document.createElement('img');
      productImage.className = 'product-image';
      productImage.src = product.imageUrl || "https://via.placeholder.com/80";
      productImage.alt = product.name;
      productDiv.appendChild(productImage);

      // Información del producto (nombre y precio)
      const productInfo = document.createElement('div');
      productInfo.className = 'product-info';

      const productName = document.createElement('div');
      productName.className = 'product-name';
      productName.textContent = product.name || "Nombre no disponible";
      productInfo.appendChild(productName);

      const productPrice = document.createElement('div');
      productPrice.className = 'product-price';
      productPrice.textContent = product.price ? `€${product.price}` : "Precio no disponible";
      productInfo.appendChild(productPrice);

      // Añadir una estrella para favoritos
      const starIcon = document.createElement('span');
      starIcon.className = 'star-icon';
      starIcon.innerHTML = '⭐'; // Emoji de estrella
      starIcon.style.cursor = 'pointer';
      starIcon.addEventListener('click', () => addToFavorites(product));
      productInfo.appendChild(starIcon);

      productDiv.appendChild(productInfo);
      productList.appendChild(productDiv);
    });
  } else {
    productList.innerHTML = "<p>No se encontraron productos.</p>";
  }
}

// Función para mostrar la pantalla de Web
function showWebScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = "<p>Contenido de la pantalla Web.</p>";
}

// Función para mostrar la pantalla de Favoritos
function showFavoritesScreen() {
  const productList = document.getElementById('productList');
  if (favorites.length > 0) {
    displayProducts(favorites); // Mostrar los productos favoritos
  } else {
    productList.innerHTML = "<p>No hay productos en favoritos.</p>";
  }
}

// Función para mostrar la pantalla de Inditex
function showInditexScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = "<p>Contenido de la pantalla Inditex.</p>";
}

// Función para realizar la petición a la API usando la URL de la imagen
function callApiWithImage(imageUrl) {
  const username = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
  const password = "A3@X[K}2i7@I~@nF";
  const tokenUrl = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

  const tokenData = new URLSearchParams();
  tokenData.append("grant_type", "client_credentials");
  tokenData.append("scope", "technology.catalog.read");

  fetch(tokenUrl, {
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
    .then(tokenResponse => {
      console.log("Respuesta del token:", tokenResponse);
      const token = tokenResponse.id_token;
      
      // Construimos la URL GET usando la URL de la imagen recibida
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
      console.log("Respuesta GET JSON:", json);

      // Supongamos que la respuesta es un array de productos o un objeto con una propiedad 'products'
      const products = Array.isArray(json) ? json : json.products;
      displayProducts(products);
    })
    .catch(error => {
      console.error("Error:", error);
      const productList = document.getElementById('productList');
      productList.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// Función principal que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Obtener la URL de la imagen desde el parámetro "img" en la URL
  const imgUrl = getQueryParam('img');
  
  // Mostrar la URL en el cuadro correspondiente
  const urlBox = document.getElementById('urlBox');
  if (urlBox) {
    urlBox.textContent = imgUrl || 'No se encontró la URL de la imagen.';
  }
  
  // Llamar a la función que realiza la petición a la API si se encontró una URL
  if (imgUrl) {
    callApiWithImage(imgUrl);
  }

  // Funcionalidad del botón de cierre
  const closeButton = document.getElementById('closeButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      window.parent.postMessage({ action: 'closePanel' }, '*');
    });
  }

  // Funcionalidad del botón de comprar
  const buyButton = document.getElementById('buyButton');
  if (buyButton) {
    buyButton.addEventListener('click', () => {
      alert('¡Gracias por tu compra!');
    });
  }

  // Asignar eventos a los enlaces del header
  const webLink = document.getElementById('webLink');
  const favoritesLink = document.getElementById('favoritesLink');
  const inditexLink = document.getElementById('inditexLink');

  if (webLink) {
    webLink.addEventListener('click', (e) => {
      e.preventDefault();
      showWebScreen();
    });
  }

  if (favoritesLink) {
    favoritesLink.addEventListener('click', (e) => {
      e.preventDefault();
      showFavoritesScreen();
    });
  }

  if (inditexLink) {
    inditexLink.addEventListener('click', (e) => {
      e.preventDefault();
      showInditexScreen();
    });
  }
});