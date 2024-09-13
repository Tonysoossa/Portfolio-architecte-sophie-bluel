//  NOTE Data relation NOTE

const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

// NOTE Class manipulation NOTE

export const removeClassFromEl = (elements, classname) => {
  elements.forEach((el) => el.classList.remove(classname));
};

export const removeClassFromSingleEl = (singleEl, classname) => {
  singleEl.classList.remove(classname);
};

export const addingClass = (event, classname) =>
  event.target.classList.add(classname);


// NOTE retrieving data from api NOTE

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

// NOTE token check NOTE

if (token) {
  console.log("Token exists:", token);
} else {
  console.log("No token found");
}
