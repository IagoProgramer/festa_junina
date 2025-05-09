const nome = document.getElementById("nome");
const senha = document.getElementById("senha");
const botaoLogin = document.getElementById("entrar");

botaoLogin.addEventListener("click", (event) => {
    event.preventDefault();
    FazerLogin();
});

async function FazerLogin() {
    const nomeValor = nome.value;
    const senhaValor = senha.value;

    try {
        // Verifica admin
        const adminRes = await fetch(`http://localhost:3030/admin?nome=${nomeValor}&senha=${senhaValor}`);
        const adminData = await adminRes.json();

        // Verifica usuario
        const userRes = await fetch(`http://localhost:3030/usuario?nome=${nomeValor}&senha=${senhaValor}`);
        const userData = await userRes.json();

        if (adminData.length > 0) {
            // Se for admin, redireciona para página de admin
            alert("Login como ADMIN!");
            window.location.href = `pages/admin.html?id=${adminData[0].id}`;
        } else if (userData.length > 0) {
            // Se for usuário, redireciona para página de leitor
            alert("Login como USUÁRIO!");
            window.location.href = `pages/leitor.html?id=${userData[0].id}`;
        } else {
            alert("Usuário ou senha inválidos.");
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar com o servidor.");
    }
}
