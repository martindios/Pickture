// Crear el menú contextual
chrome.contextMenus.create({
  id: "mostrarUrlImagen",
  title: "Mostrar URL de Imagen",
  contexts: ["image"]
});

// Escuchar el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "mostrarUrlImagen") {
    const imgUrl = info.srcUrl;

    // Inyectar un script en la pestaña activa para mostrar el panel
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: mostrarPanel,
      args: [imgUrl]
    });
  }
});

// Función para mostrar el panel en la página
function mostrarPanel(imgUrl) {
  // Crear un iframe para el panel
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('panel.html') + `?img=${encodeURIComponent(imgUrl)}`;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.width = '20%';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = '100000';
  iframe.style.backgroundColor = 'white';

  // Añadir el iframe al cuerpo de la página
  document.body.appendChild(iframe);

  // Escuchar mensajes desde el iframe
  window.addEventListener('message', (event) => {
    if (event.data.action === 'closePanel') {
      // Eliminar el iframe
      iframe.remove();
    }
  });
}