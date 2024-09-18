import {
  getCatFromApi,
  getWorksFromApi,
  removeClassFromSingleEl,
} from "./utils.js";

import { displayWorks } from "./script.js";

// NOTE Data relation NOTE
const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

// NOTE Btns selectors NOTE
const saveWorkBtn = document.querySelector(".save-work-btn");
const addWorkBtn = document.querySelector(".add-work-btn");
const goBackBtn = document.querySelector(".goBackBtn");
const editBtn = document.querySelector(".edit-btn");
const closeModalButton = document.querySelector(".close-modal");

// NOTE Global selectors NOTE
const editModal = document.querySelector(".edit-modal");
const editModalUpperText = document.querySelector(".edit-modal-upper-text");
const body = document.querySelector("body");

// NOTE works selectors NOTE
const workBox = document.querySelector(".works-box");
const worksBox = document.querySelector(".works-box");
const workForm = document.querySelector(".add-work-form");
const addWorkDiv = document.querySelector(".add-photo-div");

// NOTE formulaire ids selector NOTE
const previewImage = document.querySelector("#previewImage");
const fileInput = document.querySelector("#file");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");

// NOTE General editing fonction NOTE
const editing = async () => {
  const dataWork = await getWorksFromApi();

  // NOTE any click out of modal will close it NOTE
  document.addEventListener("click", (e) => {
    if (!editModal.contains(e.target)) {
      closeModalFunc();
    }
  });

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
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

const goBackFunc = () => {
  workForm.reset();
  previewImage.style.display = "none";
  editModalUpperText.textContent = "Galerie photo";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
  removeClassFromSingleEl(saveWorkBtn, "save-work-btn-completed");
};

const closeModalFunc = () => {
  workForm.reset();
  previewImage.style.display = "none";
  editModal.style.display = "none";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
  removeClassFromSingleEl(body, "body-shadow");
  editModalUpperText.textContent = "Galerie photo";
  goBackBtn.style.display = "none";
  removeClassFromSingleEl(saveWorkBtn, "save-work-btn-completed");
};

// NOTE Add new works NOTE

const handleAddWork = () => {
  // Fonction pour afficher la modale d'ajout
  const showAddWorkModal = () => {
    editModal.style.display = "flex";
    addWorkDiv.style.display = "flex";
    workForm.style.display = "flex";
    addWorkBtn.style.display = "none";
    editModalUpperText.textContent = "Ajout photo";
    goBackBtn.style.display = "flex";
    goBackBtn.classList.add("goBackBtn", "fa-solid", "fa-arrow-left");
    saveWorkBtn.style.display = "flex";
    workBox.style.display = "none";

    generateCategories();

    // Prévisualisation de l'image lors du changement de fichier
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
      checkFormCompletion();
    });

    titleInput.addEventListener("keyup", checkFormCompletion);
    categorySelect.addEventListener("change", checkFormCompletion);
  };

  // Fonction pour fermer la modale et revenir à la vue principale
  const closeAndReset = () => {
    workForm.reset();
    previewImage.style.display = "none";
    editModal.style.display = "none";
    addWorkBtn.style.display = "flex";
    addWorkDiv.style.display = "none";
    workForm.style.display = "none";
    removeClassFromSingleEl(body, "body-shadow");
    editModalUpperText.textContent = "Galerie photo";
    goBackBtn.style.display = "none";
    removeClassFromSingleEl(saveWorkBtn, "save-work-btn-completed");
    workBox.style.display = "flex";
  };

  // Gestion du clic sur le bouton "Ajouter une photo"
  addWorkBtn.addEventListener("click", showAddWorkModal);

  // Gestion du clic sur le bouton "Retour"
  goBackBtn.addEventListener("click", closeAndReset);

  // Gestion du clic sur le bouton "Valider" pour ajouter un travail
  saveWorkBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    checkFormCompletion();

    // Crée l'objet FormData pour inclure les données du formulaire et le fichier
    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    // Ajoute l'image au FormData si un fichier est sélectionné
    const file = fileInput.files[0];
    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await fetch(`${API_ENDPOINT}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Envoie le FormData avec l'image et les autres champs
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout du travail");

      const newWork = await res.json();

      // Ajouter le nouveau travail à la galerie principale
      const gallery = document.querySelector(".gallery");
      const figureImg = document.createElement("figure");
      const displayImg = document.createElement("img");
      const imgTitle = document.createElement("figcaption");

      figureImg.id = newWork.id;
      displayImg.alt = newWork.title;
      displayImg.src = newWork.imageUrl; 
      imgTitle.textContent = newWork.title;

      figureImg.appendChild(displayImg);
      figureImg.appendChild(imgTitle);
      gallery.appendChild(figureImg);

      displayModalWorks([newWork]);

      closeAndReset(); // Ferme la modale après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout du travail:", error);
    }
  });
};

// NOTE display works and generates categories NOTE
const displayModalWorks = (works) => {
  works.forEach((el) => {
    const figureImg = document.createElement("figure");
    const displayImg = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("i");

    figureImg.classList.add("modal-figures");
    figureImg.dataset.id = el.id;
    deleteBtn.classList.add("delete-box");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

    deleteBtn.appendChild(deleteIcon);
    figureImg.appendChild(deleteBtn);
    figureImg.appendChild(displayImg);
    worksBox.appendChild(figureImg);

    displayImg.alt = el.title;
    displayImg.src = el.imageUrl;
    displayImg.classList.add("works-box-img");

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`${API_ENDPOINT}/works/${el.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // Supprimer l'élément de la modale
          worksBox.removeChild(figureImg);

          // Supprimer l'élément de la galerie principale
          const mainGalleryItem = document.querySelector(
            `.gallery figure[id="${el.id}"]`
          );
          if (mainGalleryItem) {
            mainGalleryItem.remove();
          }

          works.splice(
            works.indexOf((el2) => el2.id == el.id),
            1
          );
          displayWorks(works);
          
        } else {
          throw new Error("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    });
  });
};

const generateCategories = async () => {
  const data = await getCatFromApi();
  categorySelect.innerHTML =
    '<option value="" disabled selected>Choisir une catégorie</option>';
  data.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
};

// NOTE Check if form is completed changing saveWorkBtn color NOTE
const checkFormCompletion = () => {
  const isImageSelected = fileInput.files.length > 0;
  const isTitleEntered = titleInput.value.trim() !== "";
  const isCategorySelected = categorySelect.value !== "";

  if (isImageSelected && isTitleEntered && isCategorySelected) {
    saveWorkBtn.classList.add("save-work-btn-completed");
  } else {
    removeClassFromSingleEl(saveWorkBtn, "save-work-btn-completed");
  }
};

// NOTE Function calls NOTE
// addWorks();
editing();
handleAddWork();
