const API_URL = "http://127.0.0.1:5000";

// buscar coleções
export async function getColecoes() {

    const response = await fetch(`${API_URL}/colections`);

    if (!response.ok) {
        throw new Error("Erro ao buscar coleções");
    }

    return await response.json();
}


// buscar livros na OpenLibrary
export async function buscarLivrosAPI(termo) {

    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(termo)}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar livros");
    }

    const data = await response.json();

    return data.docs.slice(0, 10);
}


// abrir coleção
export async function getLivrosColecao(id) {

    const response = await fetch(`${API_URL}/mostrar_favoritos/${id}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar livros");
    }

    return await response.json();
}


// adicionar livro
export async function adicionarLivroColecao(id, livro) {

    const response = await fetch(`${API_URL}/add_favoritos/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(livro)
    });

    if (!response.ok) {
        throw new Error("Erro ao adicionar livro");
    }

    return await response.json();
}