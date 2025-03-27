import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let usuarioAtual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    usuarioAtual = user;
    carregarAgendamentos();
  } else {
    window.location.href = "index.html";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

window.criarAgendamento = async function () {
  const lab = document.getElementById("lab").value;
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;

  if (!lab || !data || !horario) {
    alert("Preencha todos os campos!");
    return;
  }

  await addDoc(collection(db, "agendamentos"), {
    lab,
    data,
    horario,
    professor: usuarioAtual.email,
    uid: usuarioAtual.uid
  });

  alert("Agendamento criado!");
  document.getElementById("lab").value = "";
  document.getElementById("data").value = "";
  document.getElementById("horario").value = "";
  carregarAgendamentos();
};

async function carregarAgendamentos() {
  const lista = document.getElementById("lista-agendamentos");
  lista.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "agendamentos"));

  querySnapshot.forEach((docSnap) => {
    const agendamento = docSnap.data();
    if (agendamento.uid === usuarioAtual.uid) {
      const li = document.createElement("li");
      li.textContent = `${agendamento.lab} - ${agendamento.data} às ${agendamento.horario}`;
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.onclick = () => excluirAgendamento(docSnap.id);

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => editarAgendamento(docSnap.id, agendamento);

      li.appendChild(btnEditar);
      li.appendChild(btnExcluir);
      lista.appendChild(li);
    }
  });
}

async function excluirAgendamento(id) {
  const agendamentoRef = doc(db, "agendamentos", id);
  const agendamentoDoc = await getDoc(agendamentoRef);

  if (agendamentoDoc.exists() && agendamentoDoc.data().uid === usuarioAtual.uid) {
    await deleteDoc(agendamentoRef);
    alert("Agendamento excluído.");
    carregarAgendamentos();
  } else {
    alert("Você não pode excluir esse agendamento.");
  }
}

async function editarAgendamento(id, agendamento) {
  const novoLab = prompt("Novo laboratório:", agendamento.lab);
  const novaData = prompt("Nova data (AAAA-MM-DD):", agendamento.data);
  const novoHorario = prompt("Novo horário (HH:MM):", agendamento.horario);

  if (novoLab && novaData && novoHorario) {
    const agendamentoRef = doc(db, "agendamentos", id);
    await updateDoc(agendamentoRef, {
      lab: novoLab,
      data: novaData,
      horario: novoHorario
    });
    alert("Agendamento atualizado.");
    carregarAgendamentos();
  }
}