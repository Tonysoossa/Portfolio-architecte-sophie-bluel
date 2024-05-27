const API_ENDPOINT = "http://localhost:5678/api";

const logEl = document.querySelector(".login-form");
const logErr = document.querySelector(".log-error");
const logErrMdp = document.querySelector(".log-error-mdp");

// Log

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
        throw new Error(
          (logErr.style.display = "block"),
          logErr.appendChild(txt404)
        );
      }
      if (res.status === 401) {
        throw new Error(
          (logErrMdp.style.display = "block"),
          logErrMdp.appendChild(txt401)
        );
      }

      const dataLogin = await res.json();
      console.log(dataLogin);
      localStorage.setItem("token", dataLogin.token);
      if (dataLogin.token) {
        window.location.assign(
          "http://localhost:5500/Portfolio-architecte-sophie-bluel/FrontEnd/index.html"
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};
logFunc();
