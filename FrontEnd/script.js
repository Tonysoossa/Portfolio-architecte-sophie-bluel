import {
  addingClass,
  checkLogin,
  displayWorks,
  getCatFromApi,
  getWorksFromApi,
  removeClassFromEl,
} from "./utils.js";

const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");

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
      console.log(selected);
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
  logOut.addEventListener("click", (e) => {
    localStorage.removeItem("token");
    logLink.style.display = "flex";
    logOut.style.display = "none";
    editBtn.style.display = "none";
    headerBar.style.display = "none";
    categories.style.display = "flex";
  });
};
enableAdmin();

// Modals code




