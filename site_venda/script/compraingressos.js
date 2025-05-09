// Variáveis globais
let carrinhoItens = {};
let qtdTipos = [];
let precosIngressos = {};
let ingressosRestantes = 0;

// Função para carregar os lotes ativos e definir os preços
function carregarLoteAtivo() {
    const urlLote = 'https://back-end-festa-junina.onrender.com/api/Lote';
    
   
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

                precosIngressos = {
                    aluno: loteAtivo.valor_un,
                    comunidade: loteAtivo.valor_un,
                    colaborador: loteAtivo.valor_un,
                    familiar: loteAtivo.valor_un,
                    infantil: loteAtivo.valor_un / 2
                };

                ingressosRestantes = loteAtivo.qtd_total || 0;
                atualizarIngressosRestantes();
                atualizarPrecosFront();
                atualizarListaCarrinho();
                atualizarTotal();
            } else {
                loteElement.textContent = 'Nenhum lote ativo no momento';
                ingressosRestantesElement.textContent = 'Nenhum ingresso disponível';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar lotes:', error);
        });
}

// Atualiza os preços no front-end
function atualizarPrecosFront() {
    const tipos = ['aluno', 'comunidade', 'colaborador', 'familiar', 'infantil'];

    tipos.forEach(tipo => {
        const preco = precosIngressos[tipo] || 0;
        const elementoPreco = document.getElementById(`preco-${tipo}`);
        if (elementoPreco) {
            elementoPreco.textContent = `R$ ${preco.toFixed(2)}`;
        }
    });
}

// Atualiza o lote periodicamente
function atualizarLotePeriodicamente() {
    setInterval(carregarLoteAtivo, 30000);  // a cada 30 segundos
}

// Função para alterar a quantidade de ingressos
function alterarQtd(item, incremento) {
    const qtdElement = document.getElementById(`qtd-${item}`);
    let qtdAtual = parseInt(qtdElement.textContent);
    let novaQtd = qtdAtual + incremento;
    if (novaQtd < 0) novaQtd = 0;

    let totalSelecionado = 0;
    const tipos = ['aluno', 'comunidade', 'colaborador', 'familiar', 'infantil'];
    tipos.forEach(tipo => {
        if (tipo === item) totalSelecionado += novaQtd;
        else totalSelecionado += parseInt(document.getElementById(`qtd-${tipo}`).textContent);
    });

    if (totalSelecionado > 5) {
        alert("Você só pode selecionar no máximo 5 ingressos no total.");
        return;
    }

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

// Atualiza os itens no carrinho
function atualizarItemCarrinho(item, quantidade) {
    if (quantidade > 0) {
        carrinhoItens[item] = quantidade;
    } else {
        delete carrinhoItens[item];
    }
}

// Atualiza a quantidade de ingressos restantes
function atualizarIngressosRestantes() {
    const totalSelecionado = Object.values(carrinhoItens).reduce((acc, qtd) => acc + qtd, 0);
    const ingressosRestantesElement = document.getElementById('ingressos-restantes');
    ingressosRestantesElement.textContent = ingressosRestantes - totalSelecionado;
}

// Adiciona itens ao carrinho com base nas quantidades atuais
function adicionarCarrinho() {
    const tipos = ['aluno', 'comunidade', 'colaborador', 'familiar', 'infantil'];
    qtdTipos = tipos.map(tipo => {
        const qtd = parseInt(document.getElementById(`qtd-${tipo}`).textContent);
        atualizarItemCarrinho(tipo, qtd);
        return qtd;
    });

    atualizarIngressosRestantes();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Atualiza a lista de itens no carrinho
function atualizarListaCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';

    for (const item in carrinhoItens) {
        let nomeItem = {
            aluno: 'Aluno',
            comunidade: 'Comunidade',
            colaborador: 'Colaborador',
            familiar: 'Familiar',
            infantil: 'Infantil (até 10 anos)'
        }[item];

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

// Remove item do carrinho
function removerItem(item) {
    const qtdElement = document.getElementById(`qtd-${item}`);
    qtdElement.textContent = "00";
    atualizarItemCarrinho(item, 0);
    atualizarIngressosRestantes();
    atualizarListaCarrinho();
    atualizarTotal();
}

// Atualiza o total do carrinho
function atualizarTotal() {
    let total = 0;
    for (const item in carrinhoItens) {
        const preco = precosIngressos[item] || 0;
        total += preco * carrinhoItens[item];
    }
    document.getElementById('total').textContent = total.toFixed(2);
}

// Monta e envia o pedido
// Monta e envia o pedido
function montarPedido() {
    adicionarCarrinho(); // Garante que qtdTipos esteja atualizado

    const urlPedido = 'https://back-end-festa-junina.onrender.com/api/Ingresso/ReservaIngressos';

    const tiposId = [5, 2, 1, 4, 3]; // ordem: aluno, comunidade, colaborador, familiar, infantil

    // ✅ Verifica se o ID do usuário é válido
    if (!idLogado || isNaN(parseInt(idLogado))) {
        alert("Usuário não identificado corretamente. Faça login novamente.");
        return;
    }

    const usuarioId = parseInt(idLogado);
    const loteTexto = document.getElementById('lote-ativo').textContent;
    const numeroLote = parseInt(loteTexto.match(/\d+/)?.[0]) || 1; // extrai número do lote
    const loteId = numeroLote; // você pode alterar isso se tiver o lote_id exato de outro modo

    const pedidos = [];

    qtdTipos.forEach((quantidade, index) => {
        const tipoId = tiposId[index];
        for (let i = 0; i < quantidade; i++) {
            pedidos.push({
                id: 0,
                qrcode: "",
                data: new Date().toISOString(),
                tipo_ingresso_id: tipoId,
                usuario_id: usuarioId,
                lote_id: loteId,
                status_id: 0,
                cliente_id: usuarioId,
                guid: crypto.randomUUID()
            });
        }
    });

    if (pedidos.length === 0) {
        alert("Selecione pelo menos um ingresso antes de finalizar a reserva.");
        return;
    }

    console.log("Pedido montado:", pedidos);

    fetch(urlPedido, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidos)
    })
    .then(async response => {
        const statusOk = response.ok;
        const contentType = response.headers.get("content-type");

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text(); // resposta em texto simples
        }

        return { data, statusOk };
    })
    .then(({ data, statusOk }) => {
        console.log("Resposta da API:", data);
        if (statusOk) {
            alert("Ingressos reservados com sucesso!");
            window.location.reload(); // se quiser resetar tudo após a compra
        } else {
            alert("Erro ao reservar ingressos: " + (typeof data === 'string' ? data : JSON.stringify(data)));
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado ao tentar reservar ingressos. Verifique sua conexão ou fale com o suporte.");
    });
}

// Listener do botão de finalizar
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("botao_finalizar").addEventListener("click", montarPedido);

    // Inicializa a página
    carregarLoteAtivo();
    atualizarLotePeriodicamente();
    adicionarCarrinho();
});
