// const API_URL = "http://127.0.0.1:5000";
const API_URL = "https://library-backend-b4as.onrender.com"
const form = document.getElementById("registerForm");
const btn = document.getElementById("registerBtn");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const nome = document.getElementById("nome").value.trim();
const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value.trim();
const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

msg.textContent="";

if(senha !== confirmarSenha){

msg.style.color="red";
msg.textContent="As senhas não coincidem";

return;

}

btn.classList.add("loading");

try{

const response = await fetch(`${API_URL}/cadastro`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nome,
email,
senha
})

});

const data = await response.json();

if(response.ok){

msg.style.color="green";
msg.textContent="Conta criada com sucesso!";

setTimeout(()=>{

window.location.href="/index.html";

},1200);

}else{

msg.style.color="red";
msg.textContent=data.erro || "Erro ao criar conta";

}

}catch(error){

msg.style.color="red";
msg.textContent="Servidor indisponível";

console.error(error);

}

btn.classList.remove("loading");

});