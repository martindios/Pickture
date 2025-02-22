// Crear el menú contextual
chrome.contextMenus.create({
  id: "Pickture",
  title: "Buscar prendas similares",
  contexts: ["image"]
});

// Escuchar el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "Pickture") {
    const imgUrl = info.srcUrl;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: mostrarPanel,
      args: [imgUrl]
    });
  }
});

// Función para mostrar el panel en la página
function mostrarPanel(imgUrl) {
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('panel.html') + `?img=${encodeURIComponent(imgUrl)}`;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.width = '30%';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = '100000';
  iframe.style.backgroundColor = 'white';
  document.body.appendChild(iframe);

  window.addEventListener('message', (event) => {
    if (event.data.action === 'closePanel') {
      iframe.remove();
    }
  });
}