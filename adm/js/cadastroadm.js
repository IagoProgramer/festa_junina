document.addEventListener("DOMContentLoaded", () => {
  const nomeUsuario = (localStorage.getItem("nomeUsuario") || "").trim().toLowerCase();

  if (nomeUsuario !== "roberto") {
    alert("Acesso restrito! Somente o usuário 'roberto' pode acessar esta página.");
    window.location.href = "../index.html"; // redireciona para a home ou login
  }
});

document.getElementById("adminForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = e.target.nome.value.trim();
  const email = e.target.email.value.trim();
  const senha = e.target.senha.value;
  const confirmaSenha = e.target.confirmaSenha.value;
  const telefone = e.target.telefone.value.trim();
  
  if (!nome || !email || !telefone || !senha || !confirmaSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmaSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  const novoAdmin = {
    nome,
    email,
    senha,
    telefone,
    perfil_id: 2
  };

  console.log("Enviando para a API:", novoAdmin);

  fetch("http://10.90.146.37/api/api/Usuario/CadastroUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoAdmin)
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error("Erro: " + response.status + " - " + text);
        });
      }
      return response.json();
    })
    .then(data => {
      alert("Administrador cadastrado com sucesso!");
      window.location.href = "../gerenciamento/listagemadm.html";
    })
    .catch(error => {
      console.error("Erro ao cadastrar administrador:", error);
      alert("Erro ao cadastrar administrador:\n" + error.message);
    });
});
