// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCfra5kXGqJ6zE4HkKntavY1Rd8lxktwMs",
    authDomain: "iot-bluegreen.firebaseapp.com",
    databaseURL: "https://iot-bluegreen-default-rtdb.firebaseio.com",
    projectId: "iot-bluegreen",
    storageBucket: "iot-bluegreen.appspot.com",
    messagingSenderId: "516787840310",
    appId: "1:516787840310:web:7b523dd98c5eea041eff97",
    measurementId: "G-54BH4M9D33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const display = document.getElementById('test');

const starCountRef = ref(database, 'Thông số');
onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    display.textContent = data['Độ ẩm đất'];
});