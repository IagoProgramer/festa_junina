const menu = document.getElementById('menu');
const opcoes = document.getElementById('menu-options2');
const mediaQuery = window.matchMedia('(max-width: 1024px)');

function abre_menu() {
    opcoes.style.display = 'grid';
    Array.from(opcoes.children).forEach(child => {
        child.style.display = 'grid';
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
        const estaAberto = opcoes.style.display === 'grid';
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

document.getElementById("toggle-senha").addEventListener("click", function (e) {
    e.preventDefault();
    const inputSenha = document.getElementById("input-senha");
    const eyeIcon = document.getElementById("eye-icon");

    if (inputSenha.type === "password") {
        inputSenha.type = "text";
        eyeIcon.src = "../img/eye-open.png";  // Ícone de olho aberto
        eyeIcon.alt = "Mostrar senha";
    } else {
        inputSenha.type = "password";
        eyeIcon.src = "../img/eye-close.png";  // Ícone de olho fechado
        eyeIcon.alt = "Esconder senha";
    }
});
