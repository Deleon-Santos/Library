import {
    getColecoes,
    buscarLivrosAPI,
    getLivrosColecao,
    adicionarLivroColecao,
    deletarColecao,
    deletarLivro
}  from "./scripts_api.js";

import { iniciarNavegacao } from "./scripts_nav.js";

import "./scripts_modal.js";


const renderhome = document.getElementById("renderhome");
// const homeBtn = document.getElementById("homeBtn");
const libBtn = document.getElementById("lib");
const focusSearch = document.getElementById("focusSearch");

const prevBtn = document.getElementById("prevSearch");
const nextBtn = document.getElementById("nextSearch");

const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const results = document.getElementById("biblioteca");

let colecaoAtual = null;
let searchHistory = [];
let currentSearchIndex = -1;



document.addEventListener("DOMContentLoaded", () => {
    // No início do scripts_app.js ou dentro do DOMContentLoaded
    const nomeUsuario = localStorage.getItem("userName");
    const authHeader = document.getElementById("auth");

    if (authHeader) {
        if (nomeUsuario) {
            authHeader.textContent = nomeUsuario; // Define apenas o nome conforme solicitado
        } else {
            authHeader.textContent = "Library"; // Texto padrão caso não esteja logado
        }
    }

    iniciarNavegacao({
        homeBtn,
        libBtn,
        focusSearch,
        prevBtn,
        nextBtn,
        input,
        carregarColecoes,
        buscarLivros,
        mostrarHome
    });

    mostrarHome();

});

async function carregarDestaques(){

    const res = await fetch("../data/livros.json");
    const data = await res.json();

    const grid = document.querySelector(".home-grid");

    grid.innerHTML = "";

    data.livros_destaque.forEach(livro => {

        const card = document.createElement("div");
        card.classList.add("home-card");

        card.innerHTML = `
        <a href="${livro.link}" target="_blank">
            
                <img src="${livro.capa}">
                <h4>${livro.titulo}</h4>
        </a>
        `;

        grid.appendChild(card);

    });

}

function mostrarHome() {

    results.innerHTML = `
    
    <div class="home">

        <section class="home-welcome">
            <h2>Bem-vindo à sua Biblioteca 📚</h2>
            <p>Descubra novos livros, organize suas leituras e construa sua coleção.</p>
        </section>

        <section class="home-section">
            <h3>🔥 Livro mais buscado</h3>

            <div class="home-highlight">

                <div>
                <img src="https://covers.openlibrary.org/b/title/Biblia%20Sagrada-L.jpg">
                
                </div>

                <div class="highlight-info">
                    <h4>Bíblia Sagrada</h4>

                    <p>
                    O livro mais lido da história da humanidade.
                    Uma coleção de textos religiosos e históricos que
                    influenciaram culturas no mundo inteiro.
                    </p>                
                </div>
            </div>
            
         <section class="home-section">
            <h3>📖 Sugestões para você</h3>
                <div class="home-grid">            
                </div>
            </div>
        </section>
    </div>
    `;

    carregarDestaques();  
}

// -----------------------------------------------------------------------------
// carregar coleções
// document.addEventListener("DOMContentLoaded", carregarColecoes);
// libBtn.addEventListener("click", carregarColecoes);

export async function carregarColecoes() {

    results.innerHTML = ""; // remove a home

    try {

        const colecoes = await getColecoes();

        colecoes.forEach(colecao => {

            const card = document.createElement("div");
            card.classList.add("collection");

            card.innerHTML = `
                <img src="https://thumbs.dreamstime.com/b/livros-de-escola-coloridos-da-pilha-do-grupo-com-livro-aberto-88142348.jpg">

                <div class="excluir">
                    <h3>${colecao.nome}</h3>
                    <button class="del-colection">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            // abrir coleção ao clicar no card
            card.addEventListener("click", () => {
                abrirColecao(colecao.id);
            });

            // botão excluir
            const btnDelete = card.querySelector(".del-colection");

            btnDelete.addEventListener("click", async (e) => {

                e.stopPropagation(); // impede abrir a coleção

                const confirmar = confirm("Deseja excluir esta coleção?");
                if (!confirmar) return;

                try {

                    await deletarColecao(colecao.id);

                    alert("Coleção excluída!");

                    carregarColecoes(); // recarrega lista

                } catch (error) {

                    console.error(error);
                    alert("Erro ao excluir coleção");

                }

            });

            results.appendChild(card);

        });

    } catch (error) {

        console.error(error);
        results.innerHTML = "<p>Erro ao carregar coleções</p>";

    }
}

// busca livros
btn.addEventListener("click", buscarLivros);

async function buscarLivros() {

    const termo = input.value.trim();

    if (!termo) return;

    results.innerHTML = "<p>Buscando...</p>";

    try {

        const livros = await buscarLivrosAPI(termo);

        mostrarResultados(livros);

    } catch (erro) {

        console.error(erro);
        results.innerHTML = "<p>Erro ao buscar livros</p>";
    }
}


// renderiza resultados
function mostrarResultados(livros) {

    results.innerHTML = "";

    livros.forEach(livro => {

        const capa = livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
            : "https://via.placeholder.com/128x190?text=Sem+Capa";

        const card = document.createElement("div");
        card.classList.add("collection");
        card.innerHTML = `
            
                <img src="${capa}">
                <button class=add><i class="fa-solid fa-plus"></i></button>
                <h4>${livro.title}</h4>
                <p>${livro.author_name?.[0] || "Autor desconhecido"}</p>
                
            
        `;

        card.querySelector("button").addEventListener("click", () => {
            adicionarLivro(livro);
        });

        results.appendChild(card);
        
    });
    
}


async function abrirColecao(id) {
    colecaoAtual = id;
    results.innerHTML = "<p>Carregando livros...</p>";

    try {
        const data = await getLivrosColecao(id);

        results.innerHTML = `
            <div class="colecao-info collection">
                <h2 id="titulo-da-colecao">${data.nome}</h2>
            </div>
        `;

        // Iteramos sobre a lista de livros
        data.livros.forEach(livro => {
            const capa = livro.capa
                ? `https://covers.openlibrary.org/b/id/${livro.capa}-M.jpg`
                : "https://via.placeholder.com/128x190?text=Sem+Capa";

            const card = document.createElement("div");
            card.classList.add("collection");

            card.innerHTML = `
                <a href="https://www.amazon.com.br" target="_blank">
                    <img src="${capa}">
                </a>
                <button class="del btn-deletar-livro">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <h4>${livro.titulo}</h4>
                <p>${livro.autor || "Autor desconhecido"}</p>
                <small>${livro.descricao || ""}</small>
            `;

            // LÓGICA DE DELEÇÃO AQUI:
            const btnDel = card.querySelector(".btn-deletar-livro");
            btnDel.addEventListener("click", async () => {
                if (confirm(`Deseja remover "${livro.titulo}" da coleção?`)) {
                    try {
                        // Chama a API passando o ID do livro
                        await deletarLivro(livro.id); 
                        alert("Livro removido!");
                        
                        // Recarrega a coleção atual para atualizar a interface
                        abrirColecao(id); 
                    } catch (error) {
                        console.error("Erro ao deletar:", error);
                        alert(error.message);
                    }
                }
            });

            results.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        results.innerHTML = "<p>Erro ao carregar a coleção.</p>";
    }
}
// async function abrirColecao(id) {
//     colecaoAtual = id;
//     results.innerHTML = "<p>Carregando livros...</p>";

//     try {
//         const data = await getLivrosColecao(id);

      
//         results.innerHTML = `
//             <div class="colecao-info collection">
                

//                 <h2 id="titulo-da-colecao">${data.nome}</h2>
//             </div>
            
//         `;

//         const gridLivros = document.getElementById("biblioteca");

//         // 2. Iteramos sobre a lista de livros que vem no JSON
//         data.livros.forEach(livro => {
//             const capa = livro.capa
//                 ? `https://covers.openlibrary.org/b/id/${livro.capa}-M.jpg`
//                 : "https://via.placeholder.com/128x190?text=Sem+Capa";

//             const card = document.createElement("div");
//             card.classList.add("collection");

//             // Removi o ${livro.nome} daqui, pois o nome da coleção já está no topo
//             card.innerHTML = `
//                 <a href="https://www.amazon.com.br/Livros/b/?ie=UTF8&node=6740748011&ref_=topnav_storetab_b" target="_blank">
//                     <img src="${capa}"></a>
//                     <button class="del" id="delete_livro"><i class="fa-solid fa-trash"></i></button>
//                     <h4>${livro.titulo}</h4>
//                     <p>${livro.autor || "Autor desconhecido"}</p>
//                     <small>${livro.descricao || ""}</small>
                
//             `;

//             gridLivros.appendChild(card);
//         });

//     } catch (error) {
//         console.error("Erro:", error);
//         results.innerHTML = "<p>Erro ao carregar a coleção.</p>";
//     }
// }


// adicionar livro
async function adicionarLivro(livro) {

    if (!colecaoAtual) {
        alert("Abra uma coleção primeiro!");
        return;
    }
    console.log(livro);
    const livroFormatado = {
        titulo: livro.title,
        autor: livro.author_name?.[0] || "Autor desconhecido",
        descricao: livro.first_sentence?.[0] || "Sem descrição",
        ano: livro.first_publish_year || null,
        capa: livro.cover_i
    };

    try {

        await adicionarLivroColecao(colecaoAtual, livroFormatado);

        alert("Livro adicionado!");

        await abrirColecao(colecaoAtual);

    } catch (error) {

        console.error(error);
        alert("Erro ao adicionar livro: " + error.message);
    }
}


// -------------------------------
const configBtn = document.getElementById("configBtn");
const configBox = document.getElementById("configBox");

configBtn.addEventListener("click", (e) => {
    e.preventDefault();
    configBox.classList.toggle("open");
});

// ------------------------------

const config = document.getElementById("toggle");

config.addEventListener("click", () => {

    document.body.classList.toggle("light");

    config.innerHTML = document.body.classList.contains("light")
        ? '<span><i class="fa-solid fa-sun"> </i>  Tema Claro</span>'
        : '<span><i class="fa-solid fa-moon"> </i>  Tema Escuro</span>';

    // salvar preferência
    if(document.body.classList.contains("light")){
        localStorage.setItem("theme","light");
    }else{
        localStorage.setItem("theme","dark");
    }
});



const btnBurger = document.getElementById("btnBurguer");
const aside = document.querySelector(".aside-bar");

btnBurger.addEventListener("click", () => {
    aside.classList.toggle("open");
});


