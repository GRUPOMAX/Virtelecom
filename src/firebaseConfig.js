import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPwI6KG6ZYYRrK0JKATeyJLo6HCqavPt0",
  authDomain: "app-max-7e223.firebaseapp.com",
  projectId: "app-max-7e223",
  storageBucket: "app-max-7e223.appspot.com",
  messagingSenderId: "945552301651",
  appId: "1:945552301651:web:95bd59c712cfb9c597b0a6",
  measurementId: "G-JX0P4L7FSG"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
