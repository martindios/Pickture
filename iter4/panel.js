// panel.js

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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
      const productList = document.getElementById('productList');
      productList.innerHTML = ""; // Limpiar la lista antes de agregar elementos

      if (products && products.length > 0) {
        products.forEach(product => {
          // Crear un div para cada producto
          const productDiv = document.createElement('div');
          productDiv.className = 'product';

          // Espacio para la foto (usamos una imagen de ejemplo si no hay URL)
          const productImage = document.createElement('img');
          productImage.className = 'product-image';
          obtenerImagenDeZara(product.link).then(url => {
            if(url){
              productImage.src = url;
            } else {
              productImage.src = "icon.png"; // Imagen de ejemplo si no hay URL
            }
          });
          // productImage.src = product.imageUrl || "https://via.placeholder.com/80"; // Imagen de ejemplo si no hay URL
          productImage.alt = product.name;
          productDiv.appendChild(productImage);

          // Información del producto (nombre y precio)
          const productInfo = document.createElement('div');
          productInfo.className = 'product-info';

          // Información del producto (nombre y precio)
          const productName = document.createElement('div');
          productName.className = 'product-name';
          productName.textContent = product.name || "Nombre no disponible";
          productInfo.appendChild(productName);

          const productPrice = document.createElement('div');
          productPrice.className = 'product-price';
          productPrice.textContent = product.price.value.current ? `€${product.price.value.current}` : "Precio no disponible";
          productInfo.appendChild(productPrice);

          productDiv.appendChild(productInfo);
          productList.appendChild(productDiv);

          // Botón para redirigir al enlace del producto
          const productLinkButton = document.createElement('button');
          productLinkButton.className = 'product-link-button';
          productLinkButton.textContent = 'Comprar producto';
          productLinkButton.addEventListener('click', () => {
          window.open(product.link, '_blank');
          });
          productDiv.appendChild(productLinkButton);
        });
      } else {
        productList.innerHTML = "<p>No se encontraron productos.</p>";
      }
    })
    .catch(error => {
      console.error("Error:", error);
      const productList = document.getElementById('productList');
      productList.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

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
      return imgElement.src; // Devolver la URL de la imagen
    } else {
      throw new Error('Imagen no encontrada');
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Obtener la URL de la imagen desde el parámetro "img" en la URL
  const imgUrl = getQueryParam('img');
  
  // Mostrar la URL en el cuadro correspondiente
  const urlBox = document.getElementById('urlBox');
  urlBox.textContent = imgUrl || 'No se encontró la URL de la imagen.';
  
  // Llamar a la función que realiza la petición a la API si se encontró una URL
  if (imgUrl) {
    callApiWithImage(imgUrl);
  }

  // Funcionalidad del botón de cierre
  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    window.parent.postMessage({ action: 'closePanel' }, '*');
  });

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

