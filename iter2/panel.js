function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  const imgUrl = getQueryParam('img');
  document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la URL de la imagen en el cuadro de URL
    const urlBox = document.getElementById('urlBox');
    urlBox.textContent = imgUrl || 'No se encontró la URL de la imagen.';
  
    // Añadir funcionalidad al botón de cierre
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
      // Enviar un mensaje a la página principal para cerrar el iframe
      window.parent.postMessage({ action: 'closePanel' }, '*');
    });
  
    // Añadir funcionalidad al botón de comprar
    const buyButton = document.getElementById('buyButton');
    buyButton.addEventListener('click', () => {
      alert('¡Gracias por tu compra!');
    });
  });