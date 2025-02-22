// favorites.js
import { openDatabase, agregarDatos, eliminarDatos, obtenerTodosLosDatos } from './indexdb.js';

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
        starIcon.src = './logos/doubleStar.png';
      }
    }
  });

  // Agrega el producto a la base de datos
  try {
    agregarDatos(product);
    console.log('Producto añadido a la base de datos:', product);
  } catch (error) {
    console.error('Error al agregar producto a la base de datos:', error);
  }
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

  // Elimina el producto de la base de datos
  try {
    eliminarDatos(product.id);
    console.log('Producto eliminado de la base de datos:', product);
  }
  catch (error) {
    console.error('Error al eliminar producto de la base de datos:', error);
  }
}

export async function updateFavorites() {

 try {
    favorites = await obtenerTodosLosDatos();
    console.log('Favoritos actualizados:', favorites);
  }
  catch (error) {
    console.error('Error al actualizar favoritos:', error);
 }
 
}
