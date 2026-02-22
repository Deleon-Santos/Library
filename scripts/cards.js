async function carregarBibliotecas() {

    try {

        const res = await fetch("http://127.0.0.1:5000/mostrar_favoritos/2");

        if (!res.ok) {
            throw new Error("Erro ao carregar coleções");
        }

        state.bibliotecas = await res.json();

    } catch (err) {
        console.error("Erro:", err);
        state.bibliotecas = [];
        renderBibliotecas();
    }
    
}

// ----------------------------------
async function abrirBiblioteca(id) {

    state.bibliotecaAtual = Number(id);

    try {

        const res = await fetch(
            `http://127.0.0.1:5000/mostrar_favoritos/${id}`
        );

        if (!res.ok) {
            throw new Error("Erro ao carregar livros da coleção");
        }

        const data = await res.json();

        state.livrosDaBiblioteca = data.livros; // backend deve retornar { nome, livros }

        renderLivros(state.livrosDaBiblioteca);

    } catch (err) {

        console.error(err);
        renderLivros([]);
    }
}
// -----------------------------------

async function searchItems(term) {

    if (!state.bibliotecaAtual) {
        alert("Abra uma coleção primeiro 😉");
        return;
    }

    term = term.trim();

    if (!term) return;

    results.innerHTML = "<p>🔎 Buscando livros...</p>";

    const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(term)}&limit=20`
    );

    const data = await res.json();

    const livrosAPI = data.docs.map(l => ({
        titulo: l.title || "Sem título",
        autor: l.author_name?.[0] || "Autor desconhecido",
        img: l.cover_i
            ? `https://covers.openlibrary.org/b/id/${l.cover_i}-M.jpg`
            : "https://via.placeholder.com/150x220"
    }));

    renderBuscaGlobal(livrosAPI);
}
// -----------------------------------
function renderBuscaGlobal(lista) {

    results.innerHTML = `
        <button id="voltar">⬅ Voltar</button>
        <h2>Adicionar à coleção</h2>
    `;

    document.getElementById("voltar")
        .addEventListener("click", () =>
            abrirBiblioteca(state.bibliotecaAtual)
        );

    lista.forEach(livro => {

    const div = document.createElement("div");
    div.className = "collection";
    div.innerHTML = criarCardLivro(livro);

    div.addEventListener("click", async () => {

        try {

            const response = await fetch(
                `http://127.0.0.1:5000/add_favoritos/${state.bibliotecaAtual}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(livro)
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao adicionar");
            }

            alert("Livro adicionado 📚");

            abrirBiblioteca(state.bibliotecaAtual);

        } catch (err) {
            console.error(err);
        }
    });

    results.appendChild(div);
});}