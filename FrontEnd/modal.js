// modal.js

import { getCatFromApi, getWorksFromApi, displayWorks } from "./utils.js";

const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

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
  populateCategories();

  // Prévisualiser l'image
  document.querySelector("#file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const previewImage = document.querySelector("#previewImage");
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Gestion de l'envoi du formulaire
  workForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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

// Fonction pour afficher les catégories dans le sélecteur
const populateCategories = async () => {
  const data = await getCatFromApi();
  const categorySelect = document.querySelector("#category");
  data.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
};
