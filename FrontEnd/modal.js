import { getCatFromApi, getWorksFromApi } from "./utils.js";
import { displayWorks } from "./script.js";

//  NOTE Data relation NOTE

const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

//  NOTE Btns selectors NOTE

const saveWorkBtn = document.querySelector(".save-work-btn");
const addWorkBtn = document.querySelector(".add-work-btn");
const goBackBtn = document.querySelector(".goBackBtn");
const editBtn = document.querySelector(".edit-btn");
const closeModalButton = document.querySelector(".close-modal");

//  NOTE Global selectors NOTE

const editModal = document.querySelector(".edit-modal");
const editModalUpperText = document.querySelector(".edit-modal-upper-text");
const body = document.querySelector("body");
// const images = document.querySelectorAll("img"); FIX

//  NOTE works selectors NOTE
const workBox = document.querySelector(".works-box");
const worksBox = document.querySelector(".works-box");
const workForm = document.querySelector(".add-work-form");
const addWorkDiv = document.querySelector(".add-photo-div");

//  NOTE formulaire ids selector NOTE

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
    // NOTE stopProp to prevent modal closing NOTE
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
  const editModalUpperText = document.querySelector(".edit-modal-upper-text");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const addWorkDiv = document.querySelector(".add-photo-div");
  const workForm = document.querySelector(".add-work-form");

  workForm.reset(); // Réinitialise le formulaire
  previewImage.style.display = "none";
  editModalUpperText.textContent = "Galerie photo";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
  saveWorkBtn.classList.remove("save-work-btn-completed");
};

const closeModalFunc = () => {
  workForm.reset(); // Réinitialise le formulaire
  previewImage.remove();
  editModal.style.display = "none";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";
  body.classList.remove("body-shadow");
  editModalUpperText.textContent = "Galerie photo";
  goBackBtn.style.display = "none";
  saveWorkBtn.classList.remove("save-work-btn-completed");
};

// NOTE Add new works NOTE

const addWorkFunc = () => {
  editModal.style.display = "flex";
  addWorkDiv.style.display = "flex";
  workForm.style.display = "flex";
  addWorkBtn.style.display = "none";
  editModalUpperText.textContent = "Ajout photo";

  // Préchargerement des cat dans le form générer par l'api NOTE
  generateCategories();

  // Prévisualiser l'image NOTE
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

  titleInput.addEventListener("keyup", () => {
    checkFormCompletion();
  });

  categorySelect.addEventListener("change", () => {
    checkFormCompletion();
  });

  workForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkFormCompletion();
    const formData = new FormData(workForm);
    const dataWork = await getWorksFromApi();

    try {
      const res = await fetch(`${API_ENDPOINT}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la photo");

      closeModalFunc();
      displayWorks(dataWork); // mise a jour des oeuvre NOTE
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo:", error);
    }
  });
};

const addWorks = () => {
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

// NOTE display works and generates categories NOTE

const displayModalWorks = (works) => {
  works.forEach((el) => {
    const figureImg = document.createElement("figure");
    const displayImg = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("i");

    figureImg.classList.add("modal-figures");
    deleteBtn.classList.add("delete-box");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

    deleteBtn.appendChild(deleteIcon);
    figureImg.appendChild(deleteBtn);
    figureImg.appendChild(displayImg);
    worksBox.appendChild(figureImg);

    displayImg.alt = el.title;
    displayImg.src = el.imageUrl;
    displayImg.classList.add("works-box-img");

    deleteBtn.addEventListener("click", async () => {
      const res = await fetch(`${API_ENDPOINT}/works/` + el.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        worksBox.removeChild(figureImg);
      } else {
        console.error("Erreur lors de la suppression");
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
    saveWorkBtn.classList.remove("save-work-btn-completed");
  }
};

// NOTE Function calls NOTE

addWorks();
editing();
