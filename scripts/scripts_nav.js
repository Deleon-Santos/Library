export function iniciarNavegacao({
    homeBtn,
    libBtn,
    focusSearch,
    prevBtn,
    nextBtn,
    input,
    carregarColecoes,
    buscarLivros,
    mostrarHome
}) {

    let searchHistory = [];
    let currentIndex = -1;

    // HOME
    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarHome();
    });

    // BIBLIOTECAS
    libBtn.addEventListener("click", (e) => {
        e.preventDefault();
        carregarColecoes();
    });

    // FOCO NA BUSCA
    focusSearch.addEventListener("click", (e) => {
        e.preventDefault();
        input.focus();
    });

    // ENTER PARA BUSCAR
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            buscarLivros();

            if (searchHistory[currentIndex] !== input.value) {
                searchHistory.push(input.value);
                currentIndex = searchHistory.length - 1;
            }
        }
    });

    // SETA VOLTAR
    prevBtn.addEventListener("click", () => {

        if (currentIndex > 0) {

            currentIndex--;

            input.value = searchHistory[currentIndex];

            buscarLivros();
        }
    });

    // SETA AVANÇAR
    nextBtn.addEventListener("click", () => {

        if (currentIndex < searchHistory.length - 1) {

            currentIndex++;

            input.value = searchHistory[currentIndex];

            buscarLivros();
        }
    });

}
