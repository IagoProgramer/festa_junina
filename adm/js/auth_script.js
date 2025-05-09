document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const lembrarCheckbox = document.getElementById("lembrarUsuario");
  const mensagemErro = document.getElementById("mensagemErroPopup");

  if (!form) return;

  function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.style.display = "block";
    mensagemErro.style.opacity = "1";
    setTimeout(() => {
      mensagemErro.style.opacity = "0";
      setTimeout(() => {
        mensagemErro.style.display = "none";
      }, 300);
    }, 4000);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch(
        "http://10.90.146.37/api/api/Usuario/LoginUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      // === ALERT DE DEBUG ===
      alert("Dados retornados da API:\n" + JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error("Erro do servidor:", data);
        mostrarErro("Email ou senha incorretos.");
        return;
      }

      // === LOGIN BEM-SUCEDIDO ===
      alert(`Bem-vindo, ${data.cliente?.nome || "usuário"}!`);

      // Grava dados principais no localStorage
      localStorage.setItem("usuarioNome", data.cliente?.nome || "");
      localStorage.setItem("usuarioEmail",data.cliente?.email || email);
      localStorage.setItem("usuarioTelefone", data.cliente?.telefone || "");
      localStorage.setItem("usuarioSenha", senha);
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
      window.location.href = "./views/home.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      mostrarErro("Erro ao se conectar. Tente novamente.");
    }
  });
});
