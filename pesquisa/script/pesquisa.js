// const urlPerguntas = 'http://localhost:3000/perguntas'; // ENDPOINT DAS PERGUNTAS FAKE
// const urlRespostas = 'http://localhost:3000/respostas'; 

const urlPerguntas = 'http://10.90.146.37/api/api/Perguntas';
const urlRespostas = 'http://10.90.146.37/api/api/Respostas/CadastrarRespostas'

class Perguntas {
    constructor(id, nome, tipo_perguntas_id) {
        this.id = id;
        this.nome = nome;
        this.tipo_perguntas_id = tipo_perguntas_id;
    }
}

const respostasUsuario = [];
let perguntas = []


//função que vai trazer as perguntas e carregar os rostos
function carregarPerguntas() {
    const container = document.getElementById('container-perguntas');

    fetch(urlPerguntas)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {

                const pergunta = new Perguntas(item.id, item.nome, item.tipo_perguntas_id);
                perguntas.push(pergunta);

                if (pergunta.tipo_perguntas_id === 1) {
                    const perguntaDiv = document.createElement('div');
                    perguntaDiv.classList.add('pergunta');

                    const p = document.createElement('p');
                    p.textContent = pergunta.nome.toUpperCase();

                    const opcoes = [
                        { imagem: './img/muitoruim.png', texto: 'Muito Ruim' },
                        { imagem: './img/ruim.png', texto: 'Ruim' },
                        { imagem: './img/intermediario.png', texto: 'Intermediário' },
                        { imagem: './img/bom.png', texto: 'Bom' },
                        { imagem: './img/muitobom.png', texto: 'Muito Bom' }
                    ];

                    const avaliacaoDiv = document.createElement('div');
                    avaliacaoDiv.classList.add('avaliacao');

                    opcoes.forEach((opcao, index) => {
                        const span = document.createElement('span');
                        span.classList.add('emoji');
                        span.dataset.resposta = opcao.texto;

                        const img = document.createElement('img');
                        img.src = opcao.imagem;
                        img.alt = opcao.texto;
                        img.style.width = '80px';
                        img.style.height = '80px';

                        span.appendChild(img);

                        span.addEventListener('click', () => {
                            const todos = avaliacaoDiv.querySelectorAll('.emoji');

                            todos.forEach(e => {
                                e.classList.remove('selecionado');
                                const imgInterno = e.querySelector('img');
                                const baseNome = imgInterno.dataset.base;
                                imgInterno.src = `./img/${baseNome}`; // volta pra imagem original
                            });

                            span.classList.add('selecionado');

                            // trocndo pra imagem colorida qnd clica
                            const baseNome = opcao.imagem.replace('.png', '');
                            img.src = `./${baseNome}-colorido.png`;

                            const indiceExistente = respostasUsuario.findIndex(r => r.perguntaId === pergunta.id);
                            if (indiceExistente !== -1) {
                                respostasUsuario.splice(indiceExistente, 1);
                            }

                            respostasUsuario.push({
                                perguntaId: pergunta.id,
                                resposta: span.dataset.resposta
                            });

                            console.log(respostasUsuario);
                        });

                        img.dataset.base = opcao.imagem.split('/').pop();

                        avaliacaoDiv.appendChild(span);
                    });

                    perguntaDiv.appendChild(p);
                    perguntaDiv.appendChild(avaliacaoDiv);
                    container.appendChild(perguntaDiv);
                }
                
                if(pergunta.tipo_perguntas_id == 2) {
                    const comentDiv = document.createElement('div');
                    comentDiv.classList.add('texto');
                
                    const h1 = document.createElement('h1');
                    h1.textContent = pergunta.nome.toUpperCase(); 
                
                    const coment = document.createElement('textarea');
                    coment.id = pergunta.id;
                    coment.className = 'comentario';
                    coment.placeholder = 'Digite algo...';

                    comentDiv.appendChild(h1);
                    comentDiv.appendChild(coment);

                    container.appendChild(comentDiv);
                }                
            });
        })
        .catch(error => console.error("ERRO NA API:", error));

    // const perguntaComentario = new Perguntas(3, "Comentário opcional", null); // usa um ID fixo que não conflita
    // perguntas.push(perguntaComentario);
    

}               

//executando a funçao qnd a pagina carrega
document.addEventListener("DOMContentLoaded", function () {
    carregarPerguntas();
});

const modal = document.getElementById('confirmationModal');
const modal2 = document.getElementById('modal-content');

// function showModal() { //para mostrar o modal, a função será executada quando os dados forem enviados para api
//     modal.style.display = 'flex';
//     modal2.style.display = 'flex'
// }

