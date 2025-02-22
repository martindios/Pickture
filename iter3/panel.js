// panel.js

// Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función para realizar la petición a la API usando la URL de la imagen
function callApiWithImage(imageUrl) {
  // Datos de autenticación y URL para obtener el token
  const username = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
  const password = "A3@X[K}2i7@I~@nF";
  const tokenUrl = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

  // Configuramos los parámetros para obtener el token
  const tokenData = new URLSearchParams();
  tokenData.append("grant_type", "client_credentials");
  tokenData.append("scope", "technology.catalog.read");

  // Petición POST para obtener el token
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
      // Suponemos que el token está en la propiedad 'id_token'
      const token = tokenResponse.id_token;
      
      // Construimos la URL GET usando la URL de la imagen recibida
      const getUrl = `https://api.inditex.com/pubvsearch/products?image=${encodeURIComponent(imageUrl)}&page=1&perPage=5`;
      
      // Realizamos la petición GET usando el token obtenido
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
      // Mostramos el resultado JSON en la consola
      console.log("Respuesta GET JSON:", json);
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
  
  // Llamamos a la función que realiza la petición a la API
  if (imgUrl) {
    callApiWithImage(imgUrl);
  }

  // Funcionalidad del botón de cierre
  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    // Enviar un mensaje a la página principal para cerrar el iframe
    window.parent.postMessage({ action: 'closePanel' }, '*');
  });

  // Funcionalidad del botón de comprar
  const buyButton = document.getElementById('buyButton');
  buyButton.addEventListener('click', () => {
    alert('¡Gracias por tu compra!');
  });
});

