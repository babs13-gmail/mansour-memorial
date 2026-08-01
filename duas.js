// ============================================
// MUR DE DUAS — connecté à Firebase Firestore
//
// ⚠️ ÉTAPE OBLIGATOIRE : remplace l'objet firebaseConfig
// ci-dessous par celui que Firebase t'a donné à la création
// de ton application web (Paramètres du projet → Vos applications).
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNCbKIvxadbwUcAn-ybA_FfIhzOrhBsVM",
  authDomain: "mansour-memorial.firebaseapp.com",
  projectId: "mansour-memorial",
  storageBucket: "mansour-memorial.firebasestorage.app",
  messagingSenderId: "807926403472",
  appId: "1:807926403472:web:159adbec2064d78ed5a315"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const duasRef = collection(db, "duas");

// ---- Éléments du DOM ----
const form = document.getElementById('duaForm');
const nameInput = document.getElementById('duaName');
const messageInput = document.getElementById('duaMessage');
const statusEl = document.getElementById('duaStatus');
const wallEl = document.getElementById('duaWall');
const emptyEl = document.getElementById('duaWallEmpty');

// ---- Envoi d'un nouveau message ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  const name = (nameInput.value.trim() || 'Anonyme').slice(0, 40);
  const submitBtn = form.querySelector('.dua-submit');

  submitBtn.disabled = true;
  statusEl.textContent = 'Envoi en cours...';

  try {
    await addDoc(duasRef, {
      name,
      message: message.slice(0, 300),
      createdAt: serverTimestamp()
    });
    form.reset();
    statusEl.textContent = "Merci, votre prière a été ajoutée. Qu'Allah l'accepte.";
    setTimeout(() => { statusEl.textContent = ''; }, 5000);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Une erreur est survenue, réessayez.";
  } finally {
    submitBtn.disabled = false;
  }
});

// ---- Affichage en temps réel des messages ----
// onSnapshot écoute la base de données en continu : dès qu'un
// nouveau message est ajouté (par n'importe qui), le mur se met
// à jour automatiquement, sans recharger la page.
const q = query(duasRef, orderBy('createdAt', 'desc'), limit(100));

onSnapshot(q, (snapshot) => {
  wallEl.innerHTML = '';

  if (snapshot.empty) {
    wallEl.appendChild(emptyEl);
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();

    const item = document.createElement('div');
    item.className = 'dua-wall-item';

    // textContent (pas innerHTML) : protège automatiquement contre
    // l'injection de code malveillant dans les messages
    const msgEl = document.createElement('p');
    msgEl.className = 'dua-wall-message';
    msgEl.textContent = data.message;

    const nameEl = document.createElement('p');
    nameEl.className = 'dua-wall-name';
    nameEl.textContent = `— ${data.name || 'Anonyme'}`;

    item.appendChild(msgEl);
    item.appendChild(nameEl);
    wallEl.appendChild(item);
  });
}, (error) => {
  console.error('Erreur de lecture du mur de duas :', error);
});
