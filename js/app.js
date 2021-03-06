// Select the Elements
const themeBtn = document.querySelector("#dark-mode-toggle");
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const content = document.getElementById("content");
const addContent = document.getElementById("addToDo");

// Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// Variables
let LIST, id;

// get item from localstorage
let data = localStorage.getItem("TODO");

// check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length; // set the id to the last one in the list
  loadList(LIST); // load the list to the user interface
} else {
  // if data isn't empty
  LIST = [];
  id = 0;
}

// load items to the user's interface
function loadList(array) {
  array.forEach(function (item) {
    addToDo(item.name, item.id, item.done, item.trash);
  });
}

// clear the local storage
clear.addEventListener("click", function () {
  localStorage.removeItem("TODO");
  location.reload();
});

// Show todays date
const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("pt-BR", options);

// add to do function

function addToDo(toDo, id, done, trash) {

  if (trash) {
    return;
  }

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const item = `<li class="item">
                  <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                  <p class="text ${LINE}">${toDo}</p>
                  <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
              `;

  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
}

// add an item to the list user the enter key
document.addEventListener("keyup", function (even) {
  if (event.keyCode == 13) {
    const toDo = input.value;

    // if the input isn't empty
    if (toDo) {
      addToDo(toDo, id, false, false);
      document.querySelector(".content");
      LIST.push({
        name: toDo,
        id: id,
        done: false,
        trash: false
      });

      // add item to localstorage ( this code must be added where the LIST array is updated)
      localStorage.setItem("TODO", JSON.stringify(LIST));

      id++;
    }
    input.value = "";
  }
});


// complete to do
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

// remove to do
function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);

  LIST[element.id].trash = true;
}

// dark mode toggle

// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add('darkmode');
  content.classList.add('cont-dark');
  addContent.classList.add('cont-dark');
  // 2. Update darkMode in localStorage
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('darkmode');
  content.classList.remove('cont-dark');
  addContent.classList.remove('cont-dark');
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);
}

// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
  enableDarkMode();
}

themeBtn.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode');
  if (darkMode !== 'enabled') {
    enableDarkMode();
  // if it has been enabled, turn it off  
  } else {  
    disableDarkMode(); 
  }
});

// target the items created dynamically

list.addEventListener("click", function (event) {
  const element = event.target; // return the clicked element inside list
  const elementJob = element.attributes.job.value; // complete or delete

  if (elementJob == "complete") {
    completeToDo(element);
  } else if (elementJob == "delete") {
    removeToDo(element);
  }

  // add item to localstorage ( this code must be added where the LIST array is updated)
  localStorage.setItem("TODO", JSON.stringify(LIST));
});
