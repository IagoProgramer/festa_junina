const ctx = document.getElementById('chart').getContext('2d');

new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Comunidade', 'Alunos', 'Familiares', 'Infantil', 'Colaboradores'],
    datasets: [{
      data: [100, 90, 50, 30, 50],
      backgroundColor: ['#C2BFFF', '#339CFF', '#FF9999', '#99FF99', '#FFCC99']
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    }
  }
});
