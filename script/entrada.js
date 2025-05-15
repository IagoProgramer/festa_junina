document.addEventListener("DOMContentLoaded", function () {
  const apiBase = "https://back-end-festa-junina.onrender.com/api/Clientes";
  const urlUsuarios = `${apiBase}/CadastrarCliente`;
  const urlLogin = `${apiBase}/LoginCliente`;

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
  const estaNaPastaPag = window.location.pathname.includes("/pag/");
  const caminhoPerfil = estaNaPastaPag ? "./perfil.html" : "./pag/perfil.html";
  const caminhoCadastro = estaNaPastaPag ? "./cadastro.html" : "./pag/cadastro.html";
  function estaLogado() {
  return localStorage.getItem("usuarioEmail") && localStorage.getItem("usuarioSenha");
}
  const botaoPerfil = document.getElementById("botao_perfil");
  if (botaoPerfil) {
    botaoPerfil.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = estaLogado() ? caminhoPerfil : caminhoCadastro;
    });
  }

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

  async function fazerLogin(email, senha, redirecionar = true) {
    try {
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.cliente) {
        localStorage.setItem("usuarioNome", data.cliente.nome || "");
        localStorage.setItem("usuarioEmail", data.cliente.email || email);
        localStorage.setItem("usuarioTelefone", data.cliente.telefone || "");
        localStorage.setItem("usuarioSenha", senha);
        localStorage.setItem("clienteId", data.cliente.id || "");

        mostrarModal("Você entrou na sua conta com sucesso!", "sucesso");

        if (redirecionar) {
          setTimeout(() => {
            window.location.href = caminhoPerfil;
          }, 3000);
        }
        return true;
      } else {
        mostrarModal("Email ou senha incorretos. Tente novamente.", "erro");
        return false;
      }
    } catch (error) {
      mostrarModal("Erro ao tentar fazer login. Verifique sua conexão.", "erro");
      return false;
    }
  }

  const formRegistro = document.getElementById("registerForm");
  if (formRegistro) {
    formRegistro.addEventListener("submit", async function (event) {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const confirmaSenha = document.getElementById("confirmSenha").value;
      const telefone = document.getElementById("telefone").value;

      if(senha == confirmaSenha){
        try {
          const response = await fetch(urlUsuarios, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, telefone })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            await fazerLogin(email, senha, false);
            mostrarModal("Cadastro realizado com sucesso!", "sucesso");
            setTimeout(() => {
              window.location.href = "../pag/compraingresso.html";
            }, 3000);
          } else {
            mostrarModal("Seu cadastro deu errado. Verifique os dados e tente novamente.", "erro");
          }
        } catch (error) {
          mostrarModal("Erro de conexão ao tentar cadastrar. Tente novamente.", "erro");
        }
      }
      else{
        mostrarModal("Senhas não coincidem, tente novamente", "erro");
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

      const sucesso = await fazerLogin(email, senha, true);
      if (sucesso && lembrar) {
        localStorage.setItem("lembrarUsuario", "true");
      } else {
        localStorage.removeItem("lembrarUsuario");
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
          mostrarModal("Link de recuperação enviado para seu email, pode demorar demorar para o email de recupeção para chegar o email", "sucesso");
        } else {
          mostrarModal("Erro ao solicitar nova senha. Verifique ou insira o email.", "erro");
        }
      } catch (error) {
        mostrarModal("Erro de conexão ao solicitar nova senha.", "erro");
      }
    });
  }

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

  const botao_logout = document.getElementById("botao_logout");
  if (botao_logout) {
    botao_logout.addEventListener("click", function () {
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
