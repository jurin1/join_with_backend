const CONTACTS_URL = "contacts/";
let contentHeight;
let letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let contacts = [];
let contactIdCounter = 0;
let screenSize = [];
let newContactIdCounter = [0];
let password;

/**
 * Adds a new contact by displaying the contact addition overlay and making the background opaque.
 */
async function addNewContact() {
  document
    .getElementById("addnewcontact")
    .classList.add("showOverlay-addNewContactPopUpContainer");
  document
    .getElementById("backGroundOpacityContainer")
    .classList.remove("d-none");

  scrollToContactView();
}

/**
 * Closes the "Add New Contact" overlay and clears input fields for name, email, and telephone number.
 */
function closeAddNewContact() {
  document
    .getElementById("addnewcontact")
    .classList.remove("showOverlay-addNewContactPopUpContainer");
  document.getElementById("backGroundOpacityContainer").classList.add("d-none");
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("tel").value = "";
}

/**
 * Creates a new contact object, initializes user contacts if necessary, and then saves the new contact.
 */
function createContact() {
  createContactObject();

  // contacts[userID].push(contact);
  closeAddContactPopup();
  showSuccessOverlay();
  resetInputFields();
  // saveAndShowContacts(contact.id);
}

/**
 * Closes the "Add Contact" popup.
 */
function closeAddContactPopup() {
  document
    .getElementById("addnewcontact")
    .classList.remove("showOverlay-addNewContactPopUpContainer");
  document.getElementById("backGroundOpacityContainer").classList.add("d-none");
}

/**
 * Displays a success overlay for a brief period to indicate successful contact creation.
 */
function showSuccessOverlay() {
  let popUpSuccessfullyCreated = document.getElementById(
    "popUpSuccesfullyCreated"
  );
  popUpSuccessfullyCreated.classList.add(
    "overlay-successfullyCreated",
    "showoverlay-successfullyCreated"
  );
  setTimeout(() => {
    popUpSuccessfullyCreated.classList.remove(
      "showoverlay-successfullyCreated"
    );
  }, 2000);
}

/**
 * Creates and returns a new contact object with unique properties such as name, email, and a randomly generated color.
 * @returns {Object} The newly created contact object.
 */
async function createContactObject() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let tel = document.getElementById("tel").value;
  let letter = name.charAt(0).toUpperCase();
  let lastNameLetter = getLastLetter(name);
  let initials = letter + lastNameLetter;
  let bgColor = generateRandomColor();
  let userID = localStorage.getItem("user_id");

  let body = JSON.stringify({
    userID: userID,
    name: name,
    phone: tel,
    email: email,
    initials: initials,
    bg_color: bgColor,
  });

  try {
    await setItem(CONTACTS_URL, body);
    await initContacts();
  } catch (error) {
    alert("Error creating contact. Please check the console for details.");
  }
}

/**
 * Resets the input fields for adding a new contact to empty strings.
 */
function resetInputFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("tel").value = "";
}

/**
 * Saves the newly created contact and displays it along with other existing contacts.
 * @param {number} contactId - The ID of the newly created contact.
 */
async function saveAndShowContacts(contactId) {
  await setItem("contacts", contacts);
  await showContacts();
  showContact(contactId);
}

/**
 * Initializes contacts by rendering them and loading existing contacts from web storage.
 */
async function initContacts() {
  await load_contacts_from_webstorage();
  render();
  await showContacts();
  screenSizeUser();
  await updateContacts();
  // setContentContactHeight();
  startEditUserAccount();
}

/**
 * Displays contacts sorted by the initial letter of each contact's name.
 */

async function showContacts() {
  let letterBox = document.getElementById("letterBox");
  letterBox.innerHTML = "";

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    let filteredContacts = contacts.filter(
      (contact) => contact["name"].charAt(0).toUpperCase() == letter
    );
    filteredContact(filteredContacts, letter);
  }
}

/**
 * Filters and displays contacts that start with a specific letter.
 * @param {Array} filteredContacts - The contacts filtered by a specific starting letter.
 * @param {string} letter - The letter used for filtering.
 */
function filteredContact(filteredContacts, letter) {
  if (filteredContacts.length > 0) {
    document.getElementById("letterBox").innerHTML += /*html*/ `
      <div id="firstLetterContainer" class="firstLetterContainer">${letter}</div>
      <div class="line"></div>`;
    for (let j = 0; j < filteredContacts.length; j++) {
      const filteredContact = filteredContacts[j];
      const lastNameLetter = filteredContact["name"]
        .split(" ")
        .pop()
        .charAt(0)
        .toUpperCase();
      const bgColor = filteredContact.bg_color;
      letterBox.innerHTML += showContactsHTML(
        filteredContact,
        bgColor,
        letter,
        lastNameLetter
      );
    }
  }
}

