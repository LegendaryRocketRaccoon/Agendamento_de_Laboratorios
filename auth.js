import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDoqGFMM2ZE29M4c7fQGVI5OzR9N3NWb7Q",
    authDomain: "agendamento-de-laboratorios.firebaseapp.com",
    projectId: "agendamento-de-laboratorios",
    storageBucket: "agendamento-de-laboratorios.appspot.com",
    messagingSenderId: "226559843105",
    appId: "1:226559843105:web:8ae3f25e7248adc7f4fc60",
    measurementId: "G-5ZHZFYG9MM"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


window.login = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuário logado:", user.email);
            localStorage.setItem("usuarioEmail", user.email);
            window.location.href = "agendamento.html";
        })
        .catch((error) => {
            console.error("Erro no login:", error.message);
            alert("Erro ao fazer login: " + error.message);
        });
};


window.cadastrar = function () {
    const newEmail = document.getElementById("new-email").value;
    const newPassword = document.getElementById("new-password").value;

    createUserWithEmailAndPassword(auth, newEmail, newPassword)
        .then((userCredential) => {
            console.log("Usuário cadastrado:", userCredential.user.email);
            alert("Cadastro realizado com sucesso!");
            document.getElementById("cadastro-mensagem").innerText = "Cadastro realizado com sucesso!";
        })
        .catch((error) => {
            console.error("Erro no cadastro:", error.message);
            document.getElementById("cadastro-mensagem").innerText = "Erro ao cadastrar: " + error.message;
        });
};


window.esqueciSenha = function () {
    const email = document.getElementById("email").value;

    if (!email) {
        alert("Por favor, insira seu e-mail antes de solicitar a redefinição de senha.");
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.");
        })
        .catch((error) => {
            console.error("Erro ao enviar e-mail de redefinição de senha:", error.message);
            alert("Erro ao enviar e-mail: " + error.message);
        });
};


onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário autenticado:", user.email);
    } else {
        console.log("Nenhum usuário logado.");
    }
});