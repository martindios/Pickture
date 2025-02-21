// background.js

// Al instalar la extensión, crea el menú contextual
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "enviarImagen",
    title: "Enviar imagen a API",
    contexts: ["image"]  // Sólo aparece al hacer clic sobre imágenes
  });
});

// Escucha el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "enviarImagen") {
    // Se obtiene la URL de la imagen desde info.srcUrl
    const imageUrl = info.srcUrl;
    
    // Inyectamos y ejecutamos la función en la pestaña actual
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: enviarImagenAAPI,
      args: [imageUrl]
    });
  }
});

// Esta función se inyecta en la página y se encarga de llamar a la API
function enviarImagenAAPI(imageUrl) {
  // Aquí defines el endpoint de tu API
  const apiUrl = 'https://tu-api.com/endpoint';
  
  // En este ejemplo se envía la URL de la imagen en el cuerpo del POST
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageUrl })
  })
  .then(response => response.json())
  .then(data => {
    // Aquí puedes procesar el JSON que devuelve la API
    console.log("Respuesta de la API:", data);
    // Ejemplo: mostrar una alerta con la respuesta
    alert("Respuesta de la API: " + JSON.stringify(data));
  })
  .catch(error => {
    console.error('Error al llamar a la API:', error);
  });
}

