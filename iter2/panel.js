function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  const imgUrl = getQueryParam('img');
  document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la URL de la imagen
    document.getElementById('imgUrl').textContent = imgUrl || 'No se encontró la URL de la imagen.';
    console.log('URL de imagen recibida:', imgUrl);
  
    // Añadir funcionalidad al botón de cierre
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
      // Enviar un mensaje a la página principal para cerrar el iframe
      window.parent.postMessage({ action: 'closePanel' }, '*');
    });
  });