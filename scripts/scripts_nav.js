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

    const aside = document.querySelector(".aside-bar");

    const fecharMenu = () => {
        aside.classList.remove("open");
    };
    let searchHistory = [];
    let currentIndex = -1;


    homeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarHome();
        fecharMenu();
    });

    // BIBLIOTECAS
    libBtn.addEventListener("click", (e) => {
        e.preventDefault();
        carregarColecoes();
        fecharMenu();
    });

    // FOCO NA BUSCA
    focusSearch.addEventListener("click", (e) => {
        e.preventDefault();
        input.focus();
        fecharMenu();
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

    
    nextBtn.addEventListener("click", () => {

        if (currentIndex < searchHistory.length - 1) {

            currentIndex++;

            input.value = searchHistory[currentIndex];

            buscarLivros();
        }
    });

}
