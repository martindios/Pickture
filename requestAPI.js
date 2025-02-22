// Datos de autenticación y URL del endpoint para obtener el token
const username = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
const password = "A3@X[K}2i7@I~@nF";
const tokenUrl = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

// Configuramos los parámetros de la petición POST
const tokenData = new URLSearchParams();
tokenData.append("grant_type", "client_credentials");
tokenData.append("scope", "technology.catalog.read");

// Realizamos la petición POST para obtener el token
fetch(tokenUrl, {
  method: "POST",
  headers: {
    "Authorization": "Basic " + btoa(username + ":" + password),
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: tokenData.toString()
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP al obtener el token: ${response.status}`);
    }
    return response.json();
  })
  .then(tokenResponse => {
    console.log("Respuesta del token:", tokenResponse);
    // Suponiendo que el token se encuentra en la propiedad 'token_id'
    const token = tokenResponse.id_token;
    
    // URL del endpoint GET con los parámetros requeridos
    const getUrl = "https://api.inditex.com/pubvsearch/products?image=https://i.pinimg.com/736x/79/78/bf/7978bfde6f914ef792951d5e19e4cc0d.jpg&page=1&perPage=5";
    
    // Realizamos la petición GET usando el token obtenido
    return fetch(getUrl, {
      method: "GET",
      headers: {
        // Se utiliza el token para la autorización; en muchos casos se usa el prefijo "Bearer "
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP en la petición GET: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    console.log("Respuesta GET JSON:", json);
  })
  .catch(error => {
    console.error("Error:", error);
  });

