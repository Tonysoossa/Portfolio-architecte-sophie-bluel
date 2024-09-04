const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

const body = document.querySelector(".body");
const editModal = document.querySelector(".edit-modal");
const workBox = document.querySelector(".works-box");
const addWorkBtn = document.querySelector(".add-work-btn");
const editModalUpperText = document.querySelector(".edit-modal-upper-text");
const addWorkDiv = document.querySelector(".add-photo-div");
const workForm = document.querySelector(".add-work-form");
const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");

export const checkLogin = () => Boolean(token);

export const removeClassFromEl = (elements, classname) => {
  elements.forEach((el) => el.classList.remove(classname));
};

export const addingClass = (event, classname) => event.target.classList.add(classname);

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


export const logOutFunc = () => {
  localStorage.removeItem("token");
  logLink.style.display = "flex";
  logOut.style.display = "none";
  editBtn.style.display = "none";
  headerBar.style.display = "none";
  categories.style.display = "flex";
};


// NOTE Modal


export const displayModalWorks = (works) => {
  works.forEach((el) => {
    const figureImg = document.createElement("figure");
    const displayImg = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("i");
    const worksBox = document.querySelector(".works-box");

    figureImg.classList.add("modal-figures");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.appendChild(deleteIcon);
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    figureImg.appendChild(deleteBtn);
    worksBox.appendChild(figureImg);
    figureImg.appendChild(displayImg);
    displayImg.alt = el.title;
    displayImg.src = el.imageUrl;
    worksBox.classList.add("works-box");
    displayImg.classList.add("works-box-img");
    deleteBtn.classList.add("delete-box");
    deleteIcon.classList.add("delete-icon");

    deleteBtn.addEventListener("click", (workId) => {
      // if status 200 then :

      //FIX need res.statut check 200

      const deletedElId = el.id;
      const gallery = document.querySelector(".gallery");
      const galleryImg = gallery.children;

      for (let i = 0; i < galleryImg.length; i++) {
        if (+galleryImg[i].id === deletedElId) {
          fetch(`${API_ENDPOINT}/works/` + deletedElId);
          worksBox.removeChild(figureImg);
          gallery.removeChild(galleryImg[i]);
          console.log(galleryImg[i]);
        }
      }
    });
  });
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
    figureImg.id = el.id;
  });
};


// const deleteWork = async (workId) => {
//   try {
//     const res = await fetch(`${API_ENDPOINT}/works/${workId}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${sessionStorage.getItem(token)}`,
//       },
//     });
//     if (!res.ok)
//       throw new Error(
//     `Une erreur c'est produite lors d'une tentative de suppresion du travaux`
//   );
//   globalWorks = null; // Réinitialise le cache des travaux
//   await displayWorksInModal(); // Met à jour l'affichage sans rechargement de la page
//   await displayFilteredWorks();
// } catch (error) {
//   console.error("Erreur lors de la suppression:", error); // Log en cas d'erreur
// }
// };

// deleteWork();




export const addWorkFunc = () => {
  workBox.style.display = "none";
  editModalUpperText.textContent = "Ajout photo";
  addWorkDiv.style.display = "flex";
  addWorkBtn.style.display = " none";
  workForm.style.display = "flex";
};

export const goBackFunc = () => {
  workBox.style.display = "flex";
  editModalUpperText.textContent = "Galerie photo";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
};

export const closeModalFunc = () => {
  workBox.style.display = "flex";
  editModal.style.display = "none";
  addWorkBtn.style.display = " flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
  body.classList.remove("body-shadow");
  editModalUpperText.textContent = "Galerie photo";
};


// NOTE token check

const tokenExist = localStorage.getItem('token');
if (tokenExist) {
    console.log('Token exists:', token);
} else {
    console.log('No token found');
}