document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");
    const results = document.getElementById("biblioteca");

    const prevBtn = document.getElementById("prevSearch");
    const nextBtn = document.getElementById("nextSearch");

    const homeBtn = document.getElementById("homeBtn");
    const focusSearch = document.getElementById("focusSearch");

    let livros = [];
    let searchHistory = [];
    let currentIndex = -1;

    async function carregarLivros() {
        const resposta = await fetch("./data/livros.json");
        livros = await resposta.json();
        renderResults(livros);
    }

    function renderResults(lista) {
        results.innerHTML = "";

        if (lista.length === 0) {
            results.innerHTML = "<p>Nenhum livro encontrado.</p>";
            return;
        }

        lista.forEach(livro => {
            results.insertAdjacentHTML("beforeend", `
                <div class="collection">
                    <img src="${livro.img}" alt="${livro.titulo}">
                    <h4>${livro.titulo}</h4>
                    <p>${livro.descricao}</p>
                </div>
            `);
        });
    }

    function searchItems(term) {

        if (!term) {
            renderResults(livros);
            return;
        }

        const filtered = livros.filter(livro =>
            livro.titulo.toLowerCase().includes(term.toLowerCase())
        );

        renderResults(filtered);

        if (searchHistory[currentIndex] !== term) {
            searchHistory.push(term);
            currentIndex = searchHistory.length - 1;
        }
    }

    btn.addEventListener("click", () => {
        searchItems(input.value);
    });

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
        }, 300);
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            input.value = searchHistory[currentIndex];
            searchItems(input.value);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < searchHistory.length - 1) {
            currentIndex++;
            input.value = searchHistory[currentIndex];
            searchItems(input.value);
        }
    });

    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderResults(livros);
    });

    focusSearch.addEventListener("click", (e) => {
        e.preventDefault();
        input.focus();
    });

    carregarLivros();
});
