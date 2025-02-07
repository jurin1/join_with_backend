
const STORAGE_TOKEN = 'Y2B64H33P1ZFHWE7S0HF0V8EC9OTCQZV1FG8B8B5';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const API_URL = "http://localhost:8000/api/";

// /**
//  * Saves an item to remote storage with the specified key and value.
//  * This function uses the predefined STORAGE_TOKEN and STORAGE_URL constants for authentication and the storage endpoint.
//  * @param {string} key - The key under which the value is stored.
//  * @param {any} value - The value to be stored.
//  */
// async function setItem(key, value) {
//     const payload = { key, value, token: STORAGE_TOKEN }; 
//     return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
//     .then(res => res.json());
// }




/**
 * Saves an item to remote storage with the specified key and value.
 * This function uses the predefined STORAGE_TOKEN and STORAGE_URL constants for authentication and the storage endpoint.
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored.
 */
async function setItem(urlPath, body) {
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
// async function getItem(key) { 
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     let resp = await fetch(url);
//     let data = await resp.json(); 
//     return data;

// }


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
      console.log(url, data);
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
      method: "PUT",
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