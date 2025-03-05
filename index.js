require('dotenv').config();
const express = require('express');
const cors = require('cors');

import warehousesRoutes from "./routes/warehousesRoutes.js"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get("/" , warehousesRoutes); 

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
