const menu = document.getElementById('menu');
const opcoes = document.getElementById('menu-options2');
const mediaQuery = window.matchMedia('(max-width: 430px)');

function abre_menu() {
    opcoes.style.display = 'flex';
    Array.from(opcoes.children).forEach(child => {
        child.style.display = 'flex';
    });
}

function fecha_menu() {
    opcoes.style.display = 'none';
    Array.from(opcoes.children).forEach(child => {
        child.style.display = 'none';
    });
}

function toggle_menu() {
    if (mediaQuery.matches) {
        const estaAberto = opcoes.style.display === 'flex';
        if (estaAberto) {
            fecha_menu();
        } else {
            abre_menu();
        }
    }
}

// Ouvinte para clique no botão do menu
menu.addEventListener('click', toggle_menu);

// Ouvinte para mudanças na tela (por exemplo, redimensionamento)
mediaQuery.addEventListener('change', function (e) {
    // Quando a tela muda de tamanho, sempre fechamos o menu visualmente.
    fecha_menu();
});
