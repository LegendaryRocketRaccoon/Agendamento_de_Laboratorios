import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

window.register = function () {
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Professor cadastrado com sucesso!");
    })
    .catch((error) => {
      alert("Erro: " + error.message);
    });
};

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login realizado.");
      window.location.href = "agendamento.html";
    })
    .catch((error) => {
      alert("Erro: " + error.message);
    });
};
