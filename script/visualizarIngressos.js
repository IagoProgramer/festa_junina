const apiBase = "https://back-end-festa-junina.onrender.com/api/Clientes";
const urlUsuarios = `${apiBase}/CadastrarCliente`;
const urlLogin = `${apiBase}/LoginCliente`;

let ingressoIdParaDeletar = null;
let ingressoGuidParaDeletar = null;

function mostrarModal(mensagem, tipo = "info", ingressoId = null, ingressoGuid = null) {
    const modal = document.getElementById("myModal");
    const textoModal = document.getElementById("texto_modal");
    const fecharModal = document.getElementById("close_modal");
    const botaoOk = document.getElementById("botao_ok");

    textoModal.textContent = mensagem;

    modal.classList.remove("modal-success", "modal-error");
    if (tipo === "sucesso") modal.classList.add("modal-success");
    if (tipo === "erro") modal.classList.add("modal-error");

    modal.style.display = "block";

    ingressoIdParaDeletar = ingressoId
    ingressoGuidParaDeletar = ingressoGuid

    fecharModal.onclick = () => {
        modal.style.display = "none";
    };
    window.onclick = function (event) {
        if (event.target === modal) {
        modal.style.display = "none";
        }
    };

    botaoOk.onclick = async function () {
        if (ingressoIdParaDeletar !== null) {
            await deletarIngresso(ingressoIdParaDeletar, ingressoGuidParaDeletar);
            ingressoIdParaDeletar = null;
            ingressoGuidParaDeletar = null;
            modal.style.display = "none";
        }
    };
}

function abrirModal(id, guid) {
    ingressoIdParaDeletar = id;
    ingressoGuidParaDeletar = guid;
    document.getElementById("myModal").style.display = "block";
}

// Fechar o modal sem excluir
document.getElementById("botao_cancelar").onclick = () => {
    document.getElementById("myModal").style.display = "none";
    ingressoIdParaDeletar = null;
    ingressoGuidParaDeletar = null;
};

// Confirmar e excluir o ingresso
document.getElementById("botao_confirmar").onclick = async () => {
    if (ingressoIdParaDeletar !== null) {
        await deletarIngresso(ingressoIdParaDeletar, ingressoGuidParaDeletar);
        ingressoIdParaDeletar = null;
        ingressoGuidParaDeletar = null;
        document.getElementById("myModal").style.display = "none";
    }
};

// Mova a função deletarIngresso para o escopo global
async function deletarIngresso(id, guid) {
    try {
        const response = await fetch(`https://back-end-festa-junina.onrender.com/api/Ingresso/CancelarIngresso/${id}/${guid}`, {
            method: "DELETE"
        });

        if (response.ok) {
            visualizarIngresso(); // recarrega os ingressos após a exclusão
        } else {
            const erro = await response.json();
        }
    } catch (error) {

    }
}

