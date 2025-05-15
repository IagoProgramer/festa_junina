document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const lembrarCheckbox = document.getElementById("lembrarUsuario");
  const mensagemErro = document.getElementById("mensagemErroPopup");

  
  function mostrarModal(mensagem, tipo = "info") {
    const modal = document.getElementById("myModal");
    const textoModal = document.getElementById("texto_modal");
    const fecharModal = document.getElementById("close_modal");

    textoModal.textContent = mensagem;

    modal.classList.remove("modal-success", "modal-error");
    if (tipo === "sucesso") modal.classList.add("modal-success");
    if (tipo === "erro") modal.classList.add("modal-error");

    modal.style.display = "block";

    fecharModal.onclick = () => {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    setTimeout(() => {
      modal.style.display = "none";
    }, 3000);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch(
        "https://back-end-festa-junina.onrender.com/api/Usuario/LoginUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      // === ALERT DE DEBUG ===
      // alert("Dados retornados da API:\n" + JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error("Erro do servidor:", data);
        mostrarModal("Email ou senha errados")
        return;
      }

      // === LOGIN BEM-SUCEDIDO ===
      mostrarModal(`Bem-vindo, ${data.cliente?.nome || "usuário"}!`)
      // Grava dados principais no localStorage
      localStorage.setItem("usuarioId", data.cliente?.id || "");
      localStorage.setItem("usuarioNome1", data.cliente?.nome || "");
      localStorage.setItem("usuarioEmail1",data.cliente?.email || email);
      localStorage.setItem("usuarioTelefone1", data.cliente?.telefone || "");
      localStorage.setItem("usuarioSenha1", senha);
      localStorage.setItem('tipo_perfil', data.cliente?.tipo_perfil || "");

      // Novo: pega e salva o perfil_id para controle de permissões
      const perfilId = data.perfil_id ?? data.cliente?.perfil_id ?? null;
      localStorage.setItem(
        "usuarioPerfil",
        perfilId !== null ? String(perfilId) : ""
      );

      // Lembrar usuário?
      if (lembrarCheckbox?.checked) {
        localStorage.setItem("lembrarUsuario", "true");
      } else {
        localStorage.removeItem("lembrarUsuario");
      }

      // Redireciona para a home
      setTimeout(() => {
      window.location.href = "./views/home.html";
    }, 3000);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);

    }
  });
});
