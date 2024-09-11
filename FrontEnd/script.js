import {
  getCatFromApi,
  getWorksFromApi,
  removeClassFromEl,
  addingClass,
} from "./utils.js";

//  NOTE Data relation NOTE
const token = localStorage.getItem("token");

//  NOTE Connexion elements selector NOTE
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");
const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");

//  NOTE btn elements selector/création NOTE
const btnAll = document.createElement("button");

// NOTE General element selector NOTE
const categories = document.querySelector(".categories");
const choiceBox = document.querySelector(".categorie-choices-box");
const gallery = document.querySelector(".gallery");

// NOTE Gestion des œuvres NOTE
export const displayWorks = (works) => {
  gallery.innerHTML = "";
  works.forEach((el) => {
    const figureImg = document.createElement("figure");
    const displayImg = document.createElement("img");
    const imgTitle = document.createElement("figcaption");
    figureImg.id = el.id;
    displayImg.alt = el.title;
    displayImg.src = el.imageUrl;
    imgTitle.innerHTML = el.title;
    figureImg.appendChild(displayImg);
    figureImg.appendChild(imgTitle);
    gallery.appendChild(figureImg);
  });
};

// NOTE Initialise les images NOTE
const getImg = async () => {
  const imgData = await getWorksFromApi();
  displayWorks(imgData);
};

// NOTE Gestion des catégories NOTE
const getCategories = async () => {
  const data = await getCatFromApi();
  const dataWorks = await getWorksFromApi();

  // Créer et ajouter le bouton "Tous"
  btnAll.textContent = "Tous";
  categories.appendChild(btnAll).classList.add("categories-btn");

  // Créer les boutons pour chaque catégorie
  data.forEach((el) => {
    const displayBtn = document.createElement("button");
    categories.appendChild(displayBtn);
    displayBtn.classList.add("categories-btn");
    displayBtn.textContent = el.name;
    displayBtn.dataset.categoryId = el.id;
  });

  // Activer le bouton "Tous" par défaut
  btnAll.classList.add("categories-btn-active");

  // Sélectionner à nouveau les boutons après leur création
  const categoriesBtn = document.querySelectorAll(".categories-btn");

  // Ajouter les événements de clic après la création des boutons
  categoriesBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Enlever la classe active de tous les boutons
      removeClassFromEl(categoriesBtn, "categories-btn-active");
      // Ajouter la classe active au bouton cliqué
      addingClass(e, "categories-btn-active");

      const selected = +e.target.dataset.categoryId;
      // Filtrer les œuvres par catégorie
      const filter = dataWorks.filter((work) => work.categoryId === selected);

      if (!selected) {
        displayWorks(dataWorks);
        return;
      }
      displayWorks(filter);
    });
  });
};

const selectCategorie = async () => {
  const data = await getCatFromApi();
  data.forEach((el) => {
    const option = document.createElement("option");
    option.classList.add("categorie-choices");
    choiceBox.appendChild(option);
    option.textContent = el.name;
    option.value = el.id;
  });
};

// NOTE Vérifie la connexion puis active les fonctionnalités administratives après la connexion NOTE

const checkLogin = () => Boolean(token);

const enableAdmin = () => {
  if (!checkLogin()) return;
  headerBar.style.display = "flex";
  editBtn.style.display = "flex";
  categories.style.display = "none";
  logLink.style.display = "none";
  logOut.style.display = "block";
  logOut.addEventListener("click", () => logOutFunc());
};

const logOutFunc = () => {
  localStorage.removeItem("token");
  logLink.style.display = "flex";
  logOut.style.display = "none";
  editBtn.style.display = "none";
  headerBar.style.display = "none";
  categories.style.display = "flex";
};

// NOTE Function calls NOTE
getImg();
enableAdmin();
getCategories();
selectCategorie();
