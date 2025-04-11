const firebaseConfig = {
    apiKey: "AIzaSyDoqGFMM2ZE29M4c7fQGVI5OzR9N3NWb7Q",
    authDomain: "agendamento-de-laboratorios.firebaseapp.com",
    databaseURL: "https://agendamento-de-laboratorios-default-rtdb.firebaseio.com/",
    projectId: "agendamento-de-laboratorios",
    storageBucket: "agendamento-de-laboratorios.appspot.com",
    messagingSenderId: "226559843105",
    appId: "1:226559843105:web:8ae3f25e7248adc7f4fc60",
    measurementId: "G-5ZHZFYG9MM"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
    const usuarioEmail = localStorage.getItem("usuarioEmail");
    if (usuarioEmail) {
        document.getElementById("email").value = usuarioEmail;
    }
});

function carregarAgendamentos() {
    const containerTabelas = document.getElementById("container-tabelas");
    containerTabelas.innerHTML = "";

    database.ref("agendamentos").once("value", function (snapshot) {
        const agendamentosPorLaboratorio = {};

        snapshot.forEach(function (childSnapshot) {
            const key = childSnapshot.key;
            const agendamento = childSnapshot.val();

            if (!agendamentosPorLaboratorio[agendamento.laboratorio]) {
                agendamentosPorLaboratorio[agendamento.laboratorio] = [];
            }

            agendamentosPorLaboratorio[agendamento.laboratorio].push({ key, ...agendamento });
        });

        Object.keys(agendamentosPorLaboratorio).forEach(laboratorio => {
            renderizarTabela(laboratorio, agendamentosPorLaboratorio[laboratorio]);
        });
    });
}

function filtrarPorLaboratorio(laboratorioAlvo) {
    const containerTabelas = document.getElementById("container-tabelas");
    containerTabelas.innerHTML = "";

    database.ref("agendamentos").orderByChild("laboratorio").equalTo(laboratorioAlvo).once("value", function (snapshot) {
        const agendamentos = [];
        snapshot.forEach(function (childSnapshot) {
            const key = childSnapshot.key;
            const agendamento = childSnapshot.val();
            agendamentos.push({ key, ...agendamento });
        });

        renderizarTabela(laboratorioAlvo, agendamentos);
    });
}

function renderizarTabela(laboratorio, agendamentos) {
    const container = document.getElementById("container-tabelas");
    const titulo = document.createElement("h3");
    titulo.textContent = `Agendamentos - ${laboratorio}`;
    container.appendChild(titulo);

    const tabela = document.createElement("table");
    tabela.innerHTML = `
        <tr>
            <th>Data</th>
            <th>Turno</th>
            <th>Professor</th>
            <th>Email</th>
            <th>Ações</th>
        </tr>
    `;

    agendamentos.forEach(agendamento => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${agendamento.data}</td>
            <td>${agendamento.turno}</td>
            <td>${agendamento.professor}</td>
            <td>${agendamento.email}</td>
            <td>
                <button onclick="editarAgendamento('${agendamento.key}', '${agendamento.laboratorio}', '${agendamento.data}', '${agendamento.turno}', '${agendamento.professor}')">Editar</button>
                <button onclick="excluirAgendamento('${agendamento.key}')">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });

    container.appendChild(tabela);
}

function adicionarAgendamento() {
    const laboratorio = document.getElementById("laboratorio").value;
    const data = document.getElementById("data").value;
    const turno = document.getElementById("turno").value;
    const professor = document.getElementById("professor").value;
    const email = document.getElementById("email").value;

    if (laboratorio && data && turno && professor) {
        database.ref("agendamentos").orderByChild("data").equalTo(data).once("value", function (snapshot) {
            let existeConflito = false;
            snapshot.forEach(function (childSnapshot) {
                const agendamento = childSnapshot.val();
                if (agendamento.laboratorio === laboratorio && agendamento.turno === turno) {
                    existeConflito = true;
                }
            });

            if (existeConflito) {
                alert("Já existe um agendamento para esse laboratório, data e turno.");
            } else {
                const novoAgendamento = { laboratorio, data, turno, professor, email };
                database.ref("agendamentos").push(novoAgendamento)
                    .then(() => {
                        alert("Agendamento salvo com sucesso!");
                        carregarAgendamentos();
                    })
                    .catch((error) => {
                        console.error("Erro ao salvar agendamento:", error);
                    });
            }
        });
    } else {
        alert("Preencha todos os campos.");
    }
}

function excluirAgendamento(key) {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
        database.ref("agendamentos/" + key).remove()
            .then(() => {
                alert("Agendamento excluído com sucesso.");
                carregarAgendamentos();
            })
            .catch((error) => {
                console.error("Erro ao excluir agendamento:", error);
            });
    }
}

function editarAgendamento(key, laboratorio, data, turno, professor) {
    const novaData = prompt("Digite a nova data (AAAA-MM-DD):", data);
    const novoTurno = prompt("Digite o novo turno (Manhã, Tarde ou Noite):", turno);
    const novoProfessor = prompt("Digite o novo nome do professor:", professor);

    if (novaData && novoTurno && novoProfessor) {
        database.ref("agendamentos/" + key).update({
            data: novaData,
            turno: novoTurno,
            professor: novoProfessor
        }).then(() => {
            alert("Agendamento editado com sucesso");
            carregarAgendamentos();
        }).catch((error) => {
            console.error("Erro ao editar agendamento:", error);
        });
    } else {
        alert("Edição cancelada ou campos incompletos.");
    }
}

window.onload = carregarAgendamentos;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}
