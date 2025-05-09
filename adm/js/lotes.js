let loteParaExcluir = null;
let idParaExcluir = null;

// Função para abrir o modal de exclusão
function abrirModal(botao) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";  // Exibe o modal com display flex
  loteParaExcluir = botao.closest(".lote"); // Encontre o lote relacionado
  idParaExcluir = botao.getAttribute("data-id"); // Salve o id do lote
}

// Função para fechar o modal de exclusão
function fecharModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none"; // Oculta o modal
  loteParaExcluir = null; // Limpa a referência ao lote
  idParaExcluir = null; // Limpa a referência ao id
}

// Função para confirmar a exclusão do lote
function confirmarExclusao() {
  if (idParaExcluir) {
    fetch(`http://10.90.146.37/api/api/Lote/DeletarLote/${idParaExcluir}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir lote.");
        alert("Lote excluído com sucesso!");
        carregarLotes(); // Atualiza a lista
        fecharModal(); // Fecha o modal após a exclusão
      })
      .catch(error => {
        console.error("Erro ao excluir lote:", error);
        alert("Erro ao excluir lote.");
      });
  }
}

// Função para carregar os lotes
function carregarLotes() {
  fetch("http://10.90.146.37/api/api/Lote")
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar lotes");
      return res.json();
    })
    .then(lotes => {
      const container = document.getElementById("container-lotes");
      container.innerHTML = ""; // Limpa o conteúdo do container

      if (lotes.length === 0) {
        container.innerHTML = "<p>Não há lotes disponíveis.</p>";
      }

      lotes.forEach((lote, index) => {
        const ativo = lote.ativo === 1;
        const qtdTotal = lote.qtd_total || 0;
        const dataInicio = new Date(lote.data_inicio).toLocaleDateString("pt-BR");
        const dataTermino = new Date(lote.data_termino).toLocaleDateString("pt-BR");

        const elemento = `
          <div class="lote ${ativo ? "ativo" : "inativo"}" data-id="${lote.id}">
            <strong style="font-size: 35px; font-style: italic;">Lote ${index + 1}</strong>
            <div class="acoes">
              <a href="../views/editarlote.html?id=${lote.id}" class="editar" style="margin-left: 15px;">EDITAR</a>
              <button class="excluir" onclick="abrirModal(this)" data-id="${lote.id}">EXCLUIR</button>
              <p class="info" style="font-size: 20px; font-style: italic;">Quantidade Total: <b>${qtdTotal}</b></p>
              <p class="info" style="font-size: 20px; font-style: italic;">Data de Início: <b>${dataInicio}</b></p>
              <p class="info" style="font-size: 20px; font-style: italic;">Data de Término: <b>${dataTermino}</b></p>
              <p class="status-text" style="font-size: 25px; font-family: consolas;">STATUS: ${ativo ? "ATIVADO" : "DESATIVADO"}</p>
              <label class="switch">
                <input type="checkbox" ${ativo ? "checked" : ""} onchange="atualizarStatus(${lote.id}, this)">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <br>
        `;
        container.insertAdjacentHTML("beforeend", elemento);
      });
    })
    .catch(erro => {
      console.error("Erro ao carregar lotes:", erro);
      alert("Erro ao carregar lotes.");
    });
}

// Função para atualizar o status do lote (ativar/desativar)
function atualizarStatus(id, checkboxElement) {
  const ativar = checkboxElement.checked;

  // Se o lote for ativado, desativamos todos os outros lotes primeiro
  if (ativar) {
    desativarTodosLotes().then(() => {
      // Buscar os dados do lote pelo ID
      fetch(`http://10.90.146.37/api/api/Lote/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar dados do lote");
          return res.json();
        })
        .then(lote => {
          // Atualiza apenas o campo 'ativo'
          lote.ativo = 1;

          // Envia os dados completos do lote para atualização
          return fetch(`http://10.90.146.37/api/api/Lote/EditarLote/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(lote)
          });
        })
        .then(res => {
          if (!res.ok) throw new Error("Erro ao atualizar status do lote");
          return res.json();
        })
        .then(() => {
          // Atualiza o status do lote no DOM
          const loteElement = document.querySelector(`.lote[data-id="${id}"]`);
          if (loteElement) {
            const statusText = loteElement.querySelector(".status-text");

            // Atualiza o status no DOM
            if (statusText) {
              statusText.textContent = `STATUS: ATIVADO`;
              loteElement.classList.add("ativo");
              loteElement.classList.remove("inativo");
            }

            // Desmarcar outros switches, se o novo checkbox for ativado
            const switches = document.querySelectorAll(".lote input[type='checkbox']");
            switches.forEach(switchElement => {
              if (switchElement !== checkboxElement && switchElement.checked) {
                switchElement.checked = false;
                const loteDesmarcado = switchElement.closest(".lote");
                if (loteDesmarcado) {
                  const statusTextDesmarcado = loteDesmarcado.querySelector(".status-text");
                  if (statusTextDesmarcado) {
                    statusTextDesmarcado.textContent = `STATUS: DESATIVADO`;
                    loteDesmarcado.classList.add("inativo");
                    loteDesmarcado.classList.remove("ativo");
                  }
                }
              }
            });
          }
        })
        .catch(err => {
          console.error("Erro ao alterar status do lote:", err);
        });
    }).catch(err => {
      console.error("Erro ao desativar outros lotes:", err);
    });
  } else {
    // Se o lote foi desativado, apenas atualize no backend
    fetch(`http://10.90.146.37/api/api/Lote/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar dados do lote");
        return res.json();
      })
      .then(lote => {
        lote.ativo = 0;

        // Envia os dados completos do lote para atualização
        return fetch(`http://10.90.146.37/api/api/Lote/EditarLote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(lote)
        });
      })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao desativar status do lote");
        return res.json();
      })
      .then(() => {
        // Atualiza o status no DOM
        const loteElement = document.querySelector(`.lote[data-id="${id}"]`);
        if (loteElement) {
          const statusText = loteElement.querySelector(".status-text");

          // Atualiza o status no DOM
          if (statusText) {
            statusText.textContent = `STATUS: DESATIVADO`;
            loteElement.classList.add("inativo");
            loteElement.classList.remove("ativo");
          }
        }
      })
      .catch(err => {
        console.error("Erro ao alterar status do lote:", err);
      });
  }
}

// Função para desativar todos os outros lotes
function desativarTodosLotes() {
  return fetch("http://10.90.146.37/api/api/Lote")
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar lotes");
      return res.json();
    })
    .then(lotes => {
      // Enviar uma requisição para desativar todos os lotes
      const promises = lotes.map(lote => {
        if (lote.ativo === 1) {
          lote.ativo = 0;
          return fetch(`http://10.90.146.37/api/api/Lote/EditarLote/${lote.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(lote)
          });
        }
        return Promise.resolve();
      });

      return Promise.all(promises);
    });
}

// Carregar os lotes ao carregar a página
window.onload = carregarLotes;

// Fechar o modal se o clique for fora dele
window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
});
