// URLs das APIs
const urlPerguntas = `https://back-end-festa-junina.onrender.com/api/Perguntas`;
const urlContagemRespostas = `https://back-end-festa-junina.onrender.com/api/Respostas/ContagemRespostas`;
const urlRespostas = `https://back-end-festa-junina.onrender.com/api/Respostas`;

// Elementos do DOM
const container = document.getElementById("graficos");
const comentariosDiv = document.getElementById("comentarios-lista");

// Cores e Labels para os gráficos
const cores = ["#006400", "#66bb6a", "#ffeb3b", "#ff5722", "#b71c1c"];
const labels = ["Ótimo", "Bom", "Regular", "Ruim", "Péssimo"];

/**
 * Função responsável por criar um gráfico de pizza (Pie Chart) para uma determinada pergunta.
 * 
 * @param {string} pergunta - O título da pergunta que será exibido acima do gráfico.
 * @param {Array<number>} dados - Os valores de cada categoria (ótimas, boas, regular, ruins, péssimo).
 * @param {number} index - O índice para definir um ID único para cada gráfico.
 */
function criarGrafico(pergunta, dados, index) {
  const div = document.createElement("div");
  div.className = "chart-container";

  const title = document.createElement("div");
  title.className = "chart-title";
  title.innerText = pergunta;

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
        data: dados,
        backgroundColor: cores
      }]
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}`
          }
        }
      }
    }
  });
}

/**
 * Função principal que carrega perguntas, respostas e cria gráficos e comentários.
 */

const respostasBox = document.querySelector(".respostas-box h2");

async function carregarDados() {
  try {
    // Fetch das Perguntas e Respostas
    const [perguntasResponse, contagemResponse, respostasResponse] = await Promise.all([
      fetch(urlPerguntas),
      fetch(urlContagemRespostas),
      fetch(urlRespostas)
    ]);

    const perguntas = await perguntasResponse.json();
    const contagemRespostas = await contagemResponse.json();
    const respostas = await respostasResponse.json();

    respostasBox.textContent = respostas.length;

    console.log("🔎 Perguntas:", perguntas); // Log para debug
    console.log("🔎 Contagem de Respostas:", contagemRespostas); // Log para debug
    console.log("🔎 Respostas:", respostas); // Log para debug

    // FILTRAR PERGUNTAS DO TIPO 2 (Comentários Opcionais)
    const perguntasTipo2 = perguntas.filter(p => p.tipo_perguntas_id === 2);
    console.log("📝 Perguntas do Tipo 2:", perguntasTipo2); // Log para debug

    comentariosDiv.innerHTML = ""; // Limpa o conteúdo anterior

    perguntasTipo2.forEach(pergunta => {
      // Verifica se existem respostas para a pergunta específica
      const respostasFiltradas = respostas.filter(r => r.perguntas_id === pergunta.id);
      console.log(`🗒️ Respostas para a pergunta "${pergunta.nome}":`, respostasFiltradas);

      if (respostasFiltradas.length > 0) {
        // Adiciona título da pergunta
        const tituloPergunta = document.createElement("h3");
        tituloPergunta.innerText = pergunta.nome;
        comentariosDiv.appendChild(tituloPergunta);

        // Adiciona cada resposta como um item
        respostasFiltradas.forEach(resposta => {
          const respostaElemento = document.createElement("p");
          respostaElemento.textContent = resposta.resposta;
          comentariosDiv.appendChild(respostaElemento);
        });
      } else {
        console.log(`⚠️ Não há respostas para a pergunta: "${pergunta.nome}"`);
      }
    });

    // CRIAR GRÁFICOS PARA TODAS AS PERGUNTAS
    container.innerHTML = ""; // Limpa os gráficos anteriores

    contagemRespostas.forEach((item, index) => {
      const dadosGrafico = [item.otimas, item.boas, item.regular, item.ruins, item.pessimo];
      criarGrafico(item.pergunta, dadosGrafico, index);
    });

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar os dados.");
  }
}

// Carregar os gráficos e comentários ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarDados);
