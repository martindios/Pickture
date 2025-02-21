// Datos del cliente OAuth2
const clientId = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
const clientSecret = "A3@X[K}2i7@I~@nF";

// Endpoint para obtener el token
const tokenUrl = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

// Construir los parámetros para la solicitud POST (application/x-www-form-urlencoded)
const params = new URLSearchParams();
params.append("grant_type", "client_credentials");
params.append("scope", "technology.catalog.read");

// Codificar clientId y clientSecret en Base64 para el header de Basic Auth
const basicAuth = btoa(`${clientId}:${clientSecret}`);

// Solicitud para obtener el token de acceso
fetch(tokenUrl, {
  method: "POST",
  headers: {
    "Authorization": `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: params.toString()
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al obtener el token: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const token = data.access_token;
    console.log("Token de acceso obtenido:", token);

    // URL de la API Visual Search con parámetros (imagen, página y resultados por página)
    const apiUrl = "https://api.inditex.com/pubvsearch/products?image=https://i.pinimg.com/736x/79/78/bf/7978bfde6f914ef792951d5e19e4cc0d.jpg&page=1&perPage=5";

    // Solicitud GET a la API de Visual Search utilizando el token en el header
    return fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error en la respuesta de la API: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Respuesta de la API Visual Search:", data);
    // Aquí puedes procesar el objeto JSON retornado por la API
  })
  .catch(error => {
    console.error("Error en el proceso:", error);
  });

