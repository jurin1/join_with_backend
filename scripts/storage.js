const API_URL = "http://127.0.0.1:8000/api/";


/**
 * Saves an item to remote storage with the specified key and value.
 * This function uses the predefined STORAGE_TOKEN and STORAGE_URL constants for authentication and the storage endpoint.
 * @param {string} urlPath - The path to the api endpoint.
 * @param {string} body - The body as json string.
 * @param {boolean} logging - If true, logs the url and body to the console.
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
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
}



/**
 * Retrieves an item from remote storage using the specified key.
 * This function constructs a request URL using the predefined STORAGE_TOKEN and STORAGE_URL constants.
 * @param {string} urlPath - The path to the api endpoint.
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

/**
 * Deletes an item from the remote storage
 * @param {string} url - The url to the endpoint
 * @param {number} id - The id of the item to be deleted
 * @returns {boolean} Returns true if the item was deleted
 */
async function deleteItem(url, id) {
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

/**
 * Updates an item in the remote storage with the given data.
 * @param {string} url - The api endpoint
 * @param {number} id - The id of the item
 * @param {string} body - The body as a JSON string
 * @returns {*} Returns the updated item
 */
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

/**
 * Logs the user in
 * @param {string} body - the body as a JSON string
 */
async function login(body) {
  try {
    const response = await fetch(API_URL + 'login/', {
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

/**
 * Registers a new user account.
 * @param {string} body - The request body as a JSON string.
 */
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

/**
 * Checks if a token is stored in localStorage.
 * @returns {Promise<string|null>} Returns the token if it exists, otherwise null.
 */
async function checkToken() {
  token = localStorage.getItem("token");
  if (token) {
    return token;
  }
}

/**
 * Updates the user account
 * @param {string} url - the api endpoint
 * @param {string} body - the body as a JSON string
 * @returns {*} returns the updated data
 */
async function updateUserAccount(url, body) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}${url}/`, {
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