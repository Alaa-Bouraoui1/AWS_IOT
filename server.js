const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

// Initialize express server
const app = express();
app.use(cors());
app.use(express.json());

// AWS IoT Core endpoint and certificate paths
//const endpoint = "YOUR_IOT_ENDPOINT"; // Replace with your AWS IoT Core endpoint
const certPath = path.join(__dirname, "iot-device/certificate.pem.crt");
const keyPath = path.join(__dirname, "iot-device/private.pem.key");
const caPath = path.join(__dirname, "iot-device/AmazonRootCA1.pem");

// Store received data
let receivedData = "";

const options = {
  clientId: "MyMERNApp",
  cert: fs.readFileSync(
    path.join(__dirname, "certif", "key-certificate.pem.crt")
  ), // Device certificate
  key: fs.readFileSync(path.join(__dirname, "certif", "key-private.pem.key")), // Private key
  ca: [
    fs.readFileSync(path.join(__dirname, "certif", "AmazonRootCA1.pem")), // Root CA 1
    fs.readFileSync(path.join(__dirname, "certif", "AmazonRootCA3.pem")), // Root CA 3
  ],
  protocol: "mqtts",
};
// Connect to AWS IoT Core MQTT broker
const client = mqtt.connect(`your endpoint`, options);

// On successful connection, subscribe to the topic 'test/#'
client.on("connect", () => {
  console.log("Connected to AWS IoT Core");
  client.subscribe("test/#", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to test/#");
    }
  });
});

// Handle received messages
client.on("message", (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
  receivedData = message.toString(); // Store the latest data
});

// API route to send data to the frontend
app.get("/api/data", (req, res) => {
  res.json({ data: receivedData });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
