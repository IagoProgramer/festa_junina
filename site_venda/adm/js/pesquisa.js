const categorias = [
    { nome: "ENTRETENIMENTO", dados: [22.3, 56.8, 14.4, 4.0, 2.5] },
    { nome: "ATENDIMENTO", dados: [4.0, 79.7, 6.8, 5.0, 4.5] },
    { nome: "SEGURANÇA", dados: [35.4, 42.5, 16.0, 4.0, 2.1] },
    { nome: "HIGIENE", dados: [3.0, 86.1, 6.0, 2.5, 2.4] },
    { nome: "DECORAÇÃO", dados: [1.0, 91.7, 3.0, 2.0, 2.3] },
    { nome: "ORGANIZAÇÃO", dados: [32.5, 46.0, 10.0, 6.5, 5.0] },
    { nome: "COMPRA DO INGRESSO", dados: [12.0, 64.6, 14.0, 6.0, 3.4] }
  ];
  
  const comentarios = [
    "Faltou mais atrações.",
    "Muito legal! Eu amei!",
    "Poderiam ter mais banheiros.",
    "Som estava ótimo.",
    "Fila da comida muito longa.",
    "Parabéns à equipe de organização!"
  ];
  
  const cores = ["#006400", "#66bb6a", "#ffeb3b", "#ff5722", "#b71c1c"];
  const labels = ["Ótimo", "Bom", "Regular", "Ruim", "Péssimo"];
  
  const container = document.getElementById("graficos");
  
  categorias.forEach((categoria, index) => {
    const div = document.createElement("div");
    div.className = "chart-container";
  
    const title = document.createElement("div");
    title.className = "chart-title";
    title.innerText = categoria.nome;
  
    const canvas = document.createElement("canvas");
    canvas.id = `chart${index}`;
  
    div.appendChild(title);
    div.appendChild(canvas);
    container.appendChild(div);
  
    new Chart(canvas, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data: categoria.dados,
          backgroundColor: cores
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%`
            }
          }
        }
      }
    });
  });
  
  const comentariosDiv = document.getElementById("comentarios-lista");
  comentarios.forEach(texto => {
    const box = document.createElement("div");
    box.textContent = texto;
    comentariosDiv.appendChild(box);
  });
  