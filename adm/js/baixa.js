function alterarStatus(pedidoId, guid) {
  // Endpoints para alterar o status
  const urlPedido = `https://back-end-festa-junina.onrender.com/api/Pedidos/AlterarStatus/${pedidoId}`;

  // Alteração do status do pedido
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status_id: 2 // Novo status para o pedido (exemplo: "Confirmado")
    })
  };

  // Primeiramente, alteramos o status do pedido
  fetch(urlPedido, requestOptions)
    .then(resPedido => {
      if (!resPedido.ok) {
        throw new Error("Erro ao alterar o status do pedido");
      }

      // Agora, alteramos o status de todos os ingressos com o mesmo GUID
      const ingressosComMesmoGuid = usuarios
        .flatMap(user => user.ingressos)
        .filter(ingresso => ingresso.guid === guid);

      // Cria um array de promessas de requisições para alterar o status dos ingressos
      const ingressosPromises = ingressosComMesmoGuid.map(ingresso => {
        return fetch(`https://back-end-festa-junina.onrender.com/api/Ingresso/AlterarStatus/${ingresso.id}`, requestOptions);
      });

      // Executa todas as requisições de alteração de status de ingressos em paralelo
      return Promise.all(ingressosPromises);
    })
    .then(() => {
      alert("Status alterado com sucesso!");
      carregarUsuarios(); // Recarrega os usuários para refletir as alterações
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert("Erro ao processar a alteração.");
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const btnFiltro = document.getElementById('btn-filtro');
  const dropdownContent = document.getElementById('dropdown-filtro');
  const lista = document.getElementById('lista-pagamentos');
  let usuarios = [];

  btnFiltro.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });

  window.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target) && e.target !== btnFiltro) {
      dropdown.classList.remove('show');
    }
  });

  function renderLista(filtrados = usuarios) {
    lista.innerHTML = "";
    filtrados.forEach((user) => {
      const li = document.createElement("li");
      li.className = "item-lista";

      li.innerHTML = `
        <span>${user.email}</span>
        <span>${user.ingressos.length} ingressos</span>
        <span class="status-label ${user.statusTexto.toLowerCase()}" style="cursor:pointer;" onclick="alterarStatus(${user.id}, '${user.ingressos[0]?.guid}')">
          ${user.statusTexto}
        </span>
      `;

      lista.appendChild(li);
    });
  }

  function carregarUsuarios() {
    // Executa as três requisições em paralelo
    Promise.all([
      fetch('https://back-end-festa-junina.onrender.com/api/Pedidos').then(res => res.json()),
      fetch('https://back-end-festa-junina.onrender.com/api/Ingresso').then(res => res.json()),
      fetch('https://back-end-festa-junina.onrender.com/api/Usuario').then(res => res.json())
    ])
      .then(([pedidos, ingressos, usuarios]) => {
        // Mapeia os usuários por ID para acesso rápido
        const usuariosMap = {};
        usuarios.forEach(usuario => {
          usuariosMap[usuario.id] = usuario.email;
        });
  
        // Mapeia os ingressos por GUID (pedido)
        const ingressosPorPedido = {};
        ingressos.forEach(ingresso => {
          const guid = ingresso.guid;
          if (!ingressosPorPedido[guid]) {
            ingressosPorPedido[guid] = [];
          }
          ingressosPorPedido[guid].push(ingresso);
        });
  
        // Agrupa os pedidos com os ingressos e usuário
        const pedidosAgrupados = pedidos.map(pedido => {
          const ingressosDoPedido = ingressosPorPedido[pedido.guid] || [];
          
          // Obtém o usuario_id do primeiro ingresso relacionado ao pedido
          const usuarioId = ingressosDoPedido.length > 0 ? ingressosDoPedido[0].usuario_id : null;
  
          return {
            id: pedido.id,
            data: pedido.data,
            valor: pedido.valor,
            guid: pedido.guid,
            usuarioId: usuarioId,
            email: usuarioId ? usuariosMap[usuarioId] || `Usuário ${usuarioId}` : "Não encontrado",
            status_id: pedido.status_id,
            statusTexto: pedido.status_id === 1 ? "Pendente" : "Confirmado",
            quantidadeIngressos: ingressosDoPedido.length,
            ingressos: ingressosDoPedido
          };
        });
  
        renderLista(pedidosAgrupados);
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        alert("Erro ao carregar dados.");
      });
  }

  // Filtro funcional
  document.querySelectorAll('.filtro-status').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-status').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const status = btn.dataset.status;
      const filtrados = usuarios.filter(user => user.statusTexto.toLowerCase() === status);
      renderLista(filtrados);
      dropdown.classList.remove('show');
    });
  });

  carregarUsuarios();
});
