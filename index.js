import "dotenv/config";
import express from "express";
import cors from "cors";
import warehousesRoutes from "./routes/warehousesRoutes.js";
import inventoriesRoutes from "./routes/inventoriesRoutes.js"

const app = express();

// Middleware
const { CORS_ORIGIN } = process.env;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Basic Route
app.use("/api/warehouses", warehousesRoutes);
app.use("/api/inventories", inventoriesRoutes);

// Server Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
