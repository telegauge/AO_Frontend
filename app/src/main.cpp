#include <Arduino.h>

#define LED_PIN 13 // Common onboard LED pin for ESP32 Feather

void setup()
{
	pinMode(LED_PIN, OUTPUT);
}

void loop()
{
	Serial.begin(115200);
	Serial.println("Hello World");
	digitalWrite(LED_PIN, HIGH);
	delay(500);
	digitalWrite(LED_PIN, LOW);
	delay(500);
}