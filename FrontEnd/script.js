import {
  addWorkFunc,
  addingClass,
  checkLogin,
  closeModalFunc,
  displayModalWorks,
  displayWorks,
  getCatFromApi,
  getWorksFromApi,
  goBackFunc,
  logOutFunc,
  removeClassFromEl,
} from "./utils.js";

const body = document.querySelector(".body");
const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");
const editModal = document.querySelector(".edit-modal");
const workBox = document.querySelector(".works-box");
const goBackBtn = document.createElement("i");
const saveWorkBtn = document.createElement("button");
const addWorkBtn = document.querySelector(".add-work-btn");

const editModalUpperText = document.querySelector(".edit-modal-upper-text");
const addWorkDiv = document.querySelector(".add-photo-div");
const workForm = document.querySelector(".add-work-form");

//Images display

const getImg = async () => {
  const imgData = await getWorksFromApi();
  displayWorks(imgData);
};
getImg();

// Categories :

const getCategories = async () => {
  const data = await getCatFromApi();
  const dataWorks = await getWorksFromApi();
  const btnAll = document.createElement("button");
  btnAll.innerHTML = "Tous";
  categories.appendChild(btnAll).classList.add("categories-btn");
  data.forEach((el) => {
    const displayBtn = document.createElement("button");
    categories.appendChild(displayBtn);
    displayBtn.classList.add("categories-btn");
    displayBtn.innerHTML = el.name;
    displayBtn.dataset.categoryId = el.id;
  });
  const categoriesBtn = document.querySelectorAll(".categories-btn");
  btnAll.classList.add("categories-btn-active");
  categoriesBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      removeClassFromEl(categoriesBtn, "categories-btn-active");
      addingClass(e, "categories-btn-active");
      const selected = +e.target.dataset.categoryId;
      const filter = dataWorks.filter((work) => {
        return work.categoryId === selected;
      });
      if (!selected) {
        displayWorks(dataWorks);
        return;
      }
      displayWorks(filter);
    });
  });
};
getCategories();

// After Login

const enableAdmin = () => {
  if (!checkLogin()) return;
  headerBar.style.display = "flex";
  editBtn.style.display = "flex";
  categories.style.display = "none";
  logLink.style.display = "none";
  logOut.style.display = "block";
  logOut.addEventListener("click", () => logOutFunc());
};
enableAdmin();

// Modals code

const editing = async () => {
  const dataWork = await getWorksFromApi();
  const editBtn = document.querySelector(".edit-btn");
  const closeModal = document.querySelector(".close-modal");
  editBtn.addEventListener("click", () => {
    workBox.innerHTML = "";
    editModal.style.display = "flex";
    body.classList.add("body-shadow");
    displayModalWorks(dataWork);
  });
  closeModal.addEventListener("click", () => {
    closeModalFunc();

    goBackBtn.style.display = "none";
    saveWorkBtn.style.display = " none";
  });
};
editing();

const addWorks = () => {
  editModal.appendChild(saveWorkBtn);
  saveWorkBtn.classList.add("save-work-btn");
  saveWorkBtn.textContent = "Valider";
  addWorkBtn.addEventListener("click", () => {
    addWorkFunc();
    goBackBtn.classList.add("goBackBtn", "fa-solid", "fa-arrow-left");
    saveWorkBtn.style.display = "flex";
    editModal.appendChild(goBackBtn);
    goBackBtn.style.display = "flex";
  });

  goBackBtn.addEventListener("click", () => {
    goBackFunc();
    goBackBtn.style.display = "none";
    saveWorkBtn.style.display = "none";
  });
};

addWorks();

const selectCategorie = async () => {
  const data = await getCatFromApi();
  const choiceBox = document.querySelector(".categorie-choices-box");
  data.forEach((el) => {
    const option = document.createElement("option");
    option.classList.add("categorie-choices");
    choiceBox.appendChild(option);
    option.innerHTML = el.name;
    option.value = el.id;
  });
};
selectCategorie();


