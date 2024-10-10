const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Add this line to load .env variables

const app = express();
const port = process.env.PORT || 5000; // Use the port from the .env file or default to 5000

// Connect to MongoDB using the URI from the .env file
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a Calculation model
const CalculationSchema = new mongoose.Schema({
    expression: String,
    result: Number,
    timestamp: { type: Date, default: Date.now },
});

const Calculation = mongoose.model('history', CalculationSchema);

// Middleware to parse the body of POST requests
app.use(bodyParser.json());

// Enable CORS for all requests
app.use(cors());

// Endpoint for calculation
app.post('/calculate', async (req, res) => {
    const { expression } = req.body;
    console.log(expression);
    
    try { 

    

        // Check if the expression contains a division by zero
        if (/\/\s*0/.test(expression)) {
            return res.status(400).json({ error: "inf" });
        }

        // Evaluate the expression securely using Function
        const result = new Function('return ' + expression)();

        // Check if the result is a valid number
        if (isNaN(result)) {
            return res.status(400).json({ error: "Invalid expression" });
        } 

        // Save the calculation to the database
        const calculation = new Calculation({ expression, result });
        await calculation.save();

        // Send the result back to the frontend
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: "Expression Invalid" });
    }
});


// Endpoint to get the last 10 calculations
app.get('/history', async (req, res) => {
    try {
        const calculations = await Calculation.find()
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order
            .limit(10); // Get only the last 10 calculations

        res.json(calculations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching calculations" });
    }
});

// Clear all history
app.delete('/history', async (req, res) => {
    console.log("Try to delete ")
    try {
        await Calculation.deleteMany(); // Clear all history from the database
        res.status(200).json({ message: "History cleared successfully." }); // Sending JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to clear history." }); // Sending JSON response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Calculator backend is running on http://localhost:${port}`);
});
