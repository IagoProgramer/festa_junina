document.addEventListener("DOMContentLoaded", () => {
    const botaoAdicionar = document.querySelector(".botao-adicionar");
    const formulario = document.querySelector(".formulario");
  
    let contadorPerguntas = 3; // Começa com 3 perguntas
  
    botaoAdicionar.addEventListener("click", () => {
      contadorPerguntas++;
  
      const novaLabel = document.createElement("label");
      novaLabel.setAttribute("for", `pergunta${contadorPerguntas}`);
      novaLabel.innerHTML = `<strong>Pergunta ${contadorPerguntas}</strong>`;
  
      const novoInput = document.createElement("input");
      novoInput.setAttribute("type", "text");
      novoInput.setAttribute("id", `pergunta${contadorPerguntas}`);
      novoInput.setAttribute("placeholder", "Digite algo...");
  
      formulario.appendChild(novaLabel);
      formulario.appendChild(novoInput);
    });
  
    // Enviar perguntas ao pressionar ENTER ou outro botão (ex: salvar)
    document.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Impede envio padrão do formulário
  
        const inputs = document.querySelectorAll(".formulario input");
        const perguntas = [];
  
        inputs.forEach(input => {
          if (input.value.trim() !== "") {
            perguntas.push({ descricao: input.value.trim() });
          }
        });
  
        if (perguntas.length === 0) {
          alert("Por favor, preencha pelo menos uma pergunta.");
          return;
        }
  
        try {
          const resposta = await fetch("https://back-end-festa-junina.onrender.com/api/Perguntas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(perguntas)
          });
  
          if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
          }
  
          alert("Perguntas enviadas com sucesso!");
          inputs.forEach(input => input.value = ""); // Limpar os campos
  
        } catch (erro) {
          console.error(erro);
          alert("Erro ao enviar perguntas. Verifique a conexão com a API.");
        }
      }
    });
  });
  