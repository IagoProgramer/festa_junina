// URL da API para buscar os ingressos
const urlTipo = "https://back-end-festa-junina.onrender.com/api/Ingresso";

// Seletores dos elementos HTML
const ctx = document.getElementById('grafico').getContext('2d');
const infoVendas = document.querySelector(".info-vendas");

// Mapeamento dos tipos de ingresso
const tipos = {
  1: "Alunos",
  2: "Comunidade",
  3: "Colaboradores",
  4: "Infantil",
  5: "Familiares"
};

const cores = {
  "Alunos": '#4bc0c0',
  "Familiares": '#ff6384',
  "Infantil": '#ffcd56',
  "Colaboradores": '#36a2eb',
  "Comunidade": '#9966ff'
};

// Gráfico vazio inicial
const graficoPizza = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: Object.values(tipos),
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: Object.values(cores)
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

/**
 * Função para carregar os dados dos ingressos e atualizar o gráfico e os textos.
 */
async function carregarIngressos() {
  try {
    const response = await fetch(urlTipo);
    const ingressos = await response.json();
    
    // Contagem dos ingressos por tipo
    const contagem = {
      "Alunos": 0,
      "Comunidade": 0,
      "Colaboradores": 0,
      "Infantil": 0,
      "Familiares": 0
    };

    ingressos.forEach((ingresso) => {
      const tipo = tipos[ingresso.tipo_ingresso_id];
      if (contagem[tipo] !== undefined) {
        contagem[tipo]++;
      }
    });

    // Atualiza os dados do gráfico
    graficoPizza.data.datasets[0].data = Object.values(contagem);
    graficoPizza.update();

    // Atualiza a contagem na interface
    infoVendas.innerHTML = `
      <p>Alunos: ${contagem["Alunos"]} ingressos</p>
      <p>Comunidade: ${contagem["Comunidade"]} ingressos</p>
      <p>Colaboradores: ${contagem["Colaboradores"]} ingressos</p>
      <p>Infantil: ${contagem["Infantil"]} ingressos</p>
      <p>Familiares: ${contagem["Familiares"]} ingressos</p>
      <p><strong>TOTAL: ${Object.values(contagem).reduce((a, b) => a + b, 0)} ingressos</strong></p>
    `;

  } catch (error) {
    console.error("Erro ao carregar ingressos:", error);
  }
}

// Ao carregar a página, busca os dados
document.addEventListener("DOMContentLoaded", carregarIngressos);
