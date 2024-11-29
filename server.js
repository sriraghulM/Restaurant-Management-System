const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/Routes");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(express.json());

// Validate environment variables
if (!process.env.MONGO_URI || !process.env.PORT) {
  throw new Error("MONGO_URI or PORT is not defined in the environment variables");
}

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  } catch (error) {
    console.error("COULD NOT CONNECT TO DATABASE:", error.message);
    process.exit(1); // Exit if the database connection fails
  }
})();


// Enable CORS
app.use(cors());

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to access raw Swagger JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Use routes
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
