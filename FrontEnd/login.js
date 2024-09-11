const API_ENDPOINT = "http://localhost:5678/api";
const token = localStorage.getItem("token");

const logEl = document.querySelector(".login-form");
const logErr = document.querySelector(".log-error");
const logErrMdp = document.querySelector(".log-error-mdp");

const logFunc = () => {
  logEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(logEl);
    const data = Object.fromEntries(formData);
    const txt404 = document.createTextNode("User not found, please try again");
    const txt401 = document.createTextNode(
      "Not Authorized, verify email or password"
    );

    try {
      const res = await fetch(`${API_ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 404) {
        logErr.style.display = "block";
        logErr.innerHTML = "";
        logErr.appendChild(txt404);
        return;
      }

      if (res.status === 401) {
        logErrMdp.style.display = "block";
        logErrMdp.innerHTML = "";
        logErrMdp.appendChild(txt401);
        return;
      }

      const dataLogin = await res.json();
      localStorage.setItem("token", dataLogin.token);
      if (dataLogin.token) {
        window.location.assign("http://127.0.0.1:5500/FrontEnd/index.html");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  });
};

logFunc();

