import {
    getColecoes,
    buscarLivrosAPI,
    getLivrosColecao,
    adicionarLivroColecao
}  from "./scripts_api.js";

import { iniciarNavegacao } from "./scripts_nav.js";

const homeBtn = document.getElementById("homeBtn");
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
function mostrarHome() {

    results.innerHTML = `
        
        
    `;
}

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

// -----------------------------------------------------------------------------
// carregar coleções
document.addEventListener("DOMContentLoaded", carregarColecoes);

async function carregarColecoes() {

    
    mostrarHome();
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