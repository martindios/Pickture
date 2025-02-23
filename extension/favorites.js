// Imports
import { addData, deleteData, obtainAllData } from './indexdb.js';


// Array with the actual favorites products
export let favoritesList = [];


// Add product to favorites
export function addToFavorites(product) {
  favoritesList.push(product);
  console.log("Product added to favorites:", product);
  
  // Updates the star icon on the product
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productNameElement = element.querySelector('.product-name');
    if (productNameElement && productNameElement.textContent === product.name) {
      const starIcon = element.querySelector('.star-icon');
      if (starIcon) {
        starIcon.src = './imgs/doubleStar.png';
      }
    }
  });

  // Adds the product to the favorites database
  try {
    addData(product);
    console.log('Product added to the database:', product);
  } catch (error) {
    console.error('Error adding the product into the database:', error);
  }
}


// Remove product from favorites
export function removeFromFavorites(product) {
  favoritesList = favoritesList.filter(fav => fav.id !== product.id);
  console.log("Product deleted from favorites:", product);

  // Looks for and deletes the product from DOM
  const productElements = document.querySelectorAll('.product');
  productElements.forEach(element => {
    const productNameElement = element.querySelector('.product-name');
    if (productNameElement && productNameElement.textContent === product.name) {
      element.remove();
    }
  });

  // Removes the product from the favorites database
  try {
    deleteData(product.id);
    console.log('Product deleted from the database:', product);
  }
  catch (error) {
    console.error('Error deleting the product from the database:', error);
  }
}


// Get all favorites products
export async function updateFavorites() {
 try {
    favoritesList = await obtainAllData();
    console.log('Favorites list updated:', favoritesList);
  }
  catch (error) {
    console.error('Error updating the favorites list:', error);
 }
 
}
