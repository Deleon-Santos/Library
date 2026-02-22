const state = {
    livros: [],
    bibliotecas: [],
    bibliotecaAtual: null
};

const results = document.getElementById("biblioteca");
const input = document.getElementById("searchInput");

let bibliotecaAtual = null;


// 🔥 Carrega os dados
async function carregarDados() {

    try {

        const [resLivros, resBibliotecas] = await Promise.all([
            fetch("/data/livros.json"),
            fetch("/data/bibliotecas.json")
        ]);

        livros = await resLivros.json();
        bibliotecas = await resBibliotecas.json();

        renderBibliotecas();

    } catch (erro) {

        results.innerHTML = "<h2>Erro ao carregar biblioteca 😢</h2>";
        console.error("Erro:", erro);
    }
}


// 🔥 Renderiza bibliotecas
function renderBibliotecas() {

    bibliotecaAtual = null;
    input.value = ""; // limpa busca

    results.innerHTML = "";

    bibliotecas.forEach(bib => {

        results.insertAdjacentHTML("beforeend", `
            <div class="collection biblioteca" data-id="${bib.id}">
                <img src="${bib.img}">
                <h3>${bib.nome}</h3>
            </div>
        `);
    });
}


// 🔥 Renderiza livros
function renderLivros(lista) {

    results.innerHTML = `
        <button id="voltar">⬅ Voltar</button>
        
    `;

    // 🔥 evita tela vazia sem feedback
    if (lista.length === 0) {

        results.insertAdjacentHTML("beforeend",
            `<p>Nenhum livro encontrado 📚</p>`
        );

        return;
    }

    lista.forEach(livro => {

        results.insertAdjacentHTML("beforeend", `
            <div class="collection livro" data-id="${livro.id}">
                <img src="${livro.img}">
                <h4>${livro.titulo}</h4>
                <p>${livro.descricao}</p>
            </div>
        `);
    });
}


// 🔥 EVENT DELEGATION (apenas UM listener)
results.addEventListener("click", (e) => {

    if (e.target.id === "voltar") {
        renderBibliotecas();
        return;
    }

    const biblioteca = e.target.closest(".biblioteca");

    if (biblioteca) {

        const id = Number(biblioteca.dataset.id);

        bibliotecaAtual = id;

        const filtrados = livros.filter(
            livro => Number(livro.bibliotecaId) === id // 🔥 blindagem de tipo
        );

        renderLivros(filtrados);
        return;
    }

    const livro = e.target.closest(".livro");

    if (livro) {

        const idLivro = Number(livro.dataset.id);

        adicionarLivroNaBiblioteca(idLivro);
    }
});


// 🔥 BUSCA PROFISSIONAL (com debounce)
let timeout;

input.addEventListener("input", () => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        buscar(input.value);
    }, 300); // estilo Netflix 🙂
});


function buscar(valor) {

    const termo = valor.trim().toLowerCase();

    // vazio
    if (!termo) {

        if (bibliotecaAtual) {

            const filtrados = livros.filter(
                livro => Number(livro.bibliotecaId) === bibliotecaAtual
            );

            renderLivros(filtrados);

        } else {
            renderBibliotecas();
        }

        return;
    }

    // 🔥 busca mais poderosa (titulo + descricao)
    const resultado = livros.filter(livro => {

        const textoBusca = `
            ${livro.titulo}
            ${livro.descricao}
        `.toLowerCase();

        const matchTexto = textoBusca.includes(termo);

        if (!bibliotecaAtual) return matchTexto;

        return (
            Number(livro.bibliotecaId) === bibliotecaAtual &&
            matchTexto
        );
    });

    renderLivros(resultado);
}


// 🔥 LocalStorage melhorado
function adicionarLivroNaBiblioteca(idLivro) {

    const key = "minhaBiblioteca";

    const minhaBib =
        JSON.parse(localStorage.getItem(key)) || [];

    if (minhaBib.includes(idLivro)) {

        alert("Livro já está na sua biblioteca!");
        return;
    }

    minhaBib.push(idLivro);

    localStorage.setItem(key, JSON.stringify(minhaBib));

    alert("Livro adicionado com sucesso 📚");
}


carregarDados();
