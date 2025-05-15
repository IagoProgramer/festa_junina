document.addEventListener("DOMContentLoaded", () => {
  const perfilUsuario = (localStorage.getItem("tipo_perfil") || "").trim().toLowerCase();

  if (perfilUsuario !== "1") {
    alert("Acesso restrito! Somente os usuários com perfil de nível máximo têm acesso");
    window.location.href = "../views/home.html"; // redireciona para a home
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

  fetch("https://back-end-festa-junina.onrender.com/api/Usuario/CadastroUser", {
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
