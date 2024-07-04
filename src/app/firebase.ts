import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzPeCJieinG7SlYasVoKs9McfNrDcY1II",
  authDomain: "taskmanager-9a3bd.firebaseapp.com",
  projectId: "taskmanager-9a3bd",
  storageBucket: "taskmanager-9a3bd.appspot.com",
  messagingSenderId: "916929100141",
  appId: "1:916929100141:web:6ea39dff04674de1120264",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
