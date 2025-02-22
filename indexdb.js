export let db;

// Creación o apertura de la base de datos
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('Favourites', 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            db.createObjectStore('myFavourites', { keyPath: 'id' });
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function(event) {
            reject('Error al abrir la base de datos: ' + event.target.error);
        };
    });
}

// Función para agregar datos
export function agregarDatos(data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavourites', 'readwrite');
        const objectStore = transaction.objectStore('myFavourites');

        // Asegúrate de que el objeto tenga una propiedad 'id'
        if (!data.id) {
            reject('El objeto debe tener una propiedad "id".');
            return;
        }

        const addRequest = objectStore.add(data);

        addRequest.onsuccess = function() {
            resolve('Datos agregados: ' + JSON.stringify(data));
        };

        addRequest.onerror = function(event) {
            reject('Error al agregar datos: ' + event.target.error);
        };
    });
}

// Función para obtener datos
export function obtenerDatos(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavourites', 'readonly');
        const objectStore = transaction.objectStore('myFavourites');

        const getRequest = objectStore.get(id);

        getRequest.onsuccess = function() {
            if (getRequest.result) {
                resolve(getRequest.result);
            } else {
                reject('No se encontraron datos para el ID: ' + id);
            }
        };

        getRequest.onerror = function(event) {
            reject('Error al recuperar datos: ' + event.target.error);
        };
    });
}

// Función para obtener todos los datos
export function obtenerTodosLosDatos() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavourites', 'readonly');
        const objectStore = transaction.objectStore('myFavourites');

        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function() {
            resolve(getAllRequest.result);
        };

        getAllRequest.onerror = function(event) {
            reject('Error al recuperar todos los datos: ' + event.target.error);
        };
    });
}


// Función para eliminar datos
export function eliminarDatos(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavourites', 'readwrite');
        const objectStore = transaction.objectStore('myFavourites');

        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = function() {
            resolve('Datos eliminados para el ID: ' + id);
        };

        deleteRequest.onerror = function(event) {
            reject('Error al eliminar datos: ' + event.target.error);
        };
    });
}

