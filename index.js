const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { calculator, initialState } = require("./calculator");

const app = express();
const PORT = 5000; // You can change this port if needed

app.use(cors());
app.use(bodyParser.json());

// Define API route
app.post("/calculate", (req, res) => {
  const { type, value, state } = req.body;
  
  // Perform calculation based on type and value
  const newState = calculator(type, value, state || initialState);

  res.json(newState);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
