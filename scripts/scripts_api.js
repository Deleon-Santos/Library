// const API_URL = "http://127.0.0.1:5000";
const API_URL = "https://library-backend-b4as.onrender.com"


// Função auxiliar para pegar o token e montar o cabeçalho
const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); 
    console.log("Token recuperado do localStorage:", token);

    if (!token) {
        console.warn("Nenhum token encontrado no localStorage.");
        return { "Content-Type": "application/json" };
    }

    return {
        "Content-Type": "application/json",
        "autorizacao": token 
    };
};


// buscar coleções (PROTEGIDA)
export async function getColecoes() {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/mostrar_colecao`, {
        method: "GET",
        headers: headers
        

    });
    
    if (response.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
        throw new Error("Erro ao buscar coleções");
    }
    
    return await response.json();
}

// buscar livros na OpenLibrary (PÚBLICA - Não precisa de Token)
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

// abrir coleção (PROTEGIDA)
export async function getLivrosColecao(id) {
    const headers = getAuthHeaders();   
    const response = await fetch(`${API_URL}/mostrar_livros/${id}`, {
        method: "GET",
        headers: headers
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar livros da coleção");
    }

    return await response.json();
}

// adicionar livro (PROTEGIDA)
export async function adicionarLivroColecao(id, livro) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/add_livro/${id}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(livro)
    });

    if (!response.ok) {
        throw new Error("Erro ao adicionar livro");
    }

    return await response.json();
}

// deletar coleção (PROTEGIDA)
export async function deletarColecao(id) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/deletar_colecao/${id}`, {
        method: "DELETE",
        headers: headers
    });

    if (!response.ok) {
        throw new Error("Erro ao deletar coleção");
    }

    return await response.json();
}