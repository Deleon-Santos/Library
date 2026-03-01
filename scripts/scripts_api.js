const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const results = document.getElementById("biblioteca");

let colecaoAtual = null;
let colecaoAberta = []; // simula coleção atual
API_URL = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", carregarColecoes);

async function carregarColecoes() {

    const container = document.getElementById("biblioteca");
    container.innerHTML = "<p>Carregando coleções...</p>";

    try {

        const response = await fetch(`${API_URL}/colections`);

        if (!response.ok) {
            throw new Error("Erro ao buscar coleções");
        }

        const colecoes = await response.json();

        container.innerHTML = "<h2>Minhas Coleções</h2>";

        colecoes.forEach(colecao => {

            const card = document.createElement("div");
            card.classList.add("collection");

            card.innerHTML = `
                <img src="./img/1.webp" alt="${colecao.nome}">
                <h3>${colecao.nome}</h3>
            `;

            card.addEventListener("click", () => {
                abrirColecao(colecao.id);
            });

            container.appendChild(card);
        });

    } catch (error) {

        console.error("Erro:", error);
        container.innerHTML = "<p>Erro ao carregar coleções</p>";
    }
}
// --------------------------------------------



btn.addEventListener("click", buscarLivros);

async function buscarLivros() {
    const termo = input.value.trim();

    if (!termo) return;

    results.innerHTML = "<p>Buscando...</p>";

    try {
        const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}`
        );

        const data = await response.json();

        mostrarResultados(data.docs.slice(0, 10)); // limita 10 resultados

    } catch (erro) {
        console.error(erro);
        results.innerHTML = "<p>Erro ao buscar livros.</p>";
    }
}
// mostra o resutado na tela
function mostrarResultados(livros) {
    results.innerHTML = "";

    if (!livros.length) {
        results.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return;
    }

    livros.forEach(livro => {

        const capa = livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
            : "https://via.placeholder.com/128x190?text=Sem+Capa";

        const card = document.createElement("div");
        card.classList.add("colection");

        card.innerHTML = `
            <img src="${capa}" alt="${livro.title}">
            <h4>${livro.title}</h4>
            <p>${livro.author_name ? livro.author_name[0] : "Autor desconhecido"}</p>
            <button>Adicionar</button>
        `;

        const botao = card.querySelector("button");

        botao.addEventListener("click", () => {
            adicionarNaColecao(livro);
        });

        results.appendChild(card);
    });
}






async function abrirColecao(id) {
    colecaoAtual = id;
    const container = document.getElementById("biblioteca");
    container.innerHTML = "<p>Carregando livros...</p>";

    try {

        const response = await fetch(`${API_URL}/mostrar_favoritos/${colecaoAtual}`);
        console.log("o id da coleção atual e:" + colecaoAtual);
        if (!response.ok) {
            throw new Error("Erro ao buscar livros");
        }

        const data = await response.json();

        container.innerHTML = `
            
            
            
            <div id="main-colection"></div>
        `;

        const colecoesContainer = document.getElementById("main-colection");

        data.livros.forEach(livro => {

            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="collection">
                     <img src="./img/1.webp" alt="${livro.titulo}">
                     <h4>${livro.titulo}</h4>
                     <p>${livro.descricao}</p>
                </div>
            `;

            colecoesContainer.appendChild(card);
        });

    } catch (error) {

        console.error("Erro:", error);
        container.innerHTML = "<p>Erro ao carregar livros</p>";
    }
}





// add na coleção aberta
async function adicionarNaColecao(livro) {

    if (!colecaoAtual) {
        alert("Abra uma coleção primeiro!");
        return;
    }

    console.log("Adicionando livro:", livro);
    console.log("Coleção atual:", colecaoAtual);

    const livroFormatado = {
        titulo: livro.title || "Sem título",
        autor: livro.author_name?.[0] || "Autor desconhecido",
        descricao: `Publicado em ${livro.first_publish_year || "ano desconhecido"}`,
        ano: livro.first_publish_year || "Ano desconhecido"
    };

    try {

        const response = await fetch(
            `${API_URL}/add_favoritos/${colecaoAtual}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(livroFormatado)
            }
        );

        if (!response.ok) {
            throw new Error("Erro no servidor");
        }

        const data = await response.json();

        alert(`"${livroFormatado.titulo}" adicionado à coleção!`);
        console.log("Resposta:", data);

        abrirColecao(colecaoAtual);

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}


