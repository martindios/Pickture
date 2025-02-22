/**
 * background.js
 * Maneja el menú contextual y la inyección del panel en la pestaña activa.
 */

// Creación del menú contextual
chrome.contextMenus.create({
    id: "Pickture", 
    title: "Encontrar prenda de ropa",
    contexts: ["image"] 
});

// Escuchar el clic en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "mostrarUrlImagen") {
        const imgUrl = info.srcUrl; // srcUrl para extraer la URL de la imagen

        // Ejecutar la función mostrarPanel pasándole la URL de la img por argumento
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: mostrarPanel,
            args: [imgUrl]
        });
    }
});

/**
 * Inyecta un iframe en la página actual para mostrar el panel.
 *
 * @param {string} imgUrl - La URL de la imagen seleccionada.
 */
function mostrarPanel(imgUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('panel.html') + `?img=${encodeURIComponent(imgUrl)}`;

    // Definir estilo CSS para el iframe
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.width = '25%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '100000';
    iframe.style.backgroundColor = 'white';

    document.body.appendChild(iframe);

    // Escuchar mensajes desde el iframe
    window.addEventListener('message', (event) => {
        if (event.data.action === 'closePanel') {
            iframe.remove();
        }
    });
}
