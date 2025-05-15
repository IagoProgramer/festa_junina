function mostrarModal(mensagem, tipo = "info") {
    const modal = document.getElementById("myModal");
    const textoModal = document.getElementById("texto_modal");
    const fecharModal = document.getElementById("close_modal");

    textoModal.textContent = mensagem;

    modal.classList.remove("modal-success", "modal-error");
    if (tipo === "sucesso") modal.classList.add("modal-success");
    if (tipo === "erro") modal.classList.add("modal-error");

    modal.style.display = "block";

    fecharModal.onclick = () => {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    setTimeout(() => {
      modal.style.display = "none";
    }, 3000);
  }
function alterarQtd(item, incremento) {
    const qtdElement = document.getElementById(`qtd-${item}`);
    let qtdAtual = parseInt(qtdElement.textContent);
    let novaQtd = qtdAtual + incremento;

    if (novaQtd < 0) {
        novaQtd = 0;
    }

    // Soma total de ingressos já selecionados (antes de alterar o atual)
    let totalSelecionado = 0;
    const tipos = ['aluno', 'comunidade', 'colaborador', 'familiar', 'infantil'];

    tipos.forEach(tipo => {
        if (tipo === item) {
            totalSelecionado += novaQtd; // Considera a nova quantidade
        } else {
            const qtdTipo = parseInt(document.getElementById(`qtd-${tipo}`).textContent);
            totalSelecionado += qtdTipo;
        }
    });

    if (totalSelecionado > 5) {
        mostrarModal("Você só pode reservar até 5 ingressos por pedido")
        return; // cancela se passar do limite
    }

    qtdElement.textContent = String(novaQtd).padStart(2, '0');
}

let carrinhoItens = {};

let qtdTipos = [];

function adicionarCarrinho() {
    const alunoQtd = parseInt(document.getElementById('qtd-aluno').textContent);
    const comunidadeQtd = parseInt(document.getElementById('qtd-comunidade').textContent);
    const colaboradorQtd = parseInt(document.getElementById('qtd-colaborador').textContent);
    const familiarQtd = parseInt(document.getElementById('qtd-familiar').textContent);
    const infantilQtd = parseInt(document.getElementById('qtd-infantil').textContent);

    atualizarItemCarrinho('aluno', alunoQtd);
    atualizarItemCarrinho('comunidade', comunidadeQtd);
    atualizarItemCarrinho('colaborador', colaboradorQtd);
    atualizarItemCarrinho('familiar', familiarQtd);
    atualizarItemCarrinho('infantil', infantilQtd);

    qtdTipos = [alunoQtd,  comunidadeQtd, colaboradorQtd, familiarQtd, infantilQtd]
    atualizarListaCarrinho();
    atualizarTotal();
}

function atualizarItemCarrinho(item, quantidade) {
    if (quantidade > 0) {
        carrinhoItens[item] = quantidade;
    } else if (carrinhoItens[item]) {
        delete carrinhoItens[item];
    }
}

function removerItem(item) {
    delete carrinhoItens[item];
    const qtdElement = document.getElementById(`qtd-${item}`);
    qtdElement.textContent = '00';
    atualizarListaCarrinho();
    atualizarTotal();
}

async function atualizarListaCarrinho() {
    try {
        const urlLote = await fetch('https://back-end-festa-junina.onrender.com/api/Lote');
        const dataLote = await urlLote.json();

        const loteAtivo = dataLote.find(i => i.ativo == 1);

        const listaCarrinho = document.getElementById('lista-carrinho');
        listaCarrinho.innerHTML = '';
        for (const item in carrinhoItens) {
            let nomeItem;
            let preco;
            switch (item) {
                case 'aluno':
                    nomeItem = 'Aluno';
                    preco = loteAtivo.valor_un;
                    break;
                case 'comunidade':
                    nomeItem = 'Comunidade';
                    preco = loteAtivo.valor_un;
                    break;
                case 'colaborador':
                    nomeItem = 'Colaborador';
                    preco = loteAtivo.valor_un;
                    break;
                case 'familiar':
                    nomeItem = 'Familiar';
                    preco = loteAtivo.valor_un;
                    break;
                case 'infantil':
                    nomeItem = 'Infantil (até 10 anos)';
                    preco = 6.00;
                    break;
            }
            const li = document.createElement('li');
            li.innerHTML = `
                ${nomeItem} R$${preco.toFixed(2)} <span>${String(carrinhoItens[item]).padStart(2, '0')}</span>
                <button onclick="removerItem('${item}')">
                    <img src="../img/lixeira.png" alt="Remover" class="icone-lixeira">
                </button>
            `;
            listaCarrinho.appendChild(li);
        }
    } catch (error) {
        console.log(error)
    }
}

async function atualizarTotal() {
    const urlLote = await fetch('https://back-end-festa-junina.onrender.com/api/Lote');
    const dataLote = await urlLote.json();

    const loteAtivo = dataLote.find(i => i.ativo == 1);
    let total = 0;
    for (const item in carrinhoItens) {
        let preco;
        switch (item) {
            case 'aluno':
            case 'comunidade':
            case 'colaborador':
            case 'familiar':
                preco = loteAtivo.valor_un;
                break;
            case 'infantil':
                preco = 6.00;
                break;
        }
        total += preco * carrinhoItens[item];
    }
    document.getElementById('total').textContent = total.toFixed(2);
}

window.onload = () => {
    adicionarCarrinho();
    carregarLoteAtivo();
    carregarIngressosRestantes();
    carregarPrecos();
}

async function carregarIngressosRestantes() {
    try{
        const urlIngresso = await fetch('https://back-end-festa-junina.onrender.com/api/Ingresso');
        const dataIngresso = await urlIngresso.json();

        const urlLote = await fetch('https://back-end-festa-junina.onrender.com/api/Lote');
        const dataLote = await urlLote.json();

        const loteAtivo = dataLote.find(i => i.ativo == 1);

        if(loteAtivo == null){
            console.error("Nenhum lote ativo encontrado.");
            document.getElementById("ingressos-restantes").textContent = "Nenhum lote ativo no momento.";
            return;
        }
        
        const ingressosVendidos = dataIngresso.filter(i => (i.lote_id == loteAtivo.id));
        const ingressosRestantes = loteAtivo.qtd_total - ingressosVendidos.length;

        document.getElementById("ingressos-restantes").textContent = `${ingressosRestantes}`;

    }
    catch (error) {
        console.error("Erro ao carregar os ingressos restantes", error);
        mostrarModal("Erro ao carregar os ingressos restantes.", "erro");
    }
}

async function carregarLoteAtivo() {
    try {
        const response = await fetch("https://back-end-festa-junina.onrender.com/api/Lote");
        const data = await response.json();
        
        const valorFiltrado = data.find(i => i.ativo == 1);

        if(valorFiltrado != null){
            document.getElementById("lote-ativo").textContent = `Lote Ativo: ${valorFiltrado.id}`;
        }
        else{
            document.getElementById("lote-ativo").textContent = `Nenhum lote ativo no momento`;
        }
        // document.querySelector('.lote_ativo :nth-child(2)').textContent = `R$${precos.aluno}`;

    } catch (error) {
        console.error("Erro ao carregar os preços dos ingressos:", error);
        mostrarModal("Erro ao carregar os preços dos ingressos.", "erro");
    }
}

async function carregarPrecos() {
    try {
        const response = await fetch("https://back-end-festa-junina.onrender.com/api/Lote");
        const data = await response.json();

        const valorFiltrado = data.find(i => i.ativo == 1);

        const precos = {
            aluno: valorFiltrado.valor_un,
            comunidade: valorFiltrado.valor_un,
            colaborador: valorFiltrado.valor_un,
            familiar: valorFiltrado.valor_un,
            infantil: (valorFiltrado.valor_un / 2).toFixed(2)
        };

        document.querySelector('.item-1 span:nth-child(2)').textContent = `R$${precos.aluno}`;
        document.querySelector('.item-2 span:nth-child(2)').textContent = `R$${precos.comunidade}`;
        document.querySelector('.item-3 span:nth-child(2)').textContent = `R$${precos.colaborador}`;
        document.querySelector('.item-4 span:nth-child(2)').textContent = `R$${precos.familiar}`;
        document.querySelector('.item-5 span:nth-child(2)').textContent = `R$6`;

    } catch (error) {
        console.error("Erro ao carregar os preços dos ingressos:", error);
        mostrarModal("Erro ao carregar os preços dos ingressos.", "erro");
    }
}

async function montarPedido(quantidadeTipos) {

    quantidadeTipos = qtdTipos;

    const urlPedido = 'https://back-end-festa-junina.onrender.com/api/Ingresso/ReservaIngressos';

    const response = await fetch("https://back-end-festa-junina.onrender.com/api/Lote");
    const data = await response.json();
        
    const valorFiltrado = data.find(i => i.ativo == 1);
     
    const emailLogado = localStorage.getItem("usuarioEmail");
    const senhaLogado = localStorage.getItem("usuarioSenha");
    const idLogado = localStorage.getItem("clienteId");
    console.log("id: " + idLogado, " - Email: " + emailLogado);

    const tiposId = [1, 2, 3, 5, 4];

    const pedidos = [];

    quantidadeTipos.forEach((quantidade, index) => {
        const tipoId = tiposId[index];

        for (let i = 0; i < quantidade; i++)
        {
            pedidos.push
            ({
                id: 0,
                qrcode: "string",
                data: "2025-05-06T11:32:12.597Z",
                tipo_ingresso_id: tipoId,
                usuario_id: 1, // ou quem estiver logado
                lote_id: valorFiltrado.id,
                status_id: 0,
                cliente_id: idLogado,
                guid: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            })
        }
    });

    console.log("Pedido montado:", pedidos);

    fetch(urlPedido, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidos)
      })
        .then(response => {
            const statusOk = response.ok;
            return response.json().then(data => ({ data, statusOk }));
      })
      .then(({ data, statusOk }) => {
        console.log(data)
        if (statusOk) {
          console.log("Novo usuário:", data);
          mostrarModal("Ingressos reservados com sucesso")
          setTimeout(()=>{
                window.location.href="./qrcode.html"
            }, 3000);
        } else {
            mostrarModal("Houve algum erro ao reservar os ingressos, verifique se você está conectado a alguma conta")
        }
      })
      .catch(error => {
        mostrarModal("Houve algum erro ao reservar os ingressos, verifique se você está conectado a alguma conta")
        console.error("Erro na requisição:", error);
      });
}