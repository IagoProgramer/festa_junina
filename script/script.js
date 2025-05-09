document.addEventListener("DOMContentLoaded", function () {
    const btnPerfil = document.querySelector(".btn-cadastro");
  
    // Verifica se o usuário está logado
    const usuarioLogado = localStorage.getItem("usuarioLogado");
  
    // Se o botão de perfil existir, adiciona ação de clique
    if (btnPerfil) {
      btnPerfil.addEventListener("click", function (e) {
        e.preventDefault(); // Impede o redirecionamento automático
  
        if (usuarioLogado === "true") {
          // Se estiver logado, vai para o perfil normalmente
          window.location.href = "pag/perfil.html";
        } else {
          // Se não estiver logado, mostra alerta e redireciona para o cadastro
          window.location.href = "pag/cadastro.html";
        }
      });
    }
  });
  