// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getDatabase, ref, push, remove, update, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export { ref, push, remove, update, get, child, query, orderByChild, equalTo };