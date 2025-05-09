const ctx = document.getElementById('graficoPizza').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pessoas que não compareceram', 'Pessoas que compareceram'],
        datasets: [{
          data: [420, 199],
          backgroundColor: ['#e53935', '#4CAF50'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = 619;
                const value = context.parsed;
                const percent = ((value / total) * 100).toFixed(1);
                return `${value} (${percent}%)`;
              }
            }
          }
        }
      }
    });
 