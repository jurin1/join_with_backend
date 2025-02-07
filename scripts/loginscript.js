const API_BASE_URL = "http://localhost:8000/api/";
const LOGIN_URL = API_BASE_URL + "login/";
const REGISTER_URL = API_BASE_URL + "register/";


let userLogin = { user: [] };
let signupCounter = {
  nameCounter: 0,
  emailCounter: 0,
  passwordCounter: 0,
  confirmPasswordCounter: 0,
  checkboxCounter: 0,
};
let inputFieldName;
let inputFieldEmail;
let inputFieldPassword;
let inputFieldPasswordConfirm;
let IdCounterContact = 0;
sessionStorage.removeItem("checkEmailValue");
sessionStorage.removeItem("checkPasswordValue");

/**
 * Validates the user's login credentials against the stored user data.
 * @param {Event} event - The event object associated with the login attempt.
 */
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: email, password: password }),
        });

        const data = await response.json();
    

        if (response.ok) {

            localStorage.setItem("token", data.token); // Token speichern
            localStorage.setItem("user", email); // Email speichern
            localStorage.setItem("name", data.name); // Namen speichern
            localStorage.setItem("user_id", data.userID); // Namen speichern
            window.location.href = "/assets/templates/summary.html"; // Weiterleiten
        } else {
            // Fehler beim Login
            console.error("Login failed:", data);
            document.getElementById("invalidValue").innerHTML =
                data.error || "Login fehlgeschlagen."; // Fehlermeldung anzeigen
        }
    } catch (error) {
        alert("Login fehlgeschlagen. Bitte versuchen Sie es erneut.");
        console.error("Login error:", error);
    }
}

    /**
     * Asynchronously loads user data from storage and initializes the user login state.
     */
    async function loadUser() {
        let key = "users";
        let [boolean, storageData] = await checkStorageData(key);
        if (boolean == true) {
            userLogin = storageData;
        }
    }

    /**
     * Logs in a user as a guest, setting the appropriate values in local storage.
     */
    function guestLogin() {
        localStorage.setItem("user", "guest");
        localStorage.setItem("name", "Guest");
        localStorage.setItem("userID", 0);
    }

    /**
     * Handles the signup process, including validation and storage of new user data.
     * @param {Event} event - The event object associated with the signup attempt.
     */
    async function registerUser(event) {
        event.preventDefault();
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        const name = document.getElementById("nameInput").value;

        try {
            const response = await fetch(REGISTER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: name,
                    username: email,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registration successful:", data);
                window.location.href = "/assets/templates/login.html";
            } else {
                console.error("Registration failed:", data);
                // Fehleranzeige im Frontend (z.B. Fehlermeldungen für jedes Feld)
                if (data.email) {
                    document.getElementById("emailError").innerHTML = data.email[0];
                }
                if (data.password) {
                    document.getElementById("passwordError").innerHTML = data.password[0];
                }
                if (data.first_name) {
                    document.getElementById("nameError").innerHTML = data.first_name[0];
                }
            }
        } catch (error) {
            console.error("Registration error:", error);

        }
    }

    /**
     * Checks if the provided email exists in the user database.
     * @param {string} emailValue - The email address to check against the user database.
     */
    async function checkUserDatabase(emailValue) {
        if (userLogin && Array.isArray(userLogin.user)) {
            let emailExists = userLogin.user.findIndex(
                (user) => user.email === emailValue
            );
            return emailExists;
        } else {
            return -1;
        }
    }

    /**
     * Adds a new user to the user database and updates the local storage.
     * @param {string} name - The name of the new user.
     * @param {string} email - The email address of the new user.
     * @param {string} password - The password for the new user.
     */
    function setUser(name, email, password) {
        let newUser = { name: name, email: email, password: password };
        userLogin.user.push(newUser);
        setItem("users", userLogin);
        localStorage.setItem("name", name);
        localStorage.setItem("user", email);
        setTimeout(function () {
            window.location.href = "/assets/templates/login.html";
        }, 1000);
    }

    /**
     * Checks if the provided passwords match and returns a boolean value.
     * @param {string} password - The password input value.
     * @param {string} passwordConfirm - The password confirmation input value.
     */
    async function checkPasswordMatch(password, passwordConfirm) {
        if (password === passwordConfirm) {
            return true;
        }
    }

    /**
     * Validates the provided name against a regular expression and updates the UI based on the result.
     */
    function checkName() {
        let nameError = document.getElementById("nameError");
        let nameRegEx = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/;

        if (nameRegEx.test(inputFieldName.value)) {
            nameError.classList.remove("dontMatch");
            nameError.classList.add("d-none");
            updateSignupLogic("nameCounter", true);
        } else {
            nameError.classList.add("dontMatch");
            nameError.classList.remove("d-none");
            updateSignupLogic("nameCounter", false);
        }
    }

    /**
     * Validates the confirmation password against the original password and updates the UI accordingly.
     */
    function checkPasswordConfirm() {
        let passwordInputConfirmFrame = document.getElementById(
            "passwordInputConfirmFrame"
        );
        let pwdontmatch = document.getElementById("pwDontMatch");
        if (inputFieldPassword.value === inputFieldPasswordConfirm.value) {
            passwordInputConfirmFrame.style.border = "2px solid green";
            pwdontmatch.classList.remove("dontMatch");
            pwdontmatch.classList.add("d-none");
            sessionStorage.setItem("checkPasswordValue", true);
            updateSignupLogic("confirmPasswordCounter", true);
        } else {
            passwordInputConfirmFrame.style.border = "2px solid red";
            pwdontmatch.classList.remove("d-none");
            pwdontmatch.classList.add("dontMatch");
            sessionStorage.setItem("checkPasswordValue", false);
            updateSignupLogic("confirmPasswordCounter", false);
        }
    }

    /**
     * Checks the length of the provided password and updates the UI based on whether it meets the criteria.
     */
    function passwordLength() {
        let passwordError = document.getElementById("passwordLengthError");

        if (inputFieldPassword.value.length < 5) {
            passwordError.classList.add("dontMatch");
            passwordError.classList.remove("d-none");
            updateSignupLogic("passwordCounter", false);
        } else {
            passwordError.classList.add("d-none");
            passwordError.classList.remove("dontMatch");
            updateSignupLogic("passwordCounter", true);
        }
    }

    /**
     * Validates the provided email against a regular expression and updates the UI based on the result.
     */
    function checkEmail() {
        let emailError = document.getElementById("emailError");
        let emailInputFrame = document.getElementById("emailInputFrame");

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(inputFieldEmail.value)) {
            emailError.classList.add("d-none");
            emailError.classList.remove("dontMatch");
            emailInputFrame.style.border = "2px solid green";
            sessionStorage.setItem("checkEmailValue", true);
            enableLoginButton();
            updateSignupLogic("emailCounter", true);
        } else {
            emailError.classList.remove("d-none");
            emailError.classList.add("dontMatch");
            emailInputFrame.style.border = "2px solid red";
            sessionStorage.setItem("checkEmailValue", false);
            sessionStorage.removeItem("checkEmailValue");
            updateSignupLogic("emailCounter", false);
        }
    }

    /**
     * Checks the length of the password input field and updates session storage based on the result.
     */
    function checkPasswordInput() {
        if (inputFieldPassword.value.length >= 5) {
            sessionStorage.setItem("checkPasswordValue", true);
        } else {
            sessionStorage.removeItem("checkPasswordValue");
        }
        enableLoginButton();
    }

    /**
     * Enables or disables the login button based on validation results stored in session storage.
     */
    function enableLoginButton() {
        let passwordInput = sessionStorage.getItem("checkPasswordValue");
        let emailInput = sessionStorage.getItem("checkEmailValue");
        if (passwordInput === "true" && emailInput === "true") {
            activateButton();
        } else {
            deactivateButton();
        }
    }

    /**
     * Enables or disables the signup button based on the cumulative validation results.
     */
    function enableSignupButton() {
        let disbaleButton = document.getElementById("submitButton").classList;
        let count = Object.values(signupCounter).reduce(
            (sum, value) => sum + value,
            0
        );
        if (count === 5) {
            disbaleButton.remove("disableButton");
        } else {
            disbaleButton.add("disableButton");
        }
    }

    /**
     * Activates the login or submit button by removing the disabled class.
     */
    function activateButton() {
        document.getElementById("submitButton").classList.remove("disableButton");
    }

    /**
     * Deactivates the login or submit button by adding the disabled class.
     */
    function deactivateButton() {
        document.getElementById("submitButton").classList.add("disableButton");
    }

    /**
     * Updates the signup process logic by modifying counters based on validation results.
     * @param {string} key - The key corresponding to the specific input validation counter.
     * @param {boolean} boolean - The result of the validation check.
     */
    function updateSignupLogic(key, boolean) {
        if (boolean) {
            signupCounter[key] = 1;
        } else {
            signupCounter[key] = 0;
        }
        enableSignupButton();
    }

    /**
     * Updates the logo image based on the screen resolution.
     * @param {HTMLElement} logo - The logo element whose source will be updated.
     */
    function updateImageBasedOnResolution(logo) {
        let screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            logo.src = "/assets/img/joinlogo.png";
        } else {
            logo.src = "/assets/img/Capa2.png"; // Anpassen, falls die Dateierweiterung anders ist
        }
    }

    /**
     * Initiates an animation sequence for the logo, moving it to the center and fading it out.
     * @param {HTMLElement} logoImage - The logo image element to animate.
     * @param {HTMLElement} logo - The logo element whose source may be updated after animation.
     */
    function animateLogo(logoImage, logo) {
        moveToCenter(logoImage);
        fadeOutAndReset(logoImage, logo);
    }

    /**
     * Moves the logo image to the center of the viewport as part of an animation sequence.
     * @param {HTMLElement} logoImage - The logo image element to move.
     */
    function moveToCenter(logoImage) {
        let originalPosition = {
            top: logoImage.offsetTop,
            left: logoImage.offsetLeft,
        };

        // move logo in the middle
        logoImage.style.top = "50%";
        logoImage.style.left = "50%";
        logoImage.style.transform = "translate(-50%, -50%)";

        // calculate difference of the position
        let verticalDifference = originalPosition.top - logoImage.offsetTop;
        let horizontalDifference = originalPosition.left - logoImage.offsetLeft;

        // start fadeOut-Animation after 1 Sec.
        setTimeout(function () {
            logoImage.style.transition = "transform 1s ease-out";
            logoImage.style.transform = `translate(${horizontalDifference}px, ${verticalDifference}px)`;
            logoImage.classList.add("disappear");
        }, 1000);
    }

    /**
     * Fades out the logo image and resets its position and appearance after a brief delay.
     * @param {HTMLElement} logoImage - The logo image element to fade out.
     * @param {HTMLElement} logo - The logo element whose source is reset after the animation.
     */
    function fadeOutAndReset(logoImage, logo) {
        setTimeout(function () {
            logoImage.removeAttribute("style");
            logoImage.classList.remove("disappear");
            logoImage.classList.remove("centeredImage");
            logo.src = "/assets/img/join.png";
        }, 2000);
    }

    function updateImageBasedOnResolution(logo) {
        let screenWidth = window.innerWidth;

        if (screenWidth < 768) {
            logo.src = "/assets/img/joinlogo.png";
        } else {
            logo.src = "/assets/img/join.png";
        }
    }

    /**
     * Initializes the application by setting up initial states, event listeners, or performing initial animations.
     */
    document.addEventListener("DOMContentLoaded", function () {
        inputFieldName = document.getElementById("nameInput");
        inputFieldEmail = document.getElementById("emailInput");
        inputFieldPassword = document.getElementById("passwordInput");
        inputFieldPasswordConfirm = document.getElementById("passwordInputConfirm");
        let logoImage = document.querySelector(".centeredImage");
        let logo = document.getElementById("logo");

        if (logoImage && logo) {
            updateImageBasedOnResolution(logo);
            animateLogo(logoImage, logo);
        }
    });

    /**
     * Validates the current login state, potentially redirecting the user or changing the UI based on the login status.
     */
    function checkLoginTrue() {
        if (userLogin === true) {
            console.log(true);
        }
    }

