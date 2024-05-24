const API_ENDPOINT = "http://localhost:5678/api";


// Categories :

const getCategories = async () => {
  const res = await fetch(`${API_ENDPOINT}/categories`);
  const data = await res.json();
  console.log(data);
};

getCategories();



// Works

//
