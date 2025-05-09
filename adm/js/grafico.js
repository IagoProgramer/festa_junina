const ctx = document.getElementById('grafico').getContext('2d');

const graficoPizza = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Alunos', 'Familiares', 'Infantil', 'Colaboradores', 'Comunidade'],
    datasets: [{
      data: [90, 50, 30, 50, 100],
      backgroundColor: [
        '#4bc0c0',
        '#ff6384',
        '#ffcd56',
        '#36a2eb',
        '#9966ff'
      ]
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
