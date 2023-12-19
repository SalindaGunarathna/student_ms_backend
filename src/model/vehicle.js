const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    vehicleId: { type: String, required: true, unique: true }, 
    chassisNumber: { type: String, required: true }, // Chassis number for reference
    engineNo: { type: String, required: true}, 
    vehicleState: { type: String, required: true }, // State where the vehicle is registered
    companyName: { type: String, required: true }, // Name of the owning company
    numberOfDoors: { type: Number, required: true }, // Number of doors on the vehicle
    color: { type: String, required: true},
    seatingCapacity: { type: Number, required: true }, // Maximum number of passengers
    condition: { type: String, required: true }, // Vehicle condition (e.g., excellent, good, fair)
    dimensions: { // Object to store length, height, and width
        length: { type: Number, required: true }, // Vehicle length in meters
        height: { type: Number, required: true }, // Vehicle height in meters
        width: { type: Number, required: true }, // Vehicle width in meters
    },
    engineDisplacement: { type: Number, required: true }, // Engine cylinder capacity in liters
    fuelType: { type: String, required: true }, 
    manufacturedCountry: { type: String, required: true }, // Country of origin
    assembled: { type: Boolean, required: true }, // Whether the vehicle was locally assembled
    vehicleType: { type: String, required: true }, // Category of the vehicle (e.g., truck, van, car)
    brand: { type: String, required: true },
    album:[ { 
        
        photoURL :{type: String},
        photID :{type: String}
    
    }], 
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
