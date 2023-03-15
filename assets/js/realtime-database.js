// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import { getDatabase, ref, onValue, push, child, update} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

const moilData = document.getElementById("moil-data");
const tempData = document.getElementById("temp-data");
const humiData = document.getElementById("humi-data");

const measuredData = ref(database, 'Thông số');
onValue(measuredData, (snapshot) => {
    const data = snapshot.val();
    moilData.textContent = data['Độ ẩm đất'];
    tempData.textContent = data['Nhiệt độ'];
    humiData.textContent = data['Độ ẩm không khí'];
});

const btnMode = document.getElementById("btn-mode");
const textMode = document.getElementById("text-mode");
const lowerNum = document.getElementById("lower-num");
const lowerValue = document.getElementById("lower-value");
const higherNum = document.getElementById("higher-num");
const higherValue = document.getElementById("higher-value");
const tempNum = document.getElementById("temp-num");
const tempValue = document.getElementById("temp-value");

const btnRelay = document.getElementById("btn-relay");
const textRelay = document.getElementById("text-relay");
const btnFan = document.getElementById("btn-fan");
const textFan = document.getElementById("text-fan");

const setting = ref(database, 'Cài đặt');
onValue(setting, (snapshot) => {
    const data = snapshot.val();
    btnMode.checked = data['Auto'];
    textMode.textContent = (data['Auto']?'Tự động':'Thủ công');
    btnRelay.disabled = data['Auto'];
    btnFan.disabled = data['Auto'];

    lowerValue.value = data['Ngưỡng dưới'];
    lowerNum.textContent = data['Ngưỡng dưới'];

    higherValue.value = data['Ngưỡng trên'];
    higherNum.textContent = data['Ngưỡng trên'];

    tempValue.value = data['Ngưỡng nhiệt'];
    tempNum.textContent = data['Ngưỡng nhiệt'];
});

const status = ref(database, 'Trạng thái');
onValue(status, (snapshot) => {
    const data = snapshot.val();
    btnRelay.checked = data['Máy bơm'];
    textRelay.textContent = data['Máy bơm']?'BẬT':'TẮT';
    btnFan.checked = data['Quạt'];
    textFan.textContent = data['Quạt']?'BẬT':'TẮT';
});

document.querySelectorAll(".range-wrapper input[type=range]").forEach(r => {
    var rangeValue = r.closest('.range-wrapper').querySelector('label');
    
    r.oninput = () => {
        updateSetting();
        rangeValue.textContent = r.value;
    }
})

btnMode.onchange = () => {
    updateSetting();
}

document.querySelectorAll(".active-button input").forEach(btn => {
    btn.onchange = () => {
        activeDevice();
    }
})


function updateSetting() {
    var postData = {
        'Auto': btnMode.checked,
        'Ngưỡng dưới': parseInt(lowerValue.value),
        'Ngưỡng trên': parseInt(higherValue.value),
        'Ngưỡng nhiệt': parseInt(tempValue.value),
    }

    const updates = {};
    updates['/Cài đặt/'] = postData;

    return update(ref(database), updates);
}

function activeDevice() {
    var postData = {
        'Máy bơm': btnRelay.checked,
        'Quạt': btnFan.checked,
    }

    const updates = {};
    updates['/Trạng thái/'] = postData;

    return update(ref(database), updates);
}