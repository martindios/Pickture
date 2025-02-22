// favorites.js
export let favorites = [];

export function addToFavorites(product) {
  favorites.push(product);
  console.log("Producto añadido a favoritos:", product);
  
  // Actualiza el icono de la estrella en los elementos de producto
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productNameElement = element.querySelector('.product-name');
    if (productNameElement && productNameElement.textContent === product.name) {
      const starIcon = element.querySelector('.star-icon');
      if (starIcon) {
        starIcon.innerHTML = '🌟';
      }
    }
  });
}

export function removeFromFavorites(product) {
  // Elimina el producto del array de favoritos
  favorites = favorites.filter(fav => fav.id !== product.id);
  console.log("Producto eliminado de favoritos:", product);

  // Busca y elimina el elemento del DOM
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productNameElement = element.querySelector('.product-name');
    if (productNameElement && productNameElement.textContent === product.name) {
      element.remove();
    }
  });
}
