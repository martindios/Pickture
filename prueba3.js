const username = "oauth-mkplace-oauthucjojyojqokwhavrwfpropro";
const password = "A3@X[K}2i7@I~@nF";
const url = "https://auth.inditex.com:443/openam/oauth2/itxid/itxidmp/access_token";

// Preparamos los datos a enviar en formato URL-encoded
const data = new URLSearchParams();
data.append("grant_type", "client_credentials");
data.append("scope", "technology.catalog.read");

fetch(url, {
  method: "POST",
  headers: {
    "Authorization": "Basic " + btoa(username + ":" + password),
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: data.toString()
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    console.log("Respuesta JSON:", json);
  })
  .catch(error => {
    console.error("Error:", error);
  });

