const apiUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://organix-rpmq.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const breadcrumbNav = document.getElementById("breadcrumb");
  if (breadcrumbNav) {
    const pages = {
      "profile.html": "Home",
      "tasks.html": "Nova Tarefa",
      "private.html": "Editar Tarefa",
    };

    const path = window.location.pathname.split("/").pop();
    const trail = ["profile.html"];
    if (path && path !== "index.html" && path !== "profile.html") {
      trail.push(path);
    }

    const ol = document.createElement("ol");
    ol.classList.add("breadcrumb");
    ol.setAttribute("aria-label", "Breadcrumb");

    trail.forEach((page, index) => {
      const li = document.createElement("li");
      li.classList.add("breadcrumb-item");

      if (index === trail.length - 1) {
        li.textContent = pages[page] || page;
        li.setAttribute("aria-current", "page");
      } else {
        const a = document.createElement("a");
        a.href = page;
        a.textContent = pages[page] || page;
        a.setAttribute("tabindex", "0");
        li.appendChild(a);
      }
      ol.appendChild(li);
    });

    breadcrumbNav.appendChild(ol);
  }

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const addBtn = document.getElementById("add-task");

  addBtn?.addEventListener("click", () => {
    const tarefaInput = document.getElementById("new-task");
    const descricaoInput = document.getElementById("new-task-desc");
    const prioridadeInput = document.getElementById("new-task-priority");
    const statusInput = document.getElementById("new-task-status");

    if (!tarefaInput || !descricaoInput || !prioridadeInput || !statusInput) {
      showPopup("Campos do formulário não encontrados.");
      return;
    }

    const tarefa = tarefaInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const prioridade = prioridadeInput.value.trim();
    const status = statusInput.value.trim();

    if (tarefa === "") {
      showPopup("Por favor, insira o nome da tarefa.");
      tarefaInput.focus();
      return;
    }

    addBtn.disabled = true;

    fetch(`${apiUrl}/tarefas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tarefa, descricao, prioridade, status }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            // Se for erro de autenticação, redireciona para login
            if (res.status === 401) {
              localStorage.removeItem("token");
              window.location.href = "index.html";
              throw new Error("Sessão expirada. Por favor, faça login novamente.");
            }
            throw new Error(data.erro || "Erro ao adicionar tarefa");
          });
        }
        return res.json();
      })
      .then(() => {
        sessionStorage.setItem("popupMessage", "Tarefa adicionada com sucesso!");
        window.location.href = "profile.html";
      })
      .catch((err) => {
        console.error("Erro ao adicionar tarefa:", err);
        showPopup(err.message || "Erro inesperado ao adicionar tarefa");
      })
      .finally(() => {
        addBtn.disabled = false;
      });
  });

  document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 1500);
}
