const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const results = document.getElementById("biblioteca");

const prevBtn = document.getElementById("prevSearch");
const nextBtn = document.getElementById("nextSearch");

let livros = []; // <- fica em memória
let searchHistory = [];
let currentIndex = -1;


// 🔎 Carrega os livros UMA vez
async function carregarLivros() {

    const resposta = await fetch("./data/livros.json");
    livros = await resposta.json();

    renderResults(livros);
}


// 🎨 Renderiza os cards
function renderResults(lista) {

    results.innerHTML = "";

    if (lista.length === 0) {
        results.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return;
    }

    lista.forEach(livro => {
        results.innerHTML += `
            <div class="collection">
                <img src="${livro.img}" alt="${livro.titulo}">
                <h4>${livro.titulo}</h4>
                <p>${livro.descricao}</p>
            </div>
        `;
    });
}


// 🔎 Busca por título
function searchItems(term) {

    if (!term) {
        renderResults(livros); // mostra todos novamente
        return;
    }

    const filtered = livros.filter(livro =>
        livro.titulo.toLowerCase().includes(term.toLowerCase())
    );

    renderResults(filtered);

    // salva histórico
    if (searchHistory[currentIndex] !== term) {
        searchHistory.push(term);
        currentIndex = searchHistory.length - 1;
    }
}


// clique no botão
btn.addEventListener("click", () => {
    searchItems(input.value);
});


// ENTER para buscar
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchItems(input.value);
    }
});

let timeout;

input.addEventListener("input", () => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        searchItems(input.value);
    }, 300); // debounce
});


// ⬅ busca anterior
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        input.value = searchHistory[currentIndex];
        searchItems(input.value);
    }
});


// ➡ próxima busca
nextBtn.addEventListener("click", () => {
    if (currentIndex < searchHistory.length - 1) {
        currentIndex++;
        input.value = searchHistory[currentIndex];
        searchItems(input.value);
    }
});


// inicia
carregarLivros();