/**
 * Generates and returns a random RGB color value.
 */
function generateRandomColor() {
  let minBrightValue = 70;
  let range = 206;
  let x = Math.floor(Math.random() * range) + minBrightValue;
  let y = Math.floor(Math.random() * range);
  let z = Math.floor(Math.random() * range);
  return `rgb(${x},${y},${z})`;
}

/**
 * Gets the last letter of a name, intended for sorting or categorization purposes.
 * @param {string} name - The name from which to extract the last letter.
 */
function getLastLetter(name) {
  return name.split(" ").pop().charAt(0).toUpperCase();
}

/**
 * Displays details of a specific contact and highlights the selected contact in the list.
 * @param {number} id - The ID of the contact to display.
 */
async function showContact(id) {
  deselectAllContainers();
  selectClickedContainer(id);
  toggleMobileContactView();
  displayContactDetails();
  updateContactView(id);
  await scrollToContactView();
  showOverlay();
}

/**
 * Deselects all contact containers, removing any highlights or selections.
 */
function deselectAllContainers() {
  let allContainers = document.querySelectorAll(".iconNameEmailContainer");
  allContainers.forEach((container) => {
    container.classList.remove("selected");
  });
}

/**
 * Scrolls to the contact view.
 */
function scrollToContactView() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * Highlights the container of a clicked contact to indicate selection.
 * @param {number} id - The ID of the selected contact.
 */
function selectClickedContainer(id) {
  let clickedContainer = document.getElementById(
    "iconNameEmailContainer_" + id
  );
  clickedContainer.classList.add("selected");
}

/**
 * Toggles the contact view for mobile devices, adapting the UI for smaller screens.
 */
function toggleMobileContactView() {
  let mobile = isMobile();
  if (mobile) {
    changeContactView();
  }
}

/**
 * Displays the contact details in a dedicated container.
 */
function displayContactDetails() {
  let contactDetails = document.getElementById("contactContainer");
  contactDetails.classList.remove("d-none");
  contactDetails.classList.add("backgroundColorContact");
}

/**
 * Updates the contact view with the details of a specific contact.
 * @param {number} id - The ID of the contact to display.
 */
function updateContactView(id) {
  const index = contacts.findIndex((contact) => contact.id === id);

  const contact = contacts[index];
  let letter = contact["name"].charAt(0).toUpperCase();
  let lastNameLetter = getLastLetter(contact["name"]);

  document.getElementById("showContact").innerHTML = showContactHTML(
    contact,
    letter,
    lastNameLetter
  );
  showEditDeleteMobile(id);
}

/**
 * Displays the edit and delete options for mobile view.
 * @param {number} id - The ID of the contact for which to show options.
 */
function showEditDeleteMobile(id) {
  let editDeleteMobile = document.getElementById("editDeleteContainerMobile");
  editDeleteMobile.innerHTML = editDeleteMobileHTML(id);
}

/**
 * Displays an overlay with additional information or options.
 */
function showOverlay() {
  setTimeout(() => {
    document
      .getElementById("contactContainerContact")
      .classList.add("showOverlay-contactContainerContact");
  }, 225);
}

/**
 * Deletes a contact and updates the display to reflect this change.
 * @param {number} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
  const success = await deleteItem("contacts", id);

  if (success) {
    showContacts();
    document.getElementById("contactContainerContact").innerHTML = "";
    hideEditContactMobile();
    disableContactContainer();
    setTimeout(() => {
      popupDeleteContact();
    }, 2000);
  } else {
    console.error("Fehler beim Löschen des Kontakts.");
  }
}

/**
 * Displays a confirmation question before deleting a contact.
 * @param {number} id - The ID of the contact to be deleted.
 * @param {string} name - The name of the contact to be deleted.
 */
function deleteContactQuestion(id, name) {
  let element = document.getElementById("deleteContactSure");
  element.innerHTML = "";
  element.innerHTML += showDeleteQuestion(name, id);
  element.classList.remove("d-none");
}

/**
 * Deletes a contact if confirmed or hides the confirmation prompt.
 * @param {boolean} bool - True to delete the contact, false to cancel.
 * @param {number} id - The ID of the contact to delete.
 */
function deleteContactSure(bool, id) {
  let element = document.getElementById("deleteContactSure").classList;
  if (bool) {
    deleteContact(id);
  }
  element.add("d-none");
}

/**
 * Displays a popup indicating that a contact has been successfully deleted.
 */
function popupDeleteContact() {
  document
    .getElementById("popUpSuccesfullyDeleted")
    .classList.add(
      "overlay-successfullyDeleted",
      "showoverlay-successfullyDeleted"
    );
  setTimeout(() => {
    document
      .getElementById("popUpSuccesfullyDeleted")
      .classList.remove("showoverlay-successfullyDeleted");
  }, 2000);
}

/**
 * Opens the edit contact modal, prefilling it with the contact's current information.
 * @param {number} id - The ID of the contact to edit.
 */
function editContact(id) {
  let addNewContactPopUp = document.getElementById("addNewContactPopUp");
  const selectedContact = contacts.find((contact) => contact.id === id);
  addNewContactPopUp.innerHTML = editContactHTML(id, selectedContact.name);

  if (selectedContact) {
    getEditContact(selectedContact);
  }
}

/**
 * Fills the edit contact form with the selected contact's details for editing.
 * @param {Object} selectedContact - The contact being edited.
 * @param {number} id - The ID of the contact being edited.
 */
function getEditContact(selectedContact, id) {
  document
    .getElementById("editcontact")
    .classList.add("showOverlay-addNewContactPopUpContainer");
  document
    .getElementById("editbackGroundOpacityContainer")
    .classList.remove("d-none");
  document.getElementById("editname").value = selectedContact.name;
  document.getElementById("editemail").value = selectedContact.email;
  document.getElementById("edittel").value = selectedContact.phone;
  document.getElementById("editname").dataset.contactId = id;
  const initials = selectedContact.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  const bgColor = selectedContact.bg_color;
  setProfileContact(initials, bgColor);
  document
    .getElementById("deleteContactButton")
    .addEventListener("click", function () {
      deleteContact(id);
    });
}

/**
 * Sets the profile image or icon for the contact being edited based on initials and background color.
 * @param {string} initials - The initials of the contact.
 * @param {string} bgColor - The background color for the contact icon.
 */
function setProfileContact(initials, bgColor) {
  const profileContactDiv = document.getElementById("profileContact");
  profileContactDiv.style.backgroundColor = bgColor;
  profileContactDiv.textContent = initials;
}

/**
 * Deletes the contact being edited and closes the edit contact modal.
 * @param {number} id - The ID of the contact to delete.
 */
function deleteEditContact(id) {
  document.getElementById("editname").value = "";
  document.getElementById("editemail").value = "";
  document.getElementById("edittel").value = "";
  closeEditContact();
  deleteContact(id);
}

/**
 * Closes the edit contact modal and clears the form fields.
 */
function closeEditContact() {
  document
    .getElementById("editcontact")
    .classList.remove("showOverlay-addNewContactPopUpContainer");
  document
    .getElementById("editbackGroundOpacityContainer")
    .classList.add("d-none");
  document.getElementById("editname").value = "";
  document.getElementById("editemail").value = "";
  document.getElementById("edittel").value = "";
}

/**
 * Saves the changes made to a contact in the edit form and updates the display.
 * @param {number} id - The ID of the contact being edited.
 */
async function saveEditContact(id) {
  let body = JSON.stringify({
    name: document.getElementById("editname").value,
    email: document.getElementById("editemail").value,
    phone: document.getElementById("edittel").value,
  });

  await updateItem("contacts", id, body);
  await initContacts();
  // showContact(editedContact.id);
  closeEditContact();
}

/**
 * Determines if the current view is on a mobile device based on the screen width.
 */
function isMobile() {
  return window.innerWidth <= 800;
}

/**
 * Disables the contact container, usually in preparation for another view or operation.
 */
function disableContactContainer() {
  let contactDetails = document.getElementById("addcontactContainer");
  let contactContainerView = document.getElementById("contactContainer");
  contactDetails.classList.add("d-none");
  contactDetails.classList.remove("d-none");
  contactContainerView.style.removeProperty("display");
  contactContainerView.style.removeProperty("width");
  document.getElementById("editContactMobile").classList.add("d-none");
  hideEditContactMobile();
  setContentContactHeight(contentHeight);
}

/**
 * Adjusts the UI based on the screen size of the user's device, particularly for mobile views.
 */
function screenSizeUser() {
  screenSize.push(window.screen.width);
  screenSize.push(window.screen.height);
}

/**
 * Changes the view to display contact details prominently, adapting for mobile users.
 */
