function adicionarLote() {
  const valor = document.getElementById('valor').value;
  const abertura = document.getElementById('abertura').value;
  const fechamento = document.getElementById('fechamento').value;
  const quantidade = document.getElementById('quantidade').value;

  if (!valor || !abertura || !fechamento || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const valorNumerico = parseFloat(valor.replace("R$", "").replace(",", "."));
  const valorInfantil = (valorNumerico * 0.5).toFixed(2);

  const payload = {
    id: 0,
    qtd_total: parseInt(quantidade),
    data_inicio: new Date(abertura).toISOString(),
    data_termino: new Date(fechamento).toISOString(),
    valor_un: valorNumerico,
    usuario_id: 1,
    ativo: 1
  };

  fetch("http://10.90.146.37/api/api/Lote/CadastrarLote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao cadastrar lote.");
      return response.json();
    })
    .then(data => {
      alert("Lote cadastrado com sucesso!");
      window.location.href = `../views/lotes.html?created=true&id=${data.id}`;
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Falha ao cadastrar lote.");
    });
}

function concluir() {
  adicionarLote(); // chama a função de cadastro
}

function cancelar() {
  document.getElementById("valor").value = "";
  document.getElementById("abertura").value = "";
  document.getElementById("fechamento").value = "";
  document.getElementById("quantidade").value = "";
}
// Função para destacar o lote recém-criado
function destacarLoteCriado() {
  const params = new URLSearchParams(window.location.search);
  const criado = params.get('created');
  const id = params.get('id');

  if (criado === 'true' && id) {
    const card = document.querySelector(`[data-lote-id="${id}"]`);
    if (card) {
      card.classList.add('lote-destaque');
      // rola até o lote
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Chame esta função após renderizar os lotes
destacarLoteCriado();
