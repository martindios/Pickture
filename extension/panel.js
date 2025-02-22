import { addToFavorites, removeFromFavorites, favorites, updateFavorites } from './favorites.js';
import { shareOnSocialMedia } from './social.js';
import { getQueryParam, callApiWithImage, callApiWithText } from './api.js';

export let productsList = [];
let currentScreen = 'web';


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

  // Sección de precio
  const productPrice = document.createElement('div');
  productPrice.className = 'product-price';
  if (product.price && product.price.value && product.price.value.current && product.price.value.original) {
    productPrice.innerHTML = `
      <span class="original-price">€${product.price.value.original}</span>
      <span class="current-price">€${product.price.value.current}</span>
    `;
  } else if (product.price && product.price.value && product.price.value.current) {
    productPrice.textContent = `€${product.price.value.current}`;
  } else {
    productPrice.textContent = "Precio no disponible";
  }
  
  productInfo.appendChild(productPrice);

  // Contenedor de botones
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const starIcon = document.createElement('img');
  starIcon.className = 'star-icon';
  starIcon.src = isFavorite 
    ? (document.body.classList.contains('dark-mode') ? './logos/doubleStarW.png' : './logos/doubleStar.png')
    : (document.body.classList.contains('dark-mode') ? './logos/starW.png' : './logos/star.png');
  starIcon.style.cursor = 'pointer';
  
  starIcon.addEventListener('click', () => {
    if (isFavorite) {
      removeFromFavorites(product);
      starIcon.src = document.body.classList.contains('dark-mode')
        ? './logos/starW.png'
        : './logos/star.png';
      rePrint();
    } else {
      addToFavorites(product);
      starIcon.src = document.body.classList.contains('dark-mode')
        ? './logos/doubleStarW.png'
        : './logos/doubleStar.png';
      rePrint();
    }
  });
  
  
  buttonContainer.appendChild(starIcon);

  const buyIcon = document.createElement('img');
  buyIcon.className = 'buy-icon';
  buyIcon.src = document.body.classList.contains('dark-mode') ? './logos/cartW.png' : './logos/cart.png';
  buyIcon.style.cursor = 'pointer';
  buyIcon.addEventListener('click', () => {
    window.open(product.link, '_blank');
  });
  buttonContainer.appendChild(buyIcon);
  
  productInfo.appendChild(buttonContainer);

  // Sección de compartir en redes sociales
  const socialSharing = document.createElement('div');
  socialSharing.className = 'social-sharing';

// Dentro de createProductElement, antes de crear los iconos:
const isDarkMode = document.body.classList.contains('dark-mode');
const facebookSrc = isDarkMode ? './logos/facebookW.png' : './logos/facebook.png';
const twitterSrc = isDarkMode ? './logos/twitterW.png' : './logos/twitter.png';
const whatsappSrc = isDarkMode ? './logos/whatsappW.png' : './logos/whatsapp.png';

// Icono de Facebook
const facebookIcon = document.createElement('a');
facebookIcon.className = 'social-icon facebook';
facebookIcon.innerHTML = `<img id="logoFacebook" src="${facebookSrc}" alt="Logo de Facebook">`;
facebookIcon.title = "Compartir en Facebook";
facebookIcon.addEventListener('click', (e) => {
  e.preventDefault();
  shareOnSocialMedia(product.url || "#", "facebook");
});
socialSharing.appendChild(facebookIcon);

// Icono de Twitter
const twitterIcon = document.createElement('a');
twitterIcon.className = 'social-icon twitter';
twitterIcon.innerHTML = `<img id="logoTwitter" src="${twitterSrc}" alt="Logo de Twitter">`;
twitterIcon.title = "Compartir en Twitter";
twitterIcon.addEventListener('click', (e) => {
  e.preventDefault();
  shareOnSocialMedia(product.url || "#", "twitter");
});
socialSharing.appendChild(twitterIcon);

// Icono de WhatsApp
const whatsappIcon = document.createElement('a');
whatsappIcon.className = 'social-icon whatsapp';
whatsappIcon.innerHTML = `<img id="logoWhas" src="${whatsappSrc}" alt="Logo de WhatsApp">`;
whatsappIcon.title = "Compartir en WhatsApp";
whatsappIcon.addEventListener('click', (e) => {
  e.preventDefault();
  shareOnSocialMedia(product.url || "#", "whatsapp");
});
socialSharing.appendChild(whatsappIcon);

  const instagramIcon = document.createElement('a');
  instagramIcon.className = 'social-icon whatsapp';
  instagramIcon.innerHTML = '<img id="logoWhas" src="./logos/whatsapp.png" alt="Logo de whatsapp">';
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

// Función para reprintear
function rePrint(){
  if (currentScreen === 'web') {
    showWebScreen();
  } else if (currentScreen === 'favorites') {
    showFavoritesScreen();
  }
}

// Función para mostrar la pantalla de Favoritos
function showFavoritesScreen() {
  currentScreen = 'favorites';
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
  currentScreen = 'web';
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  if (productsList.length > 0) {
    productsList.forEach(product => {
      const productElement = createProductElement(product, favorites.some(fav => fav.id === product.id));
      productList.appendChild(productElement);
    });
  } else {
    productList.innerHTML = "<p>No se encontraron productitos.</p>";
  }
}

// Función para mostrar la pantalla de Inditex con inputs de búsqueda
function showInditexScreen() {
  currentScreen = 'inditex';
  const productList = document.getElementById('productList');
  productList.innerHTML = ""; // Limpiar contenido previo

  // Crear un contenedor para los inputs
  const container = document.createElement('div');
  container.className = 'inditex-form-container';

  // Crear un contenedor para los inputs centrados
  const formContainer = document.createElement('div');
  formContainer.className = 'form-inputs';

  // Input para el término de búsqueda
  const queryLabel = document.createElement('label');
  queryLabel.textContent = 'Buscar:';
  queryLabel.htmlFor = 'queryInput';
  queryLabel.classList.add('large-label');

  const queryInput = document.createElement('input');
  queryInput.type = 'text';
  queryInput.id = 'queryInput';
  queryInput.placeholder = 'Ingrese término de búsqueda';

  // Input opcional para la marca
  const brandLabel = document.createElement('label');
  brandLabel.textContent = 'Marca (opcional):';
  brandLabel.htmlFor = 'brandInput';
  brandLabel.classList.add('large-label');

  const brandInput = document.createElement('input');
  brandInput.type = 'text';
  brandInput.id = 'brandInput';
  brandInput.placeholder = 'Ingrese la marca';

  // Botón para disparar la búsqueda
  const searchButton = document.createElement('button');
  searchButton.textContent = 'Buscar';
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const queryText = queryInput.value.trim();
    const brand = brandInput.value.trim();
    if (queryText) {
      callApiWithText(queryText, brand);
    } else {
      productList.innerHTML = "<p>Ingrese un término de búsqueda</p>";
    }
  });

  // Añadir los elementos al contenedor de inputs
  formContainer.appendChild(queryLabel);
  formContainer.appendChild(queryInput);
  formContainer.appendChild(brandLabel);
  formContainer.appendChild(brandInput);
  formContainer.appendChild(searchButton);

  container.appendChild(formContainer);
  productList.appendChild(container);
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

  // Function to remove active class from all links
  function removeActiveClass() {
    webLink.classList.remove('active-link');
    favoritesLink.classList.remove('active-link');
    inditexLink.classList.remove('active-link');
  }

  if (webLink) {
    webLink.addEventListener('click', (e) => {
      e.preventDefault();
      removeActiveClass();
      webLink.classList.add('active-link');
      showWebScreen();
    });
  }

  if (favoritesLink) {
    favoritesLink.addEventListener('click', (e) => {
      e.preventDefault();
      removeActiveClass();
      favoritesLink.classList.add('active-link');
      showFavoritesScreen();
    });
  }

  if (inditexLink) {
    inditexLink.addEventListener('click', (e) => {
      e.preventDefault();
      removeActiveClass();
      inditexLink.classList.add('active-link');
      showInditexScreen();
    });
  }


  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeImg = document.getElementById('darkModeImg');
  const logo = document.getElementById('logo');

  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      // Si se activa el modo oscuro, cambiamos el logo a lightMode para poder volver a cambiar
      darkModeImg.src = './logos/lightMode.png';
    } else {
      // Si se desactiva el modo oscuro, se muestra el logo de darkMode
      darkModeImg.src = './logos/darkMode.png';
    }

    if (document.body.classList.contains('dark-mode')) {
      darkModeImg.src = './logos/lightMode.png';
    } else {
      darkModeImg.src = './logos/darkMode.png';
    }

    if (document.body.classList.contains('dark-mode')) {
      darkModeImg.src = './logos/lightMode.png';
      logo.src = './logos/logo_no_text_white.png';
    } else {
      darkModeImg.src = './logos/darkMode.png';
      logo.src = './logos/logo_no_text_black.png';
    }

    // Re-renderiza la lista de productos para actualizar los iconos de favoritos
    rePrint();
  });
  

});
