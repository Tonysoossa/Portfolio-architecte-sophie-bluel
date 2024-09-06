// modal.js

import { getCatFromApi, getWorksFromApi, displayWorks } from "./utils.js";

const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");
const previewImage = document.querySelector("#previewImage");
const saveWorkBtn = document.querySelector(".save-work-btn");
const saveWorkBtnCompleted = document.querySelector(".save-work-btn-completed");

// Fonction pour afficher les catégories dans le sélecteur
// const generateCategories = async () => {
//   const data = await getCatFromApi();
//   const categorySelect = document.querySelector("#category");
//   data.forEach((el) => {
//     const option = document.createElement("option");
//     option.value = el.id;
//     option.textContent = el.name;
//     categorySelect.appendChild(option);
//   });
// };

// export const addWorkFunc = () => {
//   const editModal = document.querySelector(".edit-modal");
//   const addWorkDiv = document.querySelector(".add-photo-div");
//   const workForm = document.querySelector(".add-work-form");
//   const addWorkBtn = document.querySelector(".add-work-btn");
//   const editModalUpperText = document.querySelector(".edit-modal-upper-text");

//   editModal.style.display = "flex";
//   addWorkDiv.style.display = "flex";
//   workForm.style.display = "flex";
//   addWorkBtn.style.display = "none";
//   editModalUpperText.textContent = "Ajout photo";

//   // Précharger les catégories dans le formulaire
//   generateCategories();

//   // Prévisualiser l'image
//   document.querySelector("#file").addEventListener("change", (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         previewImage.src = e.target.result;
//         previewImage.style.display = "block";
//       };
//       reader.readAsDataURL(file);
//     }
//   });

//   // Gestion de l'envoi du formulaire
//   workForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     checkFormCompletion();
//     const formData = new FormData(workForm);
//     try {
//       const res = await fetch(`${API_ENDPOINT}/works`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Erreur lors de l'ajout de la photo");

//       displayWorks(await getWorksFromApi()); // Met à jour l'affichage des œuvres
//     } catch (error) {
//       console.error("Erreur lors de l'ajout de la photo:", error);
//     }
//   });
// };

  const checkFormCompletion = () => {
  const fileInput = document.querySelector("#file");
  const titleInput = document.querySelector("#title");
  const categorySelect = document.querySelector("#Catégorie");

  // Vérifier si un fichier est sélectionné
  const isImageSelected = fileInput.files.length > 0;
  // Vérifier si un titre est entré
  const isTitleEntered = titleInput.value.trim() !== "";
  // Vérifier si une catégorie est sélectionnée
  const isCategorySelected = categorySelect.value !== "";

  // Si tous les champs sont remplis, afficher 'done' dans la console
  if (isImageSelected && isTitleEntered && isCategorySelected) {
  
    saveWorkBtn.classList.add('save');
  } else {
    saveWorkBtn.display = "flex";
  }
};
