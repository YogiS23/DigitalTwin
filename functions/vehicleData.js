const { v4: uuidv4 } = require('uuid');

exports.handler = async function(event, context) {
  // Simulate vehicle data
  const vehicleData = {
    id: 'VEH001',
    speed: Math.random() * 120,
    acceleration: (Math.random() - 0.5) * 20,
    location: { 
      lat: 40 + (Math.random() - 0.5) * 0.1, 
      lon: -74 + (Math.random() - 0.5) * 0.1 
    },
    engineTemperature: 80 + Math.random() * 40,
    fuelLevel: Math.random() * 100,
    lastUpdated: new Date().toISOString()
  };

  // Simple accident detection
  const isAccident = Math.abs(vehicleData.acceleration) > 10 || vehicleData.engineTemperature > 110;

  if (isAccident) {
    console.log('Potential accident detected!');
    // In a real scenario, you would interact with a blockchain here
    console.log('Logging accident data to blockchain...');
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(vehicleData)
  };
};