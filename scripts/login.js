// ==============================
// FUNÇÃO EXPORTADA
// ==============================

export const getUserId = () => localStorage.getItem("userId");

// ==============================
// CONFIG
// ==============================

const API_URL = "http://127.0.0.1:5000";

// ==============================
// ESPERA O DOM CARREGAR
// ==============================

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

// evita erro caso o script seja carregado em outra página
if(!form) return;

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value.trim();

msg.textContent = "";
btn.classList.add("loading");

try{

const response = await fetch(`${API_URL}/login`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
senha
})

});

const data = await response.json();
console.log("Usuário logado:", data);
if(response.ok){

msg.style.color="green";
msg.textContent="Login realizado com sucesso!";

// salva os dados do usuário
localStorage.setItem("userId", data.usuario_id);
localStorage.setItem("user", JSON.stringify(data));

console.log("Usuário logado:", data);

setTimeout(()=>{
window.location.href="./page/login.html";
},1000);

}else{

msg.style.color="red";
msg.textContent = data.erro || "Credenciais inválidas";

}

}catch(error){

msg.style.color="red";
msg.textContent="Servidor indisponível";

console.error(error);

}

btn.classList.remove("loading");

});

});