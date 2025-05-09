document.addEventListener("DOMContentLoaded", () => {
  const adminList = document.querySelector(".admin-list");
  const addButton = document.querySelector(".add-button");
  const API_URL = "http://10.90.146.37/api/api/Usuario";
  const URL_EXCLUIR = "http://10.90.146.37/api/api/Usuario/ExcluirUsuario";
  const URL_EDITAR = "http://10.90.146.37/api/api/Usuario/AtualizarPerfil";

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
  const currentUserId = Number(usuarioLogado.id);
  const perfil = localStorage.getItem("tipo_perfil")
  const isGestaoProjeto = perfil == 1;

  console.log("→ usuarioLogado:", usuarioLogado);
  console.log("→ currentUserId:", currentUserId);
  console.log("→ currentPerfil:", perfil);
  console.log("→ isGestaoProjeto:", isGestaoProjeto);

  // Mostra botão de adicionar somente para perfil 1
  if (addButton) {
    if (isGestaoProjeto) {
      addButton.hidden = false;
      addButton.addEventListener("click", () => {
        window.location.href = "../gerenciamento/cadastroadm.html";
      });
    } else {
      addButton.hidden = true;
    }
  }

  if (adminList) adminList.textContent = "Carregando administradores...";

  fetch(API_URL)
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(usuarios => renderUsuarios(usuarios))
    .catch(err => {
      console.error("Erro na API:", err);
      if (adminList) adminList.textContent = "Falha ao carregar usuários.";
    });

    window.testando = function() {
      const nome = localStorage.getItem("usuarioNome");
      const email = localStorage.getItem("usuarioEmail");
      const perfil = localStorage.getItem("tipo_perfil")
      
      console.log(`Nome: ${nome}, Email: ${email}, Perfil: ${perfil}`);
    }

  function renderUsuarios(usuarios) {
    adminList.innerHTML = "";

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      adminList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }

    usuarios.forEach(({ id, nome, perfil_id }) => {
      const card = document.createElement("div");
      card.className = "admin-card";

      const info = document.createElement("div");
      info.className = "admin-info";
      const labels = { 1: 'Admin', 2: 'Usuário', 3: 'Portaria' };
      const labelText = labels[perfil_id] || `Perfil ${perfil_id}`;
      info.innerHTML = `<span>👤</span> <span>${nome}</span> <span style='color:red;'>[${labelText}]</span>`;
      card.appendChild(info);

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-button");
      editBtn.textContent = "✏️";

      const podeEditar = isGestaoProjeto || id === currentUserId;
      if (podeEditar) {
        editBtn.title = "Editar usuário";
        editBtn.onclick = () => editUsuario(id, nome, perfil_id);
      } else {
        editBtn.disabled = true;
        editBtn.title = "Sem permissão";
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-button");
      deleteBtn.textContent = "🗑️";

      const podeExcluir = isGestaoProjeto && id !== currentUserId;
      if (podeExcluir) {
        deleteBtn.title = "Excluir usuário";
        deleteBtn.onclick = () => deleteUsuario(id, card);
      } else {
        deleteBtn.disabled = true;
        deleteBtn.title = "Sem permissão";
      }

      actions.append(editBtn, deleteBtn);
      card.appendChild(actions);
      adminList.appendChild(card);
    });
  }


  async function editUsuario(id, nomeAtual) {
    try {
      // 1️⃣ Busca todos os usuários
      const response = await fetch(API_URL);
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }
  
      // 2️⃣ Converte para JSON e encontra o usuário desejado
      const usuarios = await response.json();
      const usuarioAtual = usuarios.find(u => u.id === id);
  
      if (!usuarioAtual) {
        alert("Usuário não encontrado.");
        return;
      }
  
      // 3️⃣ Pergunta o novo nome ao usuário
      const novoNome = prompt("Novo nome:", nomeAtual);
      if (!novoNome || novoNome === nomeAtual) return;
  
      // 4️⃣ Monta o objeto JSON com todos os campos
      const usuarioEditado = {
        id: usuarioAtual.id,
        nome: novoNome,
        caminho_foto: usuarioAtual.caminho_foto,
        email: usuarioAtual.email,
        senha: usuarioAtual.senha,
        telefone: usuarioAtual.telefone,
        perfil_id: usuarioAtual.perfil_id
      };
  
      // 5️⃣ Envia para o endpoint de atualização
      console.log("🔄 JSON Enviado para Atualização:", usuarioEditado);
  
      const updateResponse = await fetch(`${URL_EDITAR}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioEditado)
      });
  
      if (!updateResponse.ok) {
        // ❌ Em caso de erro, loga o JSON que foi enviado
        console.error("❌ Erro ao atualizar usuário:", updateResponse.status);
        console.log("📌 JSON que causou o erro:", usuarioEditado);
        throw new Error(`Erro ao atualizar usuário: ${updateResponse.status}`);
      }
  
      // 6️⃣ Converte a resposta para JSON e loga no console
      const responseJson = await updateResponse.json();
      console.log("✅ Resposta da API:", responseJson);
  
      // 7️⃣ Sucesso
      alert("Nome do usuário atualizado com sucesso!");
      reloadList(); // Recarrega a lista após edição
    } catch (err) {
      console.error("Erro ao editar usuário:", err.message);
      alert("Erro ao editar o nome do usuário.");
    }
  }
  
  

function deleteUsuario(id, card) {
  if (!confirm("Confirma exclusão?")) return;

  fetch(`${URL_EXCLUIR}/${id}`, {
    method: 'DELETE'
  })
    .then(r => {
      if (!r.ok) throw new Error(`Erro ${r.status}`);
      console.log(`Usuário com ID ${id} excluído.`);
      card.remove(); // Remove visualmente o card
      alert("Usuário excluído com sucesso!");
    })
    .catch(err => {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o usuário.");
    });
}


  function reloadList() {
    if (adminList) adminList.textContent = "Atualizando...";
    fetch(API_URL)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(renderUsuarios)
      .catch(() => {
        if (adminList) adminList.textContent = "Erro ao atualizar lista.";
      });
  }
});
