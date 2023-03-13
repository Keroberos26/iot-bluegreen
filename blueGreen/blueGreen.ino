#include <FirebaseESP8266.h>
#include <DHT.h>
#include  <ESP8266WiFi.h>

#define FIREBASE_HOST "https://iot-bluegreen-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "Rs0tMRoHdDBov6GRPhQZddaaKTicjce9uqvmraNa"
#define WIFI_SSID "FPT Thua Luu" // Thay đổi tên wifi của bạn
#define WIFI_PASSWORD "fptfptfpt" // Thay đổi password wifi của bạn

FirebaseData fbdo;

const int sensorMoisturePin = A0;

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

}

void loop() {

  int sensorMoisture = analogRead(sensorMoisturePin);
  int percentMoisture = map(sensorMoisture, 0, 1023, 100, 0);

  Firebase.setFloat( fbdo,"Thông số/Độ ẩm đất", percentMoisture);

  delay(200);

}
