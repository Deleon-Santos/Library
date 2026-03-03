const API_URL = "http://127.0.0.1:5000";

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value.trim();

msg.textContent="";

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

if(response.ok){

msg.style.color="green";
msg.textContent="Login realizado com sucesso!";

localStorage.setItem("user",JSON.stringify(data));
console.log("Usuário logado:",data);

setTimeout(()=>{

window.location.href="index.html";

},1000);

}else{

msg.style.color="red";
msg.textContent=data.erro || "Credenciais inválidas";

}

}catch(error){

msg.style.color="red";
msg.textContent="Servidor indisponível";

console.error(error);

}

btn.classList.remove("loading");

});