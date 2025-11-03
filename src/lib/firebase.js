// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDzMzipnXLOXXoajzofHOUvrfIRVgZp33M",
    authDomain: "controll-esp32-surya.firebaseapp.com",
    databaseURL:
        "https://controll-esp32-surya-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "controll-esp32-surya",
    storageBucket: "controll-esp32-surya.appspot.com",
    messagingSenderId: "XXXXXXXXX",
    appId: "1:XXXX:web:XXXXXX",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, get, set, update };
