export let db;

// Create or open the database
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('Favorites', 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            db.createObjectStore('myFavorites', { keyPath: 'id' });
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function(event) {
            reject('Error opening the database: ' + event.target.error);
        };
    });
}


// Add data to the database
export function addData(data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavorites', 'readwrite');
        const objectStore = transaction.objectStore('myFavorites');

        // Checks that the object has an ID property
        if (!data.id) {
            reject('The object must have an "id" property.');
            return;
        }

        const addRequest = objectStore.add(data);

        addRequest.onsuccess = function() {
            resolve('Added data: ' + JSON.stringify(data));
        };

        addRequest.onerror = function(event) {
            reject('Error adding data: ' + event.target.error);
        };
    });
}


// Obtain data from the database with the parameter as id
export function obtainData(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavorites', 'readonly');
        const objectStore = transaction.objectStore('myFavorites');

        const getRequest = objectStore.get(id);

        getRequest.onsuccess = function() {
            if (getRequest.result) {
                resolve(getRequest.result);
            } else {
                reject('No data was found with the id: ' + id);
            }
        };

        getRequest.onerror = function(event) {
            reject('Error obtaining data: ' + event.target.error);
        };
    });
}


// Obtain all the data from the database
export function obtainAllData() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavorites', 'readonly');
        const objectStore = transaction.objectStore('myFavorites');

        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function() {
            resolve(getAllRequest.result);
        };

        getAllRequest.onerror = function(event) {
            reject('Error obtaining all the data: ' + event.target.error);
        };
    });
}


// Deleting data from the database with the parameter as id
export function deleteData(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('myFavorites', 'readwrite');
        const objectStore = transaction.objectStore('myFavorites');

        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = function() {
            resolve('Data deleted with id: ' + id);
        };

        deleteRequest.onerror = function(event) {
            reject('Error deleting data: ' + event.target.error);
        };
    });
}

