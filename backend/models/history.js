// backend/models/history.js
const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    expression: String,
    result: Number,
    timestamp: { type: Date, default: Date.now },
});

const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = Calculation;
