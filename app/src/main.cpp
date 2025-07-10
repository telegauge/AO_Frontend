#include <Arduino.h>
#include <WiFi.h>
#include <FS.h>
#include <SPIFFS.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <Wire.h>

#define LED_PIN 13
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

String ssid, password, device_name;

void loadWiFiConfig()
{
	File file = SPIFFS.open("/wifi.json");
	if (!file)
		return;
	StaticJsonDocument<256> doc;
	DeserializationError err = deserializeJson(doc, file);
	if (err)
		return;
	ssid = doc["ssid"].as<String>();
	password = doc["password"].as<String>();
	device_name = doc["device_name"].as<String>();
	file.close();
}

void showStatus(const char *status, const char *ip = "")
{
	display.clearDisplay();
	display.setTextSize(1);
	display.setTextColor(SSD1306_WHITE);
	display.setCursor(0, 0);
	display.print("WiFi: ");
	display.println(status);
	if (ip && strlen(ip) > 0)
	{
		display.print("IP: ");
		display.println(ip);
	}
	display.display();
}

void scanI2C()
{
	Serial.println("Scanning I2C bus...");
	byte count = 0;
	for (byte address = 1; address < 127; ++address)
	{
		Wire.beginTransmission(address);
		if (Wire.endTransmission() == 0)
		{
			Serial.print("Found I2C device at 0x");
			if (address < 16)
				Serial.print("0");
			Serial.println(address, HEX);
			count++;
			delay(1);
		}
	}
	if (count == 0)
		Serial.println("No I2C devices found");
}

void setup()
{
	Serial.begin(115200);
	pinMode(LED_PIN, OUTPUT);
	if (!SPIFFS.begin(true))
	{
		Serial.println("SPIFFS Mount Failed");
		return;
	}
	loadWiFiConfig();
	WiFi.setHostname(device_name.c_str());

	Wire.begin();
	delay(100);
	scanI2C();
	if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
	{
		Serial.println("SSD1306 allocation failed");
		for (;;)
			;
	}
	showStatus("Connecting...");
	WiFi.begin(ssid.c_str(), password.c_str());
	int tries = 0;
	while (WiFi.status() != WL_CONNECTED && tries < 20)
	{
		delay(500);
		showStatus("Connecting...", "");
		tries++;
	}
	if (WiFi.status() == WL_CONNECTED)
	{
		showStatus("Connected", WiFi.localIP().toString().c_str());
		Serial.print("WiFi connected. IP address: ");
		Serial.println(WiFi.localIP());
	}
	else
	{
		showStatus("Failed", "");
	}
}

void loop()
{
	Serial.println("IP address: " + WiFi.localIP().toString() + " " + WiFi.getHostname() + " " + device_name);
	digitalWrite(LED_PIN, HIGH);
	delay(5000);
	digitalWrite(LED_PIN, LOW);
	delay(5000);
}