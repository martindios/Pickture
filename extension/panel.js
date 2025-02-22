// Imports
import { addToFavorites, removeFromFavorites, favoritesList, updateFavorites } from './favorites.js';
import { shareOnSocialMedia } from './social.js';
import { getQueryParam, callApiWithImage, callApiWithText } from './api.js';


// Variables
export let productsList = [];
let currentScreen = 'web';


// Function to show a product
export function createProductElement(product, isFavorite = false) {

  // Product container
  const productDiv = document.createElement('div');
  productDiv.className = 'product';

  // Image container
  const productImage = document.createElement('img');
  productImage.className = 'product-image';
  productImage.src = "./logos/logo_zara.png"; // Change
  productImage.alt = product.name;
  productDiv.appendChild(productImage);

  // Product info container
  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';

  // Name container
  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.textContent = product.name || "Name not available";
  productInfo.appendChild(productName);

  // Price container
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
    productPrice.textContent = "Price not available";
  }
  productInfo.appendChild(productPrice);

  // Buttons container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  // Star icon
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

  // Buy icon
  const buyIcon = document.createElement('img');
  buyIcon.className = 'buy-icon';
  buyIcon.src = document.body.classList.contains('dark-mode') ? './logos/cartW.png' : './logos/cart.png';
  buyIcon.style.cursor = 'pointer';
  buyIcon.addEventListener('click', () => {
    window.open(product.link, '_blank');
  });
  buttonContainer.appendChild(buyIcon);
  
  productInfo.appendChild(buttonContainer);

  // Social Media container
  const socialSharing = document.createElement('div');
  socialSharing.className = 'social-sharing';

  // Check if dark mode is active and change the icons
  const isDarkMode = document.body.classList.contains('dark-mode');
  const facebookSrc = isDarkMode ? './logos/facebookW.png' : './logos/facebook.png';
  const twitterSrc = isDarkMode ? './logos/twitterW.png' : './logos/twitter.png';
  const whatsappSrc = isDarkMode ? './logos/whatsappW.png' : './logos/whatsappB.png';

  // Facebook icon
  const facebookIcon = document.createElement('a');
  facebookIcon.className = 'social-icon facebook';
  facebookIcon.innerHTML = `<img id="logoFacebook" src="${facebookSrc}" alt="Facebook logo">`;
  facebookIcon.title = "Share on Facebook";
  facebookIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "facebook");
  });
  socialSharing.appendChild(facebookIcon);

  // Twitter icon
  const twitterIcon = document.createElement('a');
  twitterIcon.className = 'social-icon twitter';
  twitterIcon.innerHTML = `<img id="logoTwitter" src="${twitterSrc}" alt="Twitter logo">`;
  twitterIcon.title = "Share on Twitter";
  twitterIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "twitter");
  });
  socialSharing.appendChild(twitterIcon);

  // WhatsApp icon
  const whatsappIcon = document.createElement('a');
  whatsappIcon.className = 'social-icon whatsapp';
  whatsappIcon.innerHTML = `<img id="logoWhas" src="${whatsappSrc}" alt="WhatsApp logo">`;
  whatsappIcon.title = "Share on WhatsApp";
  whatsappIcon.addEventListener('click', (e) => {
    e.preventDefault();
    shareOnSocialMedia(product.url || "#", "whatsapp");
  });
  socialSharing.appendChild(whatsappIcon);

  productInfo.appendChild(socialSharing);
  productDiv.appendChild(productInfo);

  return productDiv;
}


// Function to reprint lists
function rePrint(){
  if (currentScreen === 'web') {
    showImageScreen();
  } else if (currentScreen === 'favorites') {
    showFavoritesScreen();
  }
}


// Show the favorites screen
function showFavoritesScreen() {
  currentScreen = 'favorites';
  const productList = document.getElementById('productList');
  // Clear the list before adding elements
  productList.innerHTML = "";

  // Update the favorites list and show the products
  updateFavorites().then(() => {
    if (favoritesList.length > 0) {
      favoritesList.forEach(product => {
        const productElement = createProductElement(product, true);
        productList.appendChild(productElement);
      });
    } else {
      productList.innerHTML = "<p>No products found.</p>";
    }
  }).catch(error => {
    console.error('Error updating the favorites list:', error);
    productList.innerHTML = `<p>Error: ${error.message}</p>`;
  });
}


// Show the image screen
function showImageScreen() {
  currentScreen = 'web';
  const productList = document.getElementById('productList');
  // Clear the list before adding elements
  productList.innerHTML = ""; 

  // Show the products checking if they are on the favorites list
  if (productsList.length > 0) {
    productsList.forEach(product => {
      const productElement = createProductElement(product, favoritesList.some(fav => fav.id === product.id));
      productList.appendChild(productElement);
    });
  } else {
    productList.innerHTML = "<p>No products found.</p>";
  }
}


// Show the text screen
function showTextScreen() {
  currentScreen = 'text';
  const productList = document.getElementById('productList');
  // Clear the list before adding elements
  productList.innerHTML = "";

  // Input container
  const container = document.createElement('div');
  container.className = 'inditex-form-container';

  // Form container
  const formContainer = document.createElement('div');
  formContainer.className = 'form-inputs';

  // Text input
  const queryLabel = document.createElement('label');
  queryLabel.textContent = 'Search:';
  queryLabel.htmlFor = 'queryInput';
  queryLabel.classList.add('large-label');

  const queryInput = document.createElement('input');
  queryInput.type = 'text';
  queryInput.id = 'queryInput';
  queryInput.placeholder = 'Enter search';

  // Optional brand input
  const brandLabel = document.createElement('label');
  brandLabel.textContent = 'Brand (optional):';
  brandLabel.htmlFor = 'brandInput';
  brandLabel.classList.add('large-label');

  const brandInput = document.createElement('input');
  brandInput.type = 'text';
  brandInput.id = 'brandInput';
  brandInput.placeholder = 'Enter the brand';

  // Enter button
  const searchButton = document.createElement('button');
  searchButton.textContent = 'Search';
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const queryText = queryInput.value.trim();
    const brand = brandInput.value.trim();
    if (queryText) {
      callApiWithText(queryText, brand);
    } else {
      productList.innerHTML = "<p>Enter search</p>";
    }
  });

  // Add the elements to the containers
  formContainer.appendChild(queryLabel);
  formContainer.appendChild(queryInput);
  formContainer.appendChild(brandLabel);
  formContainer.appendChild(brandInput);
  formContainer.appendChild(searchButton);

  container.appendChild(formContainer);
  productList.appendChild(container);
}


// Listens to events
document.addEventListener('DOMContentLoaded', () => {
  const imgUrl = getQueryParam('img');
  
  // Calls the API with the param
  if (imgUrl) {
    callApiWithImage(imgUrl);
  }

  // Waits for the closeButton to be clicked
  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    window.parent.postMessage({ action: 'closePanel' }, '*');
  });

  // Obtains the links
  const imageLink = document.getElementById('imageLink');
  const favoritesLink = document.getElementById('favoritesLink');
  const textLink = document.getElementById('textLink');

  // Function to remove active class from all links
  function removeActiveClass() {
    imageLink.classList.remove('active-link');
    favoritesLink.classList.remove('active-link');
    textLink.classList.remove('active-link');
  }

  // Asigns the active link
  if (imageLink) {
    imageLink.addEventListener('click', (e) => {
      e.preventDefault();
      removeActiveClass();
      imageLink.classList.add('active-link');
      showImageScreen();
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

  if (textLink) {
    textLink.addEventListener('click', (e) => {
      e.preventDefault();
      removeActiveClass();
      textLink.classList.add('active-link');
      showTextScreen();
    });
  }

  // Dark mode constants
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeImg = document.getElementById('darkModeImg');
  const logo = document.getElementById('logo');

  // Waits for the day/night mode to change
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

    // Renders the products list to update the view
    rePrint();
  });
});
