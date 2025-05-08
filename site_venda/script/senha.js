// Função para tratar o envio do e-mail
function recuperarSenha() {
    const email = document.getElementById("email").value;
    const erro = document.getElementById("erro");
  
    if (email === '') {
      erro.textContent = 'Por favor, preencha o e-mail.';
    } else {
      erro.textContent = '';
  
      // Chamada à API (substitua pela URL real)
      fetch('https://back-end-festa-junina.onrender.com/api/esqueci-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
      .then(res => {
        if (res.ok) {
          // Redirecionar em caso de sucesso
          window.location.href = "confirmacao.html";
        } else {
          erro.textContent = 'Erro ao enviar. Tente novamente.';
        }
      })
      .catch(() => {
        erro.textContent = 'Erro de conexão.';
      });
    }
  }
  
  // Função para mostrar mensagem enquanto digita o e-mail
  document.getElementById("email").addEventListener("input", function() {
    const email = document.getElementById("email").value;
    const erro = document.getElementById("erro");
  
    if (email === '') {
      erro.textContent = 'Por favor, preencha o e-mail.';
    } else {
      erro.textContent = 'E-mail digitado: ' + email;
    }
  });
  