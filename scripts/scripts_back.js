const API_URL = "http://127.0.0.1:5000";

async function carregarColecoes() {
    try {
        const response = await fetch(`${API_URL}/mostrar_favoritos/2`);

        if (!response.ok) {
            throw new Error("Erro ao buscar coleção");
        }

        const data = await response.json();

        const container = document.getElementById("biblioteca");

        container.innerHTML = `
            <h2>${data.nome}</h2>
            <div class="main-colection" id="colecoes-container"></div>
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
    }
}

document.addEventListener("DOMContentLoaded", carregarColecoes);


div.addEventListener("click", async () => {

    if (!state.bibliotecaAtual) {
        alert("Abra uma coleção primeiro 😉");
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/add_favoritos/${state.bibliotecaAtual}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: livro.titulo,
                    autor: livro.autor,
                    img: livro.img,
                    descricao: livro.descricao || ""
                })
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao adicionar livro");
        }

        alert("Livro adicionado com sucesso 📚");

    } catch (error) {

        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor");
    }
});