function changeContactView() {
  let contactContainerList = document.getElementById("addcontactContainer");
  let contactContainerView = document.getElementById("contactContainer");
  contactContainerList.classList.add("d-none");
  contactContainerView.style.display = "block";
  contactContainerView.style.width = "100vw";
  // document.getElementById("editContactMobile").classList.remove("d-none");
  // setContentContactHeight(window.innerHeight);
}

/**
 * Shows the edit and delete options specifically for mobile users.
 */
function showEditContactMobile() {
  document
    .getElementById("editDeleteContainerMobile")
    .classList.remove("d-none");
  document.getElementById("editDeleteContainerMobile").classList.add("d-none");
}

/**
 * Hides the edit and delete options for mobile users, typically when not needed.
 */
function hideEditContactMobile() {
  document
    .getElementById("editDeleteContainerMobile")
    .classList.remove("showOverlay-editDeleteContainerMobile");
  document
    .getElementById("editDeleteContainerMobile")
    .classList.add("overlay-editDeleteContainerMobile");
}

/**
 * Loads existing contacts from web storage into the application.
 */
async function load_contacts_from_webstorage() {
  contacts = await getItem(CONTACTS_URL);
}

/**
 * Updates the internal tracking of contacts to ensure new contacts receive a unique ID.
 */
function updateContacts() {
  if (contacts[userID] === undefined) {
  } else {
    for (let i = 0; i < contacts[userID].length; i++) {
      let idOfContact = contacts[userID][i]["id"];
      newContactIdCounter.push(Number(idOfContact));
    }
    let groessteZahl = Math.max(...newContactIdCounter);
    contactIdCounter = groessteZahl + 1;
  }
}

/**
 * Validates the input in an input field and changes the frame color based on validity.
 * @param {string} id - The ID of the input field to validate.
 */
function inputFrame(id) {
  let inputField = document.getElementById(id);
  let required = document.getElementById(id + "Class");

  if (inputField.value) {
    inputField.style.border = "1px solid #29abe2";
    required.classList.add("d-none");
  } else {
    inputField.style.border = "1px solid red";
    required.classList.remove("d-none");
  }
}

/**
 * Checks the new contact form for valid inputs before attempting to create a new contact.
 * @param {Event} event - The event object from the form submission.
 */
function checkNewContact(event) {
  event.preventDefault();
  let newName = document.getElementById("name").value;
  let newEmail = document.getElementById("email").value;
  let newPhone = document.getElementById("tel").value;

  let isNameValid = true;
  let isEmailValid = true;
  let isPhoneValid = true;
  ifCheckContact(
    isNameValid,
    isEmailValid,
    isPhoneValid,
    newName,
    newEmail,
    newPhone
  );
}

/**
 * Validates the inputs for a new contact and creates the contact if all validations pass.
 * @param {boolean} isNameValid - Indicates if the name input is valid.
 * @param {boolean} isEmailValid - Indicates if the email input is valid.
 * @param {boolean} isPhoneValid - Indicates if the phone input is valid.
 * @param {string} newName - The entered name for the new contact.
 * @param {string} newEmail - The entered email for the new contact.
 * @param {string} newPhone - The entered phone number for the new contact.
 */
function ifCheckContact(
  isNameValid,
  isEmailValid,
  isPhoneValid,
  newName,
  newEmail,
  newPhone
) {
  if (newName === "") {
    document.getElementById(
      "requiredMessageName"
    ).innerHTML = `<span class="requiredMessage">This field is required*</span>`;
    isNameValid = false;
  } else {
    document.getElementById("requiredMessageName").innerHTML = "";
  }
  if (newEmail === "") {
    document.getElementById(
      "requiredMessageMail"
    ).innerHTML = `<span class="requiredMessage">This field is required*</span>`;
    isEmailValid = false;
  } else {
    document.getElementById("requiredMessageMail").innerHTML = "";
  }
  if (newPhone === "") {
    document.getElementById(
      "requiredMessageTel"
    ).innerHTML = `<span class="requiredMessage">This field is required*</span>`;
    isPhoneValid = false;
  } else {
    document.getElementById("requiredMessageTel").innerHTML = "";
  }
  if (isNameValid && isEmailValid && isPhoneValid) {
    createContact();
  }
}

// function setContentContactHeight(height) {
//   const element = document.querySelector(".contentContact");

//   if (isMobile() & !height) {
//     const inhaltHoehe = element.offsetHeight + 150;
//     element.style.height = inhaltHoehe + "px";
//     contentHeight = inhaltHoehe;
//     console.log(inhaltHoehe);
//   } else {
//     element.style.height = height + "px";
//   }
// }

