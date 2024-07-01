import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
	apiKey: "AIzaSyDquFyaeyZ8uMXBKYx2_5f9NNa4pRgbuME",
	authDomain: "matek-f8905.firebaseapp.com",
	databaseURL:
		"https://matek-f8905-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "matek-f8905",
	storageBucket: "matek-f8905.appspot.com",
	messagingSenderId: "126658230608",
	appId: "1:126658230608:web:428c5cc6658b1c5d159455",
	measurementId: "G-PWC2BGHEJB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {
	auth,
	setPersistence,
	signInWithEmailAndPassword,
	browserLocalPersistence,
	browserSessionPersistence,
};
