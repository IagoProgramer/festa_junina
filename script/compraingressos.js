// Variáveis globais
let carrinhoItens = {};
let qtdTipos = [];
let precosIngressos = {};
let ingressosRestantes = 0;

// Função para carregar os lotes ativos e definir os preços
function carregarLoteAtivo() {
    const urlLote = 'http://10.90.146.37/api/api/Lote';
    
    fetch(urlLote)
        .then(response => response.json())
        .then(lotes => {
            const indexLoteAtivo = lotes.findIndex(lote => lote.ativo === 1);
            const loteElement = document.getElementById('lote-ativo');
            const ingressosRestantesElement = document.getElementById('ingressos-restantes');
            
            if (indexLoteAtivo !== -1) {
                const numeroLote = indexLoteAtivo + 1;
                const loteAtivo = lotes[indexLoteAtivo];
                
                loteElement.textContent = `Lote ${numeroLote} - Selecione a sua opção...`;
                
                // Define os preços dos ingressos com base no lote ativo
                precosIngressos = {
                    aluno: loteAtivo.valor_un,
                    comunidade: loteAtivo.valor_un,
                    colaborador: loteAtivo.valor_un,
                    familiar: loteAtivo.valor_un,
                    infantil: loteAtivo.valor_un / 2
                };

                // Define a quantidade total de ingressos restantes
                ingressosRestantes = loteAtivo.qtd_total || 0;
                atualizarIngressosRestantes();
                
                atualizarPrecosFront();  // Atualiza os preços na interface
                atualizarListaCarrinho();  // Recarrega a lista de itens no carrinho com os novos preços
                atualizarTotal();  // Atualiza o total de preços no carrinho
            } else {
                loteElement.textContent = 'Nenhum lote ativo no momento';
                ingressosRestantesElement.textContent = 'Nenhum ingresso disponível';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar lotes:', error);
        });
}

// Atualizar o lote periodicamente
function atualizarLotePeriodicamente() {
    setInterval(() => {
        carregarLoteAtivo();  // Recarrega o lote ativo
        // Aqui podemos chamar funções para atualizar o carrinho ou recalcular os totais conforme necessário
    }, 10);  // Atualiza a cada 30 segundos
}

// Inicializa a página e começa a atualização periódica
window.onload = function() {
    carregarLoteAtivo();
    atualizarLotePeriodicamente();  // Inicia a atualização periódica do lote ativo
    adicionarCarrinho();  // Adiciona os itens do carrinho
};


// Atualizar o lote periodicamente
function atualizarLotePeriodicamente() {
    setInterval(carregarLoteAtivo, 30000);  // Atualiza a cada 30 segundos
}

// Função para alterar a quantidade de ingressos
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
            totalSelecionado += novaQtd;
        } else {
            const qtdTipo = parseInt(document.getElementById(`qtd-${tipo}`).textContent);
            totalSelecionado += qtdTipo;
        }
    });

    // Verifica se excede o limite total
    if (totalSelecionado > 5) {
        alert("Você só pode selecionar no máximo 5 ingressos no total. Quando efetuado o pagamento será liberado a compra de mais");
        return;
    }

    // Verifica se ainda há ingressos suficientes
    if (ingressosRestantes - (novaQtd - qtdAtual) < 0) {
        alert("Quantidade de ingressos restantes insuficiente.");
        return;
    }

    qtdElement.textContent = String(novaQtd).padStart(2, '0');
    atualizarItemCarrinho(item, novaQtd);
    atualizarIngressosRestantes();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Função para atualizar os itens no carrinho
function atualizarItemCarrinho(item, quantidade) {
    if (quantidade > 0) {
        carrinhoItens[item] = quantidade;
    } else if (carrinhoItens[item]) {
        delete carrinhoItens[item];
    }
}

// Atualiza a quantidade de ingressos restantes
function atualizarIngressosRestantes() {
    // Calcula a quantidade total selecionada no carrinho
    const totalSelecionado = Object.values(carrinhoItens).reduce((acc, qtd) => acc + qtd, 0);
    const ingressosRestantesElement = document.getElementById('ingressos-restantes');
    ingressosRestantesElement.textContent = ingressosRestantes - totalSelecionado;
}

// Função para adicionar itens ao carrinho
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

    atualizarIngressosRestantes();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Atualiza a lista de itens no carrinho
function atualizarListaCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';
    for (const item in carrinhoItens) {
        let nomeItem;
        switch (item) {
            case 'aluno': nomeItem = 'Aluno'; break;
            case 'comunidade': nomeItem = 'Comunidade'; break;
            case 'colaborador': nomeItem = 'Colaborador'; break;
            case 'familiar': nomeItem = 'Familiar'; break;
            case 'infantil': nomeItem = 'Infantil (até 10 anos)'; break;
        }
        const preco = precosIngressos[item] || 0;
        const li = document.createElement('li');
        li.innerHTML = `
            ${nomeItem} R$${preco.toFixed(2)} <span>${String(carrinhoItens[item]).padStart(2, '0')}</span>
            <button onclick="removerItem('${item}')">
                <img src="../img/lixeira.png" alt="Remover" class="icone-lixeira">
            </button>
        `;
        listaCarrinho.appendChild(li);
    }
}

// Atualiza o total de ingressos no carrinho
function atualizarTotal() {
    let total = 0;
    for (const item in carrinhoItens) {
        const preco = precosIngressos[item] || 0;
        total += preco * carrinhoItens[item];
    }
    document.getElementById('total').textContent = total.toFixed(2);
}

function montarPedido(quantidadeTipos) {

    quantidadeTipos = qtdTipos;

    const urlPedido = 'https://back-end-festa-junina.onrender.com/api/Ingresso/ReservaIngressos';

    const emailLogado = localStorage.getItem("usuarioEmail");
    const senhaLogado = localStorage.getItem("usuarioSenha");
    const idLogado = localStorage.getItem("usuarioId");
    console.log("id: " + idLogado, " - Email: " + emailLogado);

    const tiposId = [5, 2, 1, 4, 3];

    const pedidos = [];

    quantidadeTipos.forEach((quantidade, index) => {
        const tipoId = tiposId[index];

        for (let i = 0; i < quantidade; i++)
        {
            pedidos.push({
                id: 0,
                qrcode: "string",
                data: "2025-05-06T11:32:12.597Z",
                tipo_ingresso_id: tipoId,
                usuario_id: 1, // ou quem estiver logado
                lote_id: 1,
                status_id: 0,
                cliente_id: idLogado, // ✅ Vírgula adicionada aqui
                guid: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            });
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
        console.log(data);
        if (statusOk) {
            alert("Usuário registrado com sucesso!");
            console.log("Novo usuário:", data);
        }
    }); // ✅ Fechando corretamente com ponto e vírgula
}

// Inicializa a página e começa a atualização periódica
window.onload = function() {
    carregarLoteAtivo();
    atualizarLotePeriodicamente();  // Inicia a atualização periódica do lote ativo
    adicionarCarrinho();
};