async function enviar(event) {
    event.preventDefault();

    try {
        const totalPerguntas = perguntas.length;
        const totalRespondidas = respostasUsuario.length;

        const perguntasUnicas = [...new Set(respostasUsuario.map(r => r.perguntaId))];


        //const comentario = document.getElementById('comentario').value.trim();

        //const comentario = document.getElementById('comentario').value.trim();

        //erro ta aqui
        //const idPerguntaComentario = 3;
        //const totalObrigatorias = idPerguntaComentario ? totalPerguntas - 1 : totalPerguntas;

        //console.log(perguntas)

        // if (perguntasUnicas.length < totalObrigatorias) {
        //     alert("Responda todas as perguntas antes de enviar.");
        //     return;
        // }

        // //Se tiver comentário, adiciona como resposta normal
        // if (comentario !== "" && idPerguntaComentario) {
        //     respostasUsuario.push({
        //         perguntaId: idPerguntaComentario,
        //         resposta: comentario
        //     });
        // }

        const listaRespostasDissertativas = document.querySelectorAll("textarea")
        
        listaRespostasDissertativas.forEach(i => {
            console.log(i.id)
            respostasUsuario.push({"perguntaId": parseInt(i.id), "resposta": i.value})
        })
        
        console.log(respostasUsuario)
        
        const dataAtual = new Date().toISOString();

        const respostasFormatadas = respostasUsuario.map(r => ({
            id: 0, 
            resposta: r.resposta,
            data: dataAtual,
            perguntas_id: r.perguntaId
        }));
        
        console.log("Respostas formatadas:", respostasFormatadas);
        
        const payload = JSON.stringify(respostasFormatadas);

        console.log(payload)

        await fetch(urlRespostas, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })
        .then(response => {
            if (response.ok) {

                modal.style.display = 'flex';
                modal2.style.display = 'flex';

            } else {
                alert("Erro ao enviar respostas.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro:", error.message);
        });
    } catch (error) {
        alert("Error" + error.message)

    }



}

//enviar pra api qnd clicar no botao
// document.getElementById('enviarRespostas').addEventListener('click', (event) => {
//     event.preventDefault();

//     const totalPerguntas = perguntas.length;
//     const totalRespondidas = respostasUsuario.length;

//     const perguntasUnicas = [...new Set(respostasUsuario.map(r => r.perguntaId))];

//     // Pega o texto do campo de comentário
//     const comentario = document.getElementById('comentario').value.trim();

//     // Verifica se todas as perguntas obrigatórias foram respondidas
//     // Comentário é opcional, então não entra nessa contagem
//     const idPerguntaComentario = perguntas.find(p => p.nome.toLowerCase().includes('comentário'))?.id;
//     const totalObrigatorias = idPerguntaComentario ? totalPerguntas - 1 : totalPerguntas;

//     console.log(perguntas)

//     // if (perguntasUnicas.length < totalObrigatorias) {
//     //     alert("Responda todas as perguntas antes de enviar.");
//     //     return;
//     // }

//     // Se tiver comentário, adiciona como resposta normal
//     // if (comentario !== "" && idPerguntaComentario) {
//     //     respostasUsuario.push({
//     //         perguntaId: idPerguntaComentario,
//     //         resposta: comentario
//     //     });
//     // }

//     const payload = {
//         respostas: respostasUsuario
//     };

//     console.log(payload)

//     fetch('http://localhost:3000/respostas', {
//         method: 'POST', redirect: 'manual',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//     })
//     .then(response => {
//         if (response.ok) {

//             modal.style.display = 'flex';
//             modal2.style.display = 'flex';
//             console.log("mostrei o modal")
//             //window.location.href = ''

//             // showModal(); //deu certo? então mostrei o modal
//         } else {
//             alert("Erro ao enviar respostas.");
//         }
//     })
//     .catch(error => {
//         console.error("Erro:", error);
//         alert("Erro:", error);
//     });

//     // fetch(url)
//     //      .then(response => response.json())
//     //      .then(perguntas => {
//     //         const totalPerguntas = perguntas.length;
//     //         const totalRespondidas = respostasUsuario.length;

//     //         const perguntasUnicas = [...new Set(respostasUsuario.map(r => r.perguntaId))];

//     //         // Pega o texto do campo de comentário
//     //         const comentario = document.getElementById('comentario').value.trim();

//     //         // Verifica se todas as perguntas obrigatórias foram respondidas
//     //         // Comentário é opcional, então não entra nessa contagem
//     //         const idPerguntaComentario = perguntas.find(p => p.nome.toLowerCase().includes('comentário'))?.id;
//     //         const totalObrigatorias = idPerguntaComentario ? totalPerguntas - 1 : totalPerguntas;

//     //         if (perguntasUnicas.length < totalObrigatorias) {
//     //             alert("Responda todas as perguntas antes de enviar.");
//     //             return;
//     //         }

//     //         // Se tiver comentário, adiciona como resposta normal
//     //         if (comentario !== "" && idPerguntaComentario) {
//     //             respostasUsuario.push({
//     //                 perguntaId: idPerguntaComentario,
//     //                 resposta: comentario
//     //             });
//     //         }

//     //         const payload = {
//     //             respostas: respostasUsuario
//     //         };

//     //         fetch('http://localhost:3000/respostas', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json'
//     //             },
//     //             body: JSON.stringify(payload)
//     //         })
//     //         .then(response => {
//     //             if (response.ok) {

//     //                 modal.style.display = 'flex';
//     //                 modal2.style.display = 'flex'
//     //                 console.log("mostrei o modal")

//     //                 // showModal(); //deu certo? então mostrei o modal
//     //             } else {
//     //                 alert("Erro ao enviar respostas.");
//     //             }
//     //         })
//     //         .catch(error => {
//     //             console.error("Erro:", error);
//     //             alert("Erro:", error);
//     //         });
//     //     });
//         //event.preventDefault();
// });


function fecharModal() {
    modal.style.display = 'none'
    modal2.style.display = 'none'
    window.location.reload();
}

// document.getElementById('okay').addEventListener('click', () => {
//     modal.style.display = 'none'
//     modal2.style.display = 'none'
//     //location.reload()
// });  //apertou o ok? ent tudo certo, atualiza a pagina automaticamente
