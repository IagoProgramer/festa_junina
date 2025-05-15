const url = 'https://back-end-festa-junina.onrender.com/api/Lote/EditarLote';

let lotePronto = null;

const idUsuario = (localStorage.getItem("usuarioId") || "");

function salvarEdicao(){
  const valor = document.getElementById('valor').value;
  const abertura = document.getElementById('abertura').value;
  const fechamento = document.getElementById('fechamento').value;
  const quantidade = document.getElementById('quantidade').value;

  if (!valor || !abertura || !fechamento || !quantidade) {
    alert("Preencha todos os campos!");
    return;
  }

  const valorNumerico = parseFloat(valor.replace(",", "."));
  const valorInfantil = (valorNumerico / 2).toFixed(2);

  const novaLinha = `
    <tr>
      <td>R$ ${valorNumerico.toFixed(2).replace(".", ",")}</td>
      <td>R$ ${valorInfantil.replace(".", ",")}</td>
      <td>${abertura}</td>
      <td>${fechamento}</td>
      <td>${quantidade}</td>
    </tr>
  `;

  document.getElementById("tabela-corpo").innerHTML = novaLinha;

  // const usuarioId = parseInt(localStorage.getItem('usuario_id')); // pega o ID do usuário logado
  // if (!usuarioId) {
  //   alert("Usuário não está logado.");
  //   return;
  // }

  const urlParametro = new URLSearchParams(window.location.search);
  const idUrl = Number(urlParametro.get('id'));

  lotePronto = 
    {
    id: idUrl,
    qtd_total: parseInt(quantidade),
    data_inicio: new Date(abertura).toISOString(),
    data_termino: new Date(fechamento).toISOString(),
    valor_un: parseFloat(valor.replace(",", ".")),
    usuario_id: Number(idUsuario),
    ativo: 0
    };
}

function abrirmodal(){
  document.getElementById("meuModal").style.display = "flex";
  document.getElementById("modal").style.display = "flex";
}

function fecharmodal(){
  document.getElementById("meuModal").style.display = "none";
  document.getElementById("modal").style.display = "none";
}

function abrirModalErro(){
  document.getElementById("modal-erro").style.display = "flex";
  document.getElementById("modalconteudoerro").style.display = "flex";
}

function fecharModalErro(){
  document.getElementById("modal-erro").style.display = "none";
  document.getElementById("modalconteudoerro").style.display = "none";
}

function cancelar() {
  document.getElementById("valor").value = "16.00";
  document.getElementById("abertura").value = "2025-06-01";
  document.getElementById("fechamento").value = "2025-06-07";
  document.getElementById("quantidade").value = "250";
}

function salvar() {
  // if (lotePronto == null) {
  //   alert("Você precisa concluir a edição antes de salvar.");
  //   return;
  // }
  const urlParametro = new URLSearchParams(window.location.search);
  const idUrl = Number(urlParametro.get('id'));
  console.log(JSON.stringify(lotePronto, null, 2));
  fetch(`${url}/${idUrl}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lotePronto, null, 2)
  })
  .then(async response => {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text); 
    }
    const data = JSON.parse(text);
    console.log('Lote criado:', data);

    abrirmodal();

    setTimeout(() => {
      window.location.href = '../views/lotes.html'
      fecharmodal();
    }, 5000);
  })
  .catch(error => {
    console.error('Erro ao criar lote:', error);
    abrirModalErro()
    document.getElementById('mensagem-erro').innerText = error.message || 'Erro desconhecido.';
  });
}