// function setPersonLogoPosition() {
//   const personLogo = document.querySelector(".personLogo");
//   const editLogo = document.querySelector(".editContactMobile");

//   if (isMobile()) {
//     const marginBottom = 660;
//     const scrollY = window.scrollY;

//     const bottomValue = marginBottom + scrollY;
//     // personLogo.style.top = `${bottomValue}px`;
//     // editLogo.style.top = `${bottomValue - 50}px`;
//   }
// }

// setInterval(setPersonLogoPosition, 300);

// window.addEventListener("resize", () => {
//   setContentContactHeight();
//   setTimeout(() => {
//     console.log("2 Sekunden nach dem Resize (ungefähr).");
//   }, 2000);
// });

/**
 * Edits the user account by displaying a popup.
 * @param {boolean} bool - Determines whether to show or hide the edit user account popup.
 */
async function editUserAccount(bool) {

  let userName = document.getElementById("nameLoggedinUser");
  let userEmail = document.getElementById("emailLoggedinUser");
  let userPassword = document.getElementById("password");

  let userData = await getItem("user/profile");

  if (userData.id !== 4) {
    await displayEditUserAccount(bool, userData)
    userName.value = userData.first_name;
    userEmail.value = userData.email;
  } else {
    displayGuestUserPopup(true);
  }
  scrollToContactView();
};

/**
 * Checks and manages password input for user account updates.
 */
function passwordCheck() {
  let userPasswordConfirm = document.getElementById("passwordConfirm");
  let userPassword = document.getElementById("password");
  let updateBtn = document.getElementById("updateBtn");
  password = userPassword.value;

  if (password) {
    userPasswordConfirm.removeAttribute("disabled");
    updateBtn.setAttribute("disabled", true);
    confirmPassword(updateBtn);
  } else {
    userPasswordConfirm.setAttribute("disabled", true);
  }

}

/**
 * Updates the user's account information.
 */
function updateUser() {
  let userName = document.getElementById("nameLoggedinUser").value;
  let userEmail = document.getElementById("emailLoggedinUser").value;
  let userPassword = document.getElementById("password").value;
  let userPasswordConfirm = document.getElementById("passwordConfirm").value;

  if (!password) {
    let body = JSON.stringify({
      first_name: userName,
      email: userEmail,
    });

    updateUserAccount("user/profile", body);
    displayEditUserAccount(false);
  } else if (userPassword === userPasswordConfirm) {
    let body = JSON.stringify({
      first_name: userName,
      email: userEmail,
      password: userPassword,
    });
    updateUserAccount("user/profile", body);
    displayEditUserAccount(false);
  }


}


/**
 * Displays or hides the edit user account popup.
 * @param {boolean} bool - Determines whether to show or hide the edit user account popup.
 */
async function displayEditUserAccount(bool) {
  let backGroundOpacityContainer = document.getElementById("backGroundOpacityContainer");
  let popupUserAccount = document.getElementById("editUserAccount");
  if (bool) {
    popupUserAccount.classList.remove("d-none");
    backGroundOpacityContainer.classList.remove("d-none");
    document.body.classList.add("no-scroll");
  } else {
    popupUserAccount.classList.add("d-none");
    backGroundOpacityContainer.classList.add("d-none");
    document.body.classList.remove("no-scroll");
  }
};

/**
 * Displays a popup for guest users.
 * @param {boolean} bool - Determines whether to show or hide the guest user popup.
 */
function displayGuestUserPopup(bool) {
  let displayGuestUser = document.getElementById("popGuestUser");

  if (bool) {
    displayGuestUser.classList.remove("d-none");
  } else {
    displayGuestUser.classList.add("d-none");
  }
}

/**
 * Confirms if the password and confirm password fields match, enabling or disabling the update button accordingly.
 */
function confirmPassword() {
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("passwordConfirm").value;
  let updateBtn = document.getElementById("updateBtn");

  if (password !== confirmPassword) {
    document.getElementById("passwordConfirmError").classList.remove("d-none");
    updateBtn.setAttribute("disabled", true);
  } else {
    document.getElementById("passwordConfirmError").classList.add("d-none");
    updateBtn.removeAttribute("disabled");
  }
}

/**
 * Starts the edit user account process if specified in session storage.
 */
function startEditUserAccount() {
  if (sessionStorage.getItem("editUser")) {
    editUserAccount(true);
    setTimeout(() => {
      sessionStorage.removeItem("editUser");
    }, 500);
  }

}