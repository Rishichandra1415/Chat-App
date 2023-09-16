// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {







    apiKey: "AIzaSyBAliB9pRo_MEwQZeHdgSmxNOpMNKGjT9c",
    authDomain: "chat-app-42678.firebaseapp.com",
    projectId: "chat-app-42678",
    storageBucket: "chat-app-42678.appspot.com",
    messagingSenderId: "838927668775",
    appId: "1:838927668775:web:94a12f4386c0781cf7e002"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);