async function carregarLivros() {

    const resposta = await fetch("./data/livros.json");
    const livros = await resposta.json();

    const biblioteca = document.getElementById("biblioteca");

    livros.forEach(livro => {
        biblioteca.innerHTML += `
            <div class="collection">
                <img src="${livro.img}" alt="${livro.titulo}">
                <h4>${livro.titulo}</h4>
                <p>${livro.descricao}</p>
            </div>
        `;
    });
}

carregarLivros();
