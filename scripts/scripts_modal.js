const API_URL = "http://127.0.0.1:5000";
console.log("Modal script carregado");
document.addEventListener("DOMContentLoaded", () => {

    const newLibBtn = document.getElementById("new-lib");
    const modal = document.getElementById("modalOverlay");
    const cancelBtn = document.getElementById("cancelCollection");
    const form = document.getElementById("newCollectionForm");

    if(!newLibBtn) return;

    newLibBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
    });

    cancelBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("collectionName").value.trim();
        if(!nome) return;

        try {
            const response = await fetch(`${API_URL}/colecao`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome })
            });

            const data = await response.json();

            if(response.ok){
                alert("Coleção criada com sucesso!");
                modal.classList.remove("active");
                form.reset();
            } else {
                alert(data.erro || "Erro ao criar coleção");
            }

        } catch(error){
            console.error(error);
            alert("Servidor indisponível");
        }
    });

});