// Sua função visualizarIngresso permanece a mesma
async function visualizarIngresso() {
    try {
        const idLogado = localStorage.getItem("clienteId");

        const urlIngressos = `https://back-end-festa-junina.onrender.com/api/Ingresso/ConsultarIngresso/${idLogado}`;
        const urlUsuarios = `https://back-end-festa-junina.onrender.com/api/Usuario`;
        const urlLotes = `https://back-end-festa-junina.onrender.com/api/Lote`;

        // Faz as duas requisições em paralelo
        const [resIngressos, resUsuarios, resLotes] = await Promise.all([
            fetch(urlIngressos),
            fetch(urlUsuarios),
            fetch(urlLotes)
        ]);

        const ingressos = await resIngressos.json();
        const usuarios = await resUsuarios.json();
        const lotes = await resLotes.json();


        if (resIngressos.ok && resUsuarios.ok) {
            console.log("Ingressos:", ingressos);
            console.log("Usuários:", usuarios);
            console.log("Usuários:", lotes);

            const container = document.querySelector(".container");
            container.innerHTML = ""; // limpa os cards antigos

            ingressos.forEach(ingresso => {
                // Busca o nome do usuário correspondente ao usuario_id
                const usuario = usuarios.find(u => u.id === ingresso.usuario_id);
                const nomeUsuario = usuario ? usuario.nome : "Usuário Desconhecido";

                const lote = lotes.find(l => l.id === ingresso.lote_id);
                const valorUn = lote ? lote.valor_un.toFixed(2) : "10,00";
                const numeroLote = lote ? lote.nome || lote.id : ingresso.lote_id;

                let tipo = "";
                let statusClass = "";
                switch (ingresso.status_id) {
                    case 1:
                        tipo = "pendente";
                        statusClass = "pendente";
                        break;
                    case 2:
                        tipo = "pago";
                        statusClass = "pago";
                        break;
                    case 3:
                    default:
                        tipo = "cancelado";
                        statusClass = "cancelado";
                        break;
                }

                const card = document.createElement("div");
                card.className = "card-ingresso";

                if (ingresso.tipo_ingresso_id == 4){
                        if (tipo == "pago") {
                        card.innerHTML = `
                            <div class="card-topo">Ingressos Adquiridos</div>
                            <div class="card-conteudo">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="https://back-end-festa-junina.onrender.com/qrcodes/${ingresso.qrcode}.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$6.00</span></p>
                                <div class="btns"> 
                                    <button onclick="abrirModal(${ingresso.id}, '${ingresso.guid}')">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>
                        `;
                        container.appendChild(card);
                    } else if (tipo == "pendente") {
                        card.innerHTML = `
                            <div class="card-topo">Ingressos Adquiridos</div>
                            <div class="card-conteudo">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="../img/qrcodeBorrado.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$6.00</span></p>
                                <div class="btns">  
                                    <button onclick="abrirModal(${ingresso.id}, '${ingresso.guid}')">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>
                        `;
                        container.appendChild(card);
                    } else if(tipo == "cancelado") {
                        card.innerHTML = `
                        <div class="card-topo2">Ingressos Adquiridos</div>
                            <div class="card-conteudo2">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="../img/a64784b6-eb50-4131-a1af-2694027ee471.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$6.00</span></p>
                                <div class="btns">  
                                    <button id="botao_cancelar">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>`;
                    }
                }
                else if (ingresso.tipo_ingresso_id != 4){
                        if (tipo == "pago") {
                        card.innerHTML = `
                            <div class="card-topo">Ingressos Adquiridos</div>
                            <div class="card-conteudo">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="https://back-end-festa-junina.onrender.com/qrcodes/${ingresso.qrcode}.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$${lote.valor_un?.toFixed(2) || "10,00"}</span></p>
                                <div class="btns"> 
                                    <button onclick="abrirModal(${ingresso.id}, '${ingresso.guid}')">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>
                        `;
                        container.appendChild(card);
                    } else if (tipo == "pendente") {
                        card.innerHTML = `
                            <div class="card-topo">Ingressos Adquiridos</div>
                            <div class="card-conteudo">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="../img/qrcodeBorrado.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$${lote.valor_un?.toFixed(2) || "10,00"}</span></p>
                                <div class="btns">  
                                    <button onclick="abrirModal(${ingresso.id}, '${ingresso.guid}')">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>
                        `;
                        container.appendChild(card);
                    } else if(tipo == "cancelado") {
                        card.innerHTML = `
                        <div class="card-topo2">Ingressos Adquiridos</div>
                            <div class="card-conteudo2">
                                <p>PDV: <span id="nome">${nomeUsuario}</span></p>
                                <img src="../img/a64784b6-eb50-4131-a1af-2694027ee471.png" alt="QR Code" id="qrcode">
                                <p class="status ${statusClass}">Pedido ${tipo}</p>
                                <p><span id="lote">${ingresso.lote_id || "1"}º Lote</span><br>
                                <span id="valor">R$${lote.valor_un?.toFixed(2) || "10,00"}</span></p>
                                <div class="btns">  
                                    <button id="botao_cancelar">Cancelar</button>
                                </div>
                                <p class="aviso">*Trazer documento com foto no dia da festa*</p>
                            </div>`;
                    }
                }
            });
        } else {

        }
    } catch (error) {
        console.error("Erro na requisição:", error);

    }
}

visualizarIngresso();
