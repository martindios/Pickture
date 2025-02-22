import { addToFavorites, removeFromFavorites, favorites } from './favorites.js';
import { shareOnSocialMedia } from './social.js';

let productsList = [];

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function callApiWithImage(imageUrl, attempt = 1, maxAttempts = 2) {
  const productList = document.getElementById('productList');
  
  // Mostrar el spinner mientras se espera la respuesta de la API
  productList.innerHTML = "<div class='spinner'></div>";

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
    const token = tokenResponse.id_token;
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
}

// Función para crear un elemento de producto
function createProductElement(product, isFavorite = false) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';

  const productImage = document.createElement('img');
  productImage.className = 'product-image';
  obtenerImagenDeZara(product.link).then(url => {
    productImage.src = url || "logo_zara.png";
  });
  productImage.alt = product.name;
  productDiv.appendChild(productImage);

  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';

  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.textContent = product.name || "Nombre no disponible";
  productInfo.appendChild(productName);

  // Dentro de createProductElement, en la sección de precio:
  const productPrice = document.createElement('div');
  productPrice.className = 'product-price';

  if (product.price && product.price.value && product.price.value.current && product.price.value.original) {
    // Mostrar precio original tachado en rojo y el precio actual
    productPrice.innerHTML = `<span style="color: red; text-decoration: line-through;">€${product.price.value.original}</span> <span>€${product.price.value.current}</span>`;
  } else if (product.price && product.price.value && product.price.value.current) {
    productPrice.textContent = `€${product.price.value.current}`;
  } else {
    productPrice.textContent = "Precio no disponible";
  }

  productInfo.appendChild(productPrice);

  const starIcon = document.createElement('span');
  starIcon.className = 'star-icon';
  starIcon.innerHTML = isFavorite ? '🌟' : '⭐';
  starIcon.style.cursor = 'pointer';
  starIcon.addEventListener('click', () => {
    if (isFavorite) {
      removeFromFavorites(product);
      starIcon.innerHTML = '⭐';
    } else {
      addToFavorites(product);
      starIcon.innerHTML = '🌟';
    }
  });
  productInfo.appendChild(starIcon);

  const socialSharing = document.createElement('div');
  socialSharing.className = 'social-sharing';

  const facebookIcon = document.createElement('a');
  facebookIcon.className = 'social-icon facebook';
  facebookIcon.innerHTML = '<i class="fab fa-facebook-f"></i>';
  facebookIcon.title = "Compartir en Facebook";
  facebookIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "facebook");
  });
  socialSharing.appendChild(facebookIcon);

  const twitterIcon = document.createElement('a');
  twitterIcon.className = 'social-icon twitter';
  twitterIcon.innerHTML = '<i class="fab fa-twitter"></i>';
  twitterIcon.title = "Compartir en Twitter";
  twitterIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "twitter");
  });
  socialSharing.appendChild(twitterIcon);

  const instagramIcon = document.createElement('a');
  instagramIcon.className = 'social-icon instagram';
  instagramIcon.innerHTML = '<i class="fab fa-instagram"></i>';
  instagramIcon.title = "Compartir en Instagram";
  instagramIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "instagram");
  });
  socialSharing.appendChild(instagramIcon);

  productInfo.appendChild(socialSharing);
  productDiv.appendChild(productInfo);

  const productLinkButton = document.createElement('button');
  productLinkButton.className = 'product-link-button';
  productLinkButton.textContent = 'Comprar producto';
  productLinkButton.addEventListener('click', () => {
    window.open(product.link, '_blank');
  });
  productDiv.appendChild(productLinkButton);

  return productDiv;
}

// Función para mostrar la pantalla de Favoritos
function showFavoritesScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  if (favorites.length > 0) {
    favorites.forEach(product => {
      const productElement = createProductElement(product, true);
      productList.appendChild(productElement);
    });
  } else {
    productList.innerHTML = "<h3>No se encontraron productos.</h3>";
  }
}


// Función para mostrar la pantalla de Web
function showWebScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpieza de la lista antes de agregar elementos

  if (productsList.length > 0) {
    productsList.forEach(product => {
      const productElement = createProductElement(product, favorites.some(fav => fav.id === product.id));
      productList.appendChild(productElement);
    });
  } else {
    productList.innerHTML = "<p>No se encontraron productitos.</p>";
  }
}

// Función para mostrar la pantalla de Inditex
function showInditexScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = "<p>Contenido de la pantalla Inditex.</p>";
}





// Función para mostrar imágenes del producto (No funciona)
async function obtenerImagenDeZara(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('No se pudo obtener la página');
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const imgElement = doc.querySelector('picture.media-image img');
    if (imgElement) {
      return imgElement.src;
    } else {
      throw new Error('Imagen no encontrada');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const imgUrl = getQueryParam('img');
  
  if (imgUrl) {
    callApiWithImage(imgUrl);
  }

  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    window.parent.postMessage({ action: 'closePanel' }, '*');
  });

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
