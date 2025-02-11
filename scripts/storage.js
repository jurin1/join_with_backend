
const STORAGE_TOKEN = 'Y2B64H33P1ZFHWE7S0HF0V8EC9OTCQZV1FG8B8B5';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const API_URL = "https://dj.neizcon.de/api/";


/**
 * Saves an item to remote storage with the specified key and value.
 * This function uses the predefined STORAGE_TOKEN and STORAGE_URL constants for authentication and the storage endpoint.
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored.
 */
async function setItem(urlPath, body, logging) {
  if (logging) {
    console.log("setItem", urlPath, body);
  }
    const url = `${API_URL}${urlPath}`;
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Für detailliertere Fehlermeldungen
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Contact created:", data);
    return data; // Gib den erstellten Kontakt zurück
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error; // Fehler erneut werfen
  }
}



/**
 * Retrieves an item from remote storage using the specified key.
 * This function constructs a request URL using the predefined STORAGE_TOKEN and STORAGE_URL constants.
 * @param {string} key - The key of the item to retrieve.
 */
async function getItem(urlPath) { 
    const token = localStorage.getItem("token");
    const url = `${API_URL}${urlPath}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
        return data; 
        
    } catch (error) {
      console.error("Error fetching contacts:", error);
      
    }
}


async function deleteItem(url,id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}${url}/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Contact deleted");
    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

async function updateItem(url, id, body) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}${url}/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Contact updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

async function login(body) {
      try {
        const response = await fetch(API_URL+'login/', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token); 
          localStorage.setItem("name", data.name); 
          localStorage.setItem("user_id", data.userID); 
          window.location.href = "/assets/templates/summary.html"; 
        } else {

          console.error("Login failed:", data);
          document.getElementById("invalidValue").innerHTML =
            data.error || "Login fehlgeschlagen."; 
        }
      } catch (error) {
        alert("Login fehlgeschlagen. Bitte versuchen Sie es erneut.");
        console.error("Login error:", error);
      }
}


async function register(body) {
  try {
    const response = await fetch(API_URL + "register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/assets/templates/login.html"; // Weiterleiten
    } else {
      console.error("Signup failed:", data);
      document.getElementById("invalidValue").innerHTML =
        data.error || "Signup fehlgeschlagen."; // Fehlermeldung anzeigen
    }
  } catch (error) {
    alert("Signup fehlgeschlagen. Bitte versuchen Sie es erneut.");
    console.error("Signup error:", error);
  }
}

async function checkToken() {
  token = localStorage.getItem("token");
  if (token) {
    return token;
  }
}