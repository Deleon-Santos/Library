import {
    getColecoes,
    buscarLivrosAPI,
    getLivrosColecao,
    adicionarLivroColecao
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

// -----------------------------------------------------------------------------
// iniciar a navegação com o dom ativado
// function mostrarHome() {

//     results.innerHTML = `
        
        
//     `;
// }

document.addEventListener("DOMContentLoaded", () => {

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

// function iniciarScrollHome(){

//     const grid = document.querySelector(".home-grid");
//     const left = document.getElementById("scrollLeft");
//     const right = document.getElementById("scrollRight");

//     const scrollAmount = 400;

//     left.addEventListener("click", () => {
//         grid.scrollBy({
//             left: -scrollAmount,
//             behavior: "smooth"
//         });
//     });

//     right.addEventListener("click", () => {
//         grid.scrollBy({
//             left: scrollAmount,
//             behavior: "smooth"
//         });
//     });

// }


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
btn.addEventListener("click", carregarColecoes);
async function carregarColecoes() {

    results.innerHTML = ""; // remove a home
    // mostrarHome();
    try {

        const colecoes = await getColecoes();

        

        colecoes.forEach(colecao => {

            const card = document.createElement("div");
            card.classList.add("collection");

            card.innerHTML = `
                
                    <img src="https://thumbs.dreamstime.com/b/livros-de-escola-coloridos-da-pilha-do-grupo-com-livro-aberto-88142348.jpg">
                    <h3>${colecao.nome}</h3>
                
            `;

            card.addEventListener("click", () => {
                abrirColecao(colecao.id);
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
                <h4>${livro.title}</h4>
                <p>${livro.author_name?.[0] || "Autor desconhecido"}</p>
                <button>Adicionar</button>
            
        `;

        card.querySelector("button").addEventListener("click", () => {
            adicionarLivro(livro);
        });

        results.appendChild(card);
    });
}


// abrir coleção
async function abrirColecao(id) {

    colecaoAtual = id;

    results.innerHTML = "<p>Carregando livros...</p>";

    try {

        const data = await getLivrosColecao(id);

        results.innerHTML = "";

        data.livros.forEach(livro => {

            const capa = livro.capa
                ? `https://covers.openlibrary.org/b/id/${livro.capa}-M.jpg`
                : "https://via.placeholder.com/128x190?text=Sem+Capa";

            const card = document.createElement("div");
            card.classList.add("collection");

            card.innerHTML = `
                <img src="${capa}">
                <h4>${livro.titulo}</h4>
                <p>${livro.descricao}</p>
            `;

            results.appendChild(card);

        });

    } catch (error) {

        console.error(error);
        results.innerHTML = "<p>Erro ao carregar livros</p>";

    }
}
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

        abrirColecao(colecaoAtual);

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
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    // salvar preferência
    if(document.body.classList.contains("light")){
        localStorage.setItem("theme","light");
    }else{
        localStorage.setItem("theme","dark");
    }
});

// -----------------------
const btnBurger = document.getElementById("btnBurguer");
const aside = document.querySelector(".aside-bar");

btnBurger.addEventListener("click", () => {
    aside.classList.toggle("open");
});