const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Web3 = require('web3');

const port = 3000;

// Connect to local Ethereum node (assumes you're running one)
const web3 = new Web3('http://localhost:8545');

// Vehicle data
let vehicleData = {
  id: 'VEH001',
  speed: 0,
  acceleration: 0,
  location: { lat: 0, lon: 0 },
  engineTemperature: 0,
  fuelLevel: 100,
  lastUpdated: new Date()
};

// Accident detection thresholds
const ACCELERATION_THRESHOLD = 10; // m/s^2
const TEMPERATURE_THRESHOLD = 110; // Celsius

// Update vehicle data and check for accidents
function updateVehicleData() {
  // Simulate more realistic vehicle behavior
  vehicleData.speed += (Math.random() - 0.5) * 5; // Speed changes gradually
  vehicleData.speed = Math.max(0, Math.min(vehicleData.speed, 120)); // Speed between 0 and 120
  
  vehicleData.acceleration = (Math.random() - 0.5) * 20; // Random acceleration
  
  vehicleData.location.lat += (Math.random() - 0.5) * 0.001;
  vehicleData.location.lon += (Math.random() - 0.5) * 0.001;
  
  vehicleData.engineTemperature = 80 + Math.random() * 40;
  vehicleData.fuelLevel = Math.max(0, vehicleData.fuelLevel - Math.random() * 0.1);
  vehicleData.lastUpdated = new Date();

  // Check for potential accidents
  if (Math.abs(vehicleData.acceleration) > ACCELERATION_THRESHOLD || 
      vehicleData.engineTemperature > TEMPERATURE_THRESHOLD) {
    detectAccident();
  }

  // Emit updated data to all connected clients
  io.emit('vehicleUpdate', vehicleData);
}

// Accident detection and blockchain logging
async function detectAccident() {
  console.log('Potential accident detected!');
  
  // In a real-world scenario, you would deploy a smart contract to handle this
  // For this example, we'll just log to the console
  console.log('Logging accident data to blockchain...');
  
  // Example of how you might interact with a smart contract
  // const accidentContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  // await accidentContract.methods.logAccident(vehicleData.id, vehicleData.location.lat, vehicleData.location.lon).send({from: ACCOUNT_ADDRESS});
  
  console.log('Accident data logged to blockchain');
}

// Update vehicle data every second
setInterval(updateVehicleData, 1000);

// Serve static files
app.use(express.static('public'));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A client connected');
  socket.emit('vehicleUpdate', vehicleData);
});

// Start the server
http.listen(port, () => {
  console.log(`Vehicle Monitoring System listening at http://localhost:${port}`);
});