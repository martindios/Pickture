import { addToFavorites, removeFromFavorites, favorites, updateFavorites } from './favorites.js';
import { shareOnSocialMedia } from './social.js';
import { openDatabase } from './indexdb.js';
import { getQueryParam, callApiWithImage } from './api.js';

export let productsList = [];


// Función para crear un elemento de producto
export function createProductElement(product, isFavorite = false) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';

  const productImage = document.createElement('img');
  productImage.className = 'product-image';
  productImage.src = "./logos/logo_zara.png";

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

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const starIcon = document.createElement('img');
  starIcon.className = 'star-icon';
  starIcon.src = isFavorite ? './logos/doubleStar.png' : './logos/star.png';
  starIcon.style.cursor = 'pointer';
  starIcon.addEventListener('click', () => {
    if (isFavorite) {
      removeFromFavorites(product);
      starIcon.src = './logos/star.png';
    } else {
      addToFavorites(product);
      starIcon.src = './logos/doubleStar.png';
    }
  });
  buttonContainer.appendChild(starIcon);

  const buyIcon = document.createElement('img');
  buyIcon.className = 'buy-icon';
  buyIcon.src = './logos/cart.png';
  buyIcon.style.cursor = 'pointer';
  buyIcon.addEventListener('click', () => {
    window.open(product.link, '_blank');
  });
  buttonContainer.appendChild(buyIcon);

  productInfo.appendChild(buttonContainer);

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


  return productDiv;
}

// Función para mostrar la pantalla de Favoritos
function showFavoritesScreen() {
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  updateFavorites().then(() => {
    if (favorites.length > 0) {
      favorites.forEach(product => {
        const productElement = createProductElement(product, true);
        productList.appendChild(productElement);
      });
    } else {
      productList.innerHTML = "<h3>No se encontraron productos.</h3>";
    }
  }).catch(error => {
    console.error('Error al actualizar los favoritos:', error);
    productList.innerHTML = `<p>Error: ${error.message}</p>`;
  });
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
