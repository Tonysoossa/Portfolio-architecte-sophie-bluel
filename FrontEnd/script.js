import {
  addWorkFunc,
  goBackFunc,
  closeModalFunc,
  displayModalWorks,
  getCatFromApi,
  getWorksFromApi,
  logOutFunc,
  removeClassFromEl,
  addingClass,
  checkLogin,
  displayWorks,
  checkFormCompletion,
} from "./utils.js";

const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");
const workBox = document.querySelector(".works-box");

// Initialiser les œuvres
const getImg = async () => {
  const imgData = await getWorksFromApi();
  displayWorks(imgData);
};
getImg();

// Initialiser les catégories
const getCategories = async () => {
  const data = await getCatFromApi();
  const dataWorks = await getWorksFromApi();
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  categories.appendChild(btnAll).classList.add("categories-btn");
  data.forEach((el) => {
    const displayBtn = document.createElement("button");
    categories.appendChild(displayBtn);
    displayBtn.classList.add("categories-btn");
    displayBtn.textContent = el.name;
    displayBtn.dataset.categoryId = el.id;
  });
  const categoriesBtn = document.querySelectorAll(".categories-btn");
  btnAll.classList.add("categories-btn-active");
  categoriesBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      removeClassFromEl(categoriesBtn, "categories-btn-active");
      addingClass(e, "categories-btn-active");
      const selected = +e.target.dataset.categoryId;
      const filter = dataWorks.filter((work) => work.categoryId === selected);
      if (!selected) {
        displayWorks(dataWorks);
        return;
      }
      displayWorks(filter);
    });
  });
};
getCategories();

// Activer les fonctionnalités administratives après la connexion
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

// Gestion des modals
const editing = async () => {
  const dataWork = await getWorksFromApi();
  const editBtn = document.querySelector(".edit-btn");
  const workBox = document.querySelector(".works-box");
  const editModal = document.querySelector(".edit-modal");
  const body = document.querySelector("body");
  const closeModalButton = document.querySelector(".close-modal");

  editBtn.addEventListener("click", () => {
    workBox.innerHTML = "";
    editModal.style.display = "flex";
    body.classList.add("body-shadow");
    displayModalWorks(dataWork);
  });

  closeModalButton.addEventListener("click", () => {
    closeModalFunc();
    workBox.style.display = "flex";
  });
};
editing();

const addWorks = () => {
  const saveWorkBtn = document.querySelector(".save-work-btn");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const goBackBtn = document.querySelector(".goBackBtn");

  addWorkBtn.addEventListener("click", () => {
    addWorkFunc();
    goBackBtn.style.display = "flex";
    goBackBtn.classList.add("goBackBtn", "fa-solid", "fa-arrow-left");
    saveWorkBtn.style.display = "flex";
    workBox.style.display = "none";
  });

  goBackBtn.addEventListener("click", () => {
    goBackFunc();
    goBackBtn.style.display = "none";
    saveWorkBtn.style.display = "none";
    workBox.style.display = "flex";
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
    option.textContent = el.name;
    option.value = el.id;
  });
};
selectCategorie();
