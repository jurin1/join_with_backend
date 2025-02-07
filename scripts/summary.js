let timeOfDay = ["Good Morning,", "Good Afternoon,", "Good Evening,"];
const categories = ["todo", "progress", "feedback", "done"];
let greeting = "";
let nameUser = localStorage.getItem("name");
let summaryTask = [];
let todo = [];
let progress = [];
let feedback = [];
let done = [];
let allTasksCount = [];
let urgent = [];
let upcomingDate = [];

/**
 * Renders the summary page by loading tasks, setting greetings based on the time of day, and displaying relevant task information.
 */
async function renderSummary(){
    summaryTask = await getItem("tasks");
    allTasksCount = summaryTask.length;

    checkWelcomePopup(); 
    hourCheck();
    summeryTasks();    

    bodySummary();
    addActiveStyle(1);
}

/**
 * Determines the appropriate greeting based on the current hour of the day.
 */
function hourCheck() {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    if (currentHour >= 0 && currentHour < 12) {
        greeting = timeOfDay[0];
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = timeOfDay[1]
    } else {
        greeting = timeOfDay[2]
    }
    setGreeting(greeting);
    setUserName();
    welcomeSummary();
}

/**
 * Sets the greeting message in the greeting popup based on the time of day.
 * @param {string} greeting - The greeting message to be displayed.
 */
function setGreeting(greeting){
    let greetingPopup = document.getElementById("greetingPopup");
    greetingPopup.innerHTML = greeting
}

/**
 * Sets the user's name in the greeting popup.
 */
function setUserName(){
    let greetingNamePopup = document.getElementById("greetingNamePopup");
    greetingNamePopup.innerHTML = nameUser
}

/**
 * Checks if the welcome popup should be displayed based on the user's session state.
 */
function checkWelcomePopup(){
    let stateWelcome = sessionStorage.getItem("welcome")
    let welcomePopup = document.getElementById("welcomePopup")

    if (!stateWelcome){
        welcomePopup.classList.remove("d-none");
        setTimeout(function() {
            welcomeAnimation(welcomePopup);
        }, 2800);
    } 
}

/**
 * Animates the welcome popup by hiding it after a short delay.
 * @param {HTMLElement} welcomePopup - The welcome popup element to be animated.
 */
function welcomeAnimation(welcomePopup){
    welcomePopup.classList.add("d-none");
    sessionStorage.setItem("welcome", true);
}

/**
 * Displays the greeting and user's name on the summary page.
 */
function welcomeSummary(){
    let greetingSummary = document.getElementById("greeting");
    greetingSummary.innerHTML = greeting;
    let greetingNameSummary = document.getElementById("greetingName");
    greetingNameSummary.innerHTML = nameUser;
}

/**
 * Extracts and categorizes task information from the loaded task data for display in the summary.
 * @param {Array} summaryTask - The array of tasks to summarize.
 */
async function summeryTasks() {

  summaryTask.forEach((taskInfo) => {
    if (taskInfo.status === "todo") {
      todo.push(taskInfo);
    } else if (taskInfo.status === "progress") {
      progress.push(taskInfo);
    } else if (taskInfo.status === "feedback") {
      feedback.push(taskInfo);
    } else if (taskInfo.status === "done") {
      done.push(taskInfo);
    }
  });
}



/**
 * Parses and sorts task dates to find the nearest upcoming task date for the summary.
 * @param {Array} summaryTask - The array of tasks to parse for upcoming dates.
 */
async function parseDate() {
    let nextTask = await getItem("urgent_tasks");
    return nextTask;
}

/**
 * Updates the body of the summary page with summarized task information.
 */
function bodySummary() {
    let bodySummary = document.getElementById('bodySummaryID');
    bodySummary.innerHTML = '';
    bodySummary.innerHTML = bodySummaryHTML();
}


