#include <FirebaseESP8266.h>
#include <DHT.h>
#include  <ESP8266WiFi.h>

#define FIREBASE_HOST "https://iot-bluegreen-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "Rs0tMRoHdDBov6GRPhQZddaaKTicjce9uqvmraNa"
#define WIFI_SSID "FPT Thua Luu" // Thay đổi tên wifi của bạn
#define WIFI_PASSWORD "fptfptfpt" // Thay đổi password wifi của bạn

FirebaseData fbdo;

#define relayFan 3
#define relayPump 2
const int sensorMoisturePin = A0;
const int DHTPIN = 4;
const int DHTTYPE = DHT11;
DHT dht(DHTPIN, DHTTYPE);

bool pump, fan;

void setup() {

  Serial.begin(9600);
  delay(1000);
  WiFi.begin (WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Đang kết nối...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println ("");
  Serial.println ("Đã kết nối WiFi!");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  dht.begin();
  pinMode(relayFan, OUTPUT);
  pinMode(relayPump, OUTPUT);
}

void loop() {
  // Đọc nhiệt độ và độ ẩm không khí
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Đọc độ ẩm đất  
  int sensorMoisture = analogRead(sensorMoisturePin);
  int percentMoisture = map(sensorMoisture, 0, 1023, 100, 0);

  Serial.println(t);

  Firebase.setFloat( fbdo, "Thông số/Độ ẩm đất", percentMoisture);
  Firebase.setFloat( fbdo, "Thông số/Độ ẩm không khí", h);
  Firebase.setFloat( fbdo, "Thông số/Nhiệt độ", t);
  
  bool autoMode = false;
  
  if (Firebase.getBool(fbdo, "Cài đặt/Auto")) {
    autoMode = fbdo.boolData();
  }

  if (autoMode) { //Auto mode
    int lower, higher, temp;

    // Lấy dữ liệu setting từ firebase
    if (Firebase.getInt(fbdo, "Cài đặt/Ngưỡng dưới")) {
      lower = fbdo.intData();
    }
    if (Firebase.getInt(fbdo, "Cài đặt/Ngưỡng trên")) {
      higher = fbdo.intData();
    }
    if (Firebase.getInt(fbdo, "Cài đặt/Ngưỡng nhiệt")) {
      temp = fbdo.intData();
    }

    if (percentMoisture < lower) {
      pump = true;
    }

    if (percentMoisture > higher) {
      pump = false;
    }

    if (t > temp) {
      fan = true;
    } else {
      fan = false;
    }
    
    Firebase.setBool( fbdo, "Trạng thái/Máy bơm", pump);
    Firebase.setBool( fbdo, "Trạng thái/Quạt", fan);
    
  } else { //Manual mode

    if (Firebase.getBool(fbdo, "Trạng thái/Máy bơm")) {
      pump = fbdo.boolData();
    }
  
    if (Firebase.getBool(fbdo, "Trạng thái/Quạt")) {
      fan = fbdo.boolData();
    }
  }

  toggleRelay(relayPump, pump);
  toggleRelay(relayFan, fan);

  delay(200);
}

// Chuyển đổi trạng thái Relay
void toggleRelay(int relay, bool toggle) {
  if (toggle) {
    digitalWrite(relay, HIGH);  
  } else {
    digitalWrite(relay, LOW);  
  }
}
