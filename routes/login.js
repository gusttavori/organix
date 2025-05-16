document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("https://organix-rpmq.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao fazer login");
        return;
      }

      // Salvar token no localStorage
      localStorage.setItem("token", data.token);

      // Redirecionar para a página profile.html
      window.location.href = "profile.html";

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login, tente novamente mais tarde.");
    }
  });
});

module.exports = router;