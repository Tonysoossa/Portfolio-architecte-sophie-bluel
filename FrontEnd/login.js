const API_ENDPOINT = "http://localhost:5678/api";

const logEl = document.querySelector(".login-form");

// Log

const logFunc = () => {
  logEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(logEl);
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
      const res = await fetch(`${API_ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const dataLogin = await res.json();
      console.log(dataLogin);
      localStorage.setItem("token", dataLogin.token);
      if (dataLogin.token) {
        window.location.assign(
          "http://localhost:5500/Portfolio-architecte-sophie-bluel/FrontEnd/index.html"
        );
      }
    } catch (error) {
      if (error.Status === 404) {
        throw prompt("404");
      }
      if (error === 401) {
        prompt("401");
      }
    }
  });
};
logFunc();
