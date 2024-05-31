import { checkLogin } from "./utils.js";

const API_ENDPOINT = "http://localhost:5678/api";
const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");

//Images display

const getImg = async () => {
  const res = await fetch(`${API_ENDPOINT}/works`);
  const data = await res.json();

  data.forEach((el) => {
    const figureImg = document.createElement("figure");
    const displayImg = document.createElement("img");
    const imgTitle = document.createElement("figcaption");

    document.querySelector(".gallery").appendChild(figureImg);

    figureImg.appendChild(displayImg);
    figureImg.appendChild(imgTitle);

    displayImg.alt = el.title;
    displayImg.src = el.imageUrl;
    imgTitle.innerHTML = el.title;
  });
};
getImg();

// Categories :

const getCategories = async () => {
  const res = await fetch(`${API_ENDPOINT}/categories`);
  const data = await res.json();

  const btnAll = document.createElement("button");
  categories.appendChild(btnAll).classList.add("categories-btn");
  btnAll.style.backgroundColor = "#1d6154";
  btnAll.style.color = "white";
  btnAll.innerHTML = "Tous";
  data.forEach((el) => {
    const displayBtn = document.createElement("button");
    categories.appendChild(displayBtn);
    displayBtn.classList.add("categories-btn");
    displayBtn.innerHTML = el.name;
  });
};
getCategories();

// After Login

const enableAdmin = () => {
  if (!checkLogin()) return;
  console.log("connected !!!!!!!!!!!");
  headerBar.style.display = "flex";
  editBtn.style.display = "flex";
  categories.style.display = "none";
  const logoutTxt = document.createTextNode("logout");
  logLink.innerText = "";
  logLink.appendChild(logoutTxt);
  logLink.addEventListener("click", (e) => {
    localStorage.removeItem("token");
  });
};
enableAdmin();

// Works

//
