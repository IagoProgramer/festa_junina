document.addEventListener("DOMContentLoaded", function () {
  const apiBase = "https://back-end-festa-junina.onrender.com/api/Clientes";
  const urlUsuarios = `${apiBase}/CadastrarCliente`;
  const urlLogin = `${apiBase}/LoginCliente`;

  // Função para verificar se está logado
  function estaLogado() {
    return localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");
  }

  const estaNaPastaPag = window.location.pathname.includes("/pag/");
  const caminhoPerfil = estaNaPastaPag ? "./perfil.html" : "./pag/perfil.html";
  const caminhoCadastro = estaNaPastaPag ? "./cadastro.html" : "./pag/cadastro.html";

  // Botão perfil
  const botaoPerfil = document.getElementById("botao_perfil");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = estaLogado() ? caminhoPerfil : caminhoCadastro;
    });
  }

  // Verificação de login para botões de ingresso
  function validarLoginOuRedirecionar(event) {
    if (!estaLogado()) {
      event.preventDefault();
      window.location.href = caminhoCadastro;
    }
  }

  ["garanta", "ver", "garanta2", "ver2"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", validarLoginOuRedirecionar);
  });

  // Formulários
  const formRegistro = document.getElementById("registerForm");
  if (formRegistro) {
    formRegistro.addEventListener("submit", async function (event) {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const telefone = document.getElementById("telefone").value;

      try {
        const response = await fetch(urlUsuarios, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha, telefone })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Cadastro realizado com sucesso!");
          localStorage.setItem("usuarioNome", data.cliente?.nome || nome);
          localStorage.setItem("usuarioEmail", email);
          localStorage.setItem("usuarioTelefone", telefone);
          localStorage.setItem("usuarioSenha", senha);
          localStorage.setItem("idLogado", data.cliente?.id || "");

          window.location.href = "./perfil.html";
        } else {
          alert("Erro ao registrar: " + (data.message || "Verifique os dados."));
        }
      } catch (error) {
        alert("Erro na requisição: " + error.message);
      }
    });
  }

  const formLogin = document.getElementById("loginForm");
  if (formLogin) {
    formLogin.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const senha = document.getElementById("loginSenha").value;
      const lembrar = document.getElementById("lembrarUsuario")?.checked;

      try {
        const response = await fetch(urlLogin, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Bem-vindo, ${data.cliente?.nome || "usuário"}!`);
          localStorage.setItem("usuarioNome", data.cliente?.nome || "");
          localStorage.setItem("usuarioEmail", data.cliente?.email || email);
          localStorage.setItem("usuarioTelefone", data.cliente?.telefone || "");
          localStorage.setItem("usuarioSenha", senha);
          localStorage.setItem("clienteId", data.cliente?.id || "");

          lembrar
            ? localStorage.setItem("lembrarUsuario", "true")
            : localStorage.removeItem("lembrarUsuario");

          window.location.href = "../pag/perfil.html";
        } else {
          alert("Erro no login: " + (data.message || "Email ou senha incorretos."));
        }
      } catch (error) {
        alert("Erro na requisição: " + error.message);
      }
    });
  }

  const botaoEsqueciSenha = document.getElementById("esqueciSenha");
  if (botaoEsqueciSenha) {
    botaoEsqueciSenha.addEventListener("click", async function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;

      try {
        const response = await fetch(`${apiBase}/esqueci-senha`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Nova senha enviada ao seu email.");
          window.location.href = "login.html";
        } else {
          alert("Erro ao redefinir senha: " + (data.message || "E-mail não encontrado."));
        }
      } catch (error) {
        alert("Erro na requisição: " + error.message);
      }
    });
  }

  // Preencher login se lembrar estiver ativado
  if (localStorage.getItem("lembrarUsuario") === "true") {
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("loginSenha");
    const lembrarCheckbox = document.getElementById("lembrarUsuario");

    if (emailInput && senhaInput) {
      emailInput.value = localStorage.getItem("usuarioEmail") || "";
      senhaInput.value = localStorage.getItem("usuarioSenha") || "";
    }
    if (lembrarCheckbox) {
      lembrarCheckbox.checked = true;
    }
  }

  // Carregar dados no perfil
  const perfilPage = window.location.pathname.includes("perfil.html");
  if (perfilPage) {
    const nome = localStorage.getItem("usuarioNome") || "Nome não encontrado";
    const email = localStorage.getItem("usuarioEmail") || "Email não encontrado";
    const telefone = localStorage.getItem("usuarioTelefone") || "Telefone não encontrado";
    const senha = localStorage.getItem("usuarioSenha") || "Senha não encontrada";

    const setValue = (idSpan, idInput, value) => {
      const span = document.getElementById(idSpan);
      const input = document.getElementById(idInput);
      if (span) span.textContent = value;
      if (input) input.value = value;
    };

    setValue("username", null, nome);
    setValue("nome-completo", "input-nome", nome);
    setValue("email", "input-email", email);
    setValue("telefone", "input-telefone", telefone);
    setValue("senha", "input-senha", senha);
  }

  // Logout
  const botao_logout = document.getElementById("botao_logout");
  if (botao_logout) {
    botao_logout.addEventListener("click", function () {
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
