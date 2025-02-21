// popup.js

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const imgUrl = getQueryParam('img');
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imgUrl').textContent = imgUrl || 'No se encontró la URL de la imagen.';
  console.log('URL de imagen recibida:', imgUrl);
});

