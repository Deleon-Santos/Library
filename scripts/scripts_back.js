const API_URL = "http://127.0.0.1:5000";

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















async function abrirColecao(id) {

    const container = document.getElementById("biblioteca");
    container.innerHTML = "<p>Carregando livros...</p>";

    try {

        const response = await fetch(`${API_URL}/mostrar_favoritos/${id}`);
        console.log(id);
        if (!response.ok) {
            throw new Error("Erro ao buscar livros");
        }

        const data = await response.json();

        container.innerHTML = `
            <h2>${data.nome}</h2>
            <div id="colecoes-container">Coleções</div>
        `;

        const colecoesContainer = document.getElementById("colecoes-container");

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