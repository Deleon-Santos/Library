import { getUserId } from "./login.js";
import { carregarColecoes } from "./scripts_app.js";
// import { getColecoes } from "./scripts_api.js";

// const API_URL = "https://library-backend-b4as.onrender.com"
const API_URL = "http://127.0.0.1:5000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Já contém "Bearer eyJ..."
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

function criarCardColecao(colecao){
    
    const container = document.getElementById("biblioteca");
    if(!window.location.pathname.includes("collectionbiblioteca")){
    return;
}
    const card = document.createElement("div");
    card.classList.add("collection");

    card.innerHTML = `
        <img src="https://thumbs.dreamstime.com/b/livros-de-escola-coloridos-da-pilha-do-grupo-com-livro-aberto-88142348.jpg" alt="Coleção">
        <h4>${colecao.nome}</h4>
        <p>ID da coleção: ${colecao.colecao_id}</p>
    `;

    container.appendChild(card);
}

document.addEventListener("DOMContentLoaded", () => {

    const newLibBtn = document.getElementById("new-lib");
    const modal = document.getElementById("modalOverlay");
    const cancelBtn = document.getElementById("cancelCollection");
    const form = document.getElementById("newCollectionForm");
    const aside = document.querySelector(".aside-bar");

    // Função utilitária para fechar a barra
    const fecharMenu = () => {
        aside.classList.remove("open");
    };

    const userId = getUserId();

    console.log("ID do usuário:", userId);

    // se não estiver logado
    if(!userId){
        console.warn("Usuário não está logado");
        return;
    }

    if(!newLibBtn || !modal || !cancelBtn || !form){
        console.error("Elementos do modal não encontrados");
        return;
    }

    // abrir modal
    newLibBtn.addEventListener("click", (e) => {
        e.preventDefault();
        fecharMenu();
        modal.classList.add("active");
    });

    // fechar modal
    cancelBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // enviar formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("collectionName").value.trim();

        if(!nome){
            alert("Digite um nome para a coleção");
            return;
        }

        const body = {
            nome: nome,
            usuario_id: userId
        };

        console.log("Enviando:", body);

        try {
            const headers = getAuthHeaders();
            const response = await fetch(`${API_URL}/nova_colecao`, {
                method: "POST",
                headers: headers,
                    
                    
                body: JSON.stringify(body)
            });

            const data = await response.json();

            console.log("Resposta da API:", data);

            if(response.ok){
                alert("Coleção criada com sucesso!");

                modal.classList.remove("active");
                form.reset();
                criarCardColecao(data);
                await carregarColecoes(); // Atualiza a lista de coleções

            } else {
                alert(data.erro || "Erro ao criar coleção");
            }

        } catch(error){
            console.error("Erro:", error);
            alert("Servidor indisponível");
        }

    });

});



