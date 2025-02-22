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
          const li = document.createElement('li');
          li.textContent = product.name; // Se muestra el campo "name"
          productList.appendChild(li);
        });
      } else {
        productList.innerHTML = "<li>No se encontraron productos.</li>";
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
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
  buyButton.addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
  });
});

