const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

const headerBar = document.querySelector(".header-bar");
const editBtn = document.querySelector(".edit-btn");
const categories = document.querySelector(".categories");
const logLink = document.getElementById("login");
const logOut = document.getElementById("logout");
const previewImage = document.querySelector("#previewImage");
const saveWorkBtn = document.querySelector(".save-work-btn");
const fileInput = document.querySelector("#file");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");

export const checkLogin = () => Boolean(token);

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
  const worksBox = document.querySelector(".works-box");
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

export const displayWorks = (works) => {
  const gallery = document.querySelector(".gallery");
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

const generateCategories = async () => {
  const data = await getCatFromApi();
  const categorySelect = document.querySelector("#category");
  categorySelect.innerHTML =
    '<option value="" disabled selected>Choisir une catégorie</option>';

  data.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
};

export const addWorkFunc = () => {
  const editModal = document.querySelector(".edit-modal");
  const addWorkDiv = document.querySelector(".add-photo-div");
  const workForm = document.querySelector(".add-work-form");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const editModalUpperText = document.querySelector(".edit-modal-upper-text");

  editModal.style.display = "flex";
  addWorkDiv.style.display = "flex";
  workForm.style.display = "flex";
  addWorkBtn.style.display = "none";
  editModalUpperText.textContent = "Ajout photo";

  // Précharger les catégories dans le formulaire
  generateCategories();

  // Prévisualiser l'image
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

  workForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkFormCompletion();
    const formData = new FormData(workForm);
    try {
      const res = await fetch(`${API_ENDPOINT}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la photo");

      closeModalFunc(); // Fermer la modal après l'ajout
      displayWorks(await getWorksFromApi()); // Met à jour l'affichage des œuvres
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo:", error);
    }
  });
};

export const checkFormCompletion = () => {
  console.log("trigger");
  // Vérifier si un fichier est sélectionné
  const isImageSelected = fileInput.files.length > 0;
  // Vérifier si un titre est entré
  const isTitleEntered = titleInput.value.trim() !== "";
  // Vérifier si une catégorie est sélectionnée
  const isCategorySelected = categorySelect.value !== "";
  // Si tous les champs sont remplis, afficher 'done' dans la console

  console.log("Fichier sélectionné:", isImageSelected);
  console.log("Titre entré:", isTitleEntered);
  console.log("Catégorie sélectionnée:", isCategorySelected);

  if (isImageSelected && isTitleEntered && isCategorySelected) {
    saveWorkBtn.classList.add("save-work-btn-completed");
    console.log("done");
  } else {
    saveWorkBtn.classList.remove("save-work-btn-completed");
  }
};

export const goBackFunc = () => {
  const editModalUpperText = document.querySelector(".edit-modal-upper-text");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const addWorkDiv = document.querySelector(".add-photo-div");
  const workForm = document.querySelector(".add-work-form");

  workForm.reset(); // Réinitialise le formulaire
  previewImage.remove();
  editModalUpperText.textContent = "Galerie photo";
  addWorkBtn.style.display = "flex";
  addWorkDiv.style.display = "none";
  workForm.style.display = "none";

  saveWorkBtn.classList.remove("save-work-btn-completed");
};

export const closeModalFunc = () => {
  const editModal = document.querySelector(".edit-modal");
  const addWorkBtn = document.querySelector(".add-work-btn");
  const addWorkDiv = document.querySelector(".add-photo-div");
  const workForm = document.querySelector(".add-work-form");
  const body = document.querySelector("body");
  const editModalUpperText = document.querySelector(".edit-modal-upper-text");
  const goBackBtn = document.querySelector(".goBackBtn");

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

// NOTE token check

const tokenExist = localStorage.getItem("token");
if (tokenExist) {
  console.log("Token exists:", token);
} else {
  console.log("No token found");
}
