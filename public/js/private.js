document.addEventListener("DOMContentLoaded", () => {
  // --- Breadcrumb ---
  const breadcrumbNav = document.getElementById("breadcrumb");
  if (breadcrumbNav) {
    const pages = {
      "profile.html": "Home",
      "tasks.html": "Tarefas",
      "private.html": "Editar Tarefa"
    };

    const path = window.location.pathname.split("/").pop();
    const trail = ["profile.html"];
    if (path && path !== "index.html") {
      trail.push(path);
    }

    const ol = document.createElement("ol");
    ol.classList.add("breadcrumb");

    trail.forEach((page, index) => {
      const li = document.createElement("li");
      if (index === trail.length - 1) {
        li.textContent = pages[page] || page;
        li.setAttribute("aria-current", "page");
      } else {
        const a = document.createElement("a");
        a.href = pages[page] ? page : "#";
        a.textContent = pages[page] || page;
        li.appendChild(a);
      }
      ol.appendChild(li);
    });

    breadcrumbNav.appendChild(ol);
  }
  // --- Fim breadcrumb ---

  const params = new URLSearchParams(window.location.search);
  const tarefaId = params.get("id");

  if (!tarefaId) {
    console.error("Nenhum ID encontrado na URL.");
    return;
  }

  const getToken = () => localStorage.getItem("token");

  fetch(`/tarefas/${tarefaId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar tarefa");
      return res.json();
    })
    .then(tarefa => {
      document.querySelector(".task-title").textContent = tarefa.tarefa;
      const cards = document.querySelectorAll(".card");

      const descDiv = cards[0].querySelector(".card-content");
      descDiv.innerText = tarefa.descricao;
      descDiv.setAttribute("contenteditable", "false");
      descDiv.style.border = "none";

      const prioritySelect = cards[1].querySelector("select#priority-select");
      const priorityDiv = cards[1].querySelector(".card-content");

      if (!prioritySelect || !priorityDiv) {
        console.error("Elemento de prioridade não encontrado no DOM.");
        return;
      }

      if (prioritySelect.options.length === 0) {
        ["Baixa", "Média", "Alta"].forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          prioritySelect.appendChild(option);
        });
      }

      prioritySelect.value = tarefa.prioridade || "Média";
      prioritySelect.style.display = "none";
      priorityDiv.textContent = tarefa.prioridade || "Média";
      priorityDiv.style.display = "block";

      const statusSelect = cards[2].querySelector("select#status-select");
      const statusDiv = cards[2].querySelector(".card-content");

      if (!statusSelect || !statusDiv) {
        console.error("Elemento de status não encontrado no DOM.");
        return;
      }

      if (statusSelect.options.length === 0) {
        ["Pendente", "Em andamento", "Concluída"].forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          statusSelect.appendChild(option);
        });
      }

      statusSelect.value = tarefa.status || "Pendente";
      statusSelect.style.display = "none";
      statusDiv.textContent = tarefa.status || "Pendente";
      statusDiv.style.display = "block";
    })
    .catch(err => console.error(err));

  const editButtons = document.querySelectorAll(".btn-save");
  editButtons.forEach(button => {
    button.textContent = "Editar";
  });

  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const contentDiv = card.querySelector(".card-content");
      const select = card.querySelector("select");

      if (button.textContent === "Editar") {
        button.textContent = "Salvar";

        if (index === 0) {
          contentDiv.setAttribute("contenteditable", "true");
          contentDiv.style.border = "1px dashed #ffffff";
          contentDiv.focus();
        } else {
          if (select) {
            select.style.display = "inline-block";
            select.focus();
          }
          if (contentDiv) {
            contentDiv.style.display = "none";
          }
        }
      } else {
        button.textContent = "Editar";

        let updateData = {};

        if (index === 0) {
          contentDiv.setAttribute("contenteditable", "false");
          contentDiv.style.border = "none";
          updateData.descricao = contentDiv.innerText.trim();
        } else if (index === 1) {
          if (select) {
            const novoValor = select.value;
            updateData.prioridade = novoValor;

            contentDiv.textContent = novoValor;
            contentDiv.style.display = "block";
            select.style.display = "none";
          }
        } else if (index === 2) {
          if (select) {
            const novoValor = select.value;
            updateData.status = novoValor;

            contentDiv.textContent = novoValor;
            contentDiv.style.display = "block";
            select.style.display = "none";
          }
        }

        fetch(`/tarefas/${tarefaId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(updateData),
        })
          .then(res => {
            if (!res.ok) throw new Error("Erro ao salvar alteração");
            return res.json();
          })
          .then(data => {
            console.log("Tarefa atualizada:", data);
          })
          .catch(err => {
            console.error(err);
            alert("Falha ao salvar alteração");
          });
      }
    });
  });

  function showCustomConfirm(callback) {
    const modal = document.getElementById("custom-confirm");
    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    modal.classList.remove("hidden");

    const cleanup = () => {
      modal.classList.add("hidden");
      yesBtn.removeEventListener("click", onYes);
      noBtn.removeEventListener("click", onNo);
    };

    const onYes = () => {
      cleanup();
      callback(true);
    };

    const onNo = () => {
      cleanup();
      callback(false);
    };

    yesBtn.addEventListener("click", onYes);
    noBtn.addEventListener("click", onNo);
  }

  const deleteButton = document.querySelector(".btn-delete");

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      showCustomConfirm((confirmed) => {
        if (confirmed) {
          fetch(`/tarefas/${tarefaId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          })
            .then(async res => {
              if (!res.ok) {
                const errorText = await res.text();
                console.error("Erro ao excluir tarefa:", res.status, errorText);
                throw new Error("Erro ao excluir tarefa");
              }
              sessionStorage.setItem("popupMessage", "Tarefa removida com sucesso!");
              window.location.href = "profile.html";
            })
            .catch(err => {
              console.error(err);
              alert("Falha ao excluir tarefa");
            });
        }
      });
    });
  }
});
