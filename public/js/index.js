const apiUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const container = document.getElementById("container");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-password").value;

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);

        // Redirecionamento com mensagem para a próxima página
        sessionStorage.setItem("popupMessage", "Login realizado com sucesso!");
        window.location.href = "profile.html";
      } else {
        alert(result.message || "Erro ao fazer login");
      }
    } catch (err) {
      alert("Erro no login: " + err.message);
    }
  });

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const senha = document.getElementById("register-password").value;

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        container.classList.remove("right-panel-active");

        // Lembra que o usuário trocou para o modo login
        localStorage.setItem("auth-mode", "signin");
      } else {
        alert(result.message || "Erro ao cadastrar");
      }
    } catch (err) {
      alert("Erro no cadastro: " + err.message);
    }
  });
});