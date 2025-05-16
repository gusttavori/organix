const apiUrl = ""; // Alterado para funcionar com caminhos relativos ou ser configurado em produção

document.addEventListener("DOMContentLoaded", () => {
  function showPopup(message) {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.textContent = message;

      // Aplica cor vermelha apenas se for a mensagem de tarefa removida
      if (message === "Tarefa removida com sucesso!") {
        popup.style.backgroundColor = "#b30000";
        popup.style.color = "white";
        popup.style.fontWeight = "bold";
      } else {
        popup.style.color = ""; // ou defina a cor padrão
        popup.style.fontWeight = "";
      }

      popup.classList.add("show");
      setTimeout(() => {
        popup.classList.remove("show");
        popup.textContent = "";
      }, 2000); // mostra por 2 segundos
    }
  }

  // Verifica se há mensagem no sessionStorage
  const message = sessionStorage.getItem("popupMessage");
  if (message) {
    showPopup(message);
    sessionStorage.removeItem("popupMessage");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const goToTasksBtn = document.getElementById("go-to-tasks");
  goToTasksBtn?.addEventListener("click", () => {
    window.location.href = "tasks.html";
  });

  const tarefasGrid = document.querySelector(".tarefas-grid");

const carregarTarefas = async () => {
  try {
    const response = await fetch(`${apiUrl}/tarefas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      // Lê a mensagem de erro e lança uma exceção
      const erroData = await response.json();
      throw new Error(erroData.erro || "Erro desconhecido ao carregar tarefas");
    }

    const tarefas = await response.json();

    // Verifica se tarefas é um array antes de usar forEach
    if (!Array.isArray(tarefas)) {
      throw new Error("Formato inesperado dos dados recebidos");
    }

    tarefasGrid.innerHTML = "";

    // Só executa forEach se tarefas for um array
    tarefas.forEach((tarefa) => {
      const card = document.createElement("div");
      card.classList.add("card-tarefa");

      card.innerHTML = `
        <span class="titulo-tarefa">${tarefa.tarefa}</span>
        <p class="descricao-tarefa"><strong>Descrição: </strong>${tarefa.descricao}</p>
        <p class="prioridade-tarefa"><strong>Prioridade: </strong> ${tarefa.prioridade}</p>
        <p class="status-tarefa"><strong>Status: </strong> ${tarefa.status}</p>
        <span class="icone-editar" data-id="${tarefa._id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="edit-icon">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </span>
      `;

      tarefasGrid.appendChild(card);

      const editIcon = card.querySelector(".icone-editar");
      editIcon.addEventListener("click", () => {
        window.location.href = `private.html?id=${tarefa._id}`;
      });
    });
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    showPopup(`Erro: ${error.message}`);
    
    // Se o erro for de autenticação, redireciona para login
    if (error.message.includes("Token") || error.message.includes("inválido")) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  }
};

  carregarTarefas();

  document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});
