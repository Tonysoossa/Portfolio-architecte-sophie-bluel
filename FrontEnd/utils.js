const API_ENDPOINT = "http://localhost:5678/api";

export const checkLogin = () => {
  return Boolean(localStorage.getItem("token"));
};

export const removeClassFromEl = (elements, classname) => {
  elements.forEach((el) => el.classList.remove(classname));
};

export const addingClass = (event, classname) =>
  event.target.classList.add(classname);

export const getWorksFromApi = async () => {
  const res = await fetch(`${API_ENDPOINT}/works`);
  const data = await res.json();
  return data;
};

export const getCatFromApi = async () => {
  const res = await fetch(`${API_ENDPOINT}/categories`);
  const data = await res.json();
  return data;
};

export const displayWorks = (works) => {
  document.querySelector(".gallery").innerHTML = "";
  works.forEach((el) => {
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
