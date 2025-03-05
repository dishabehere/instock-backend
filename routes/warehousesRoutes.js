import express from 'express';
import * as warehousesController from "../controllers/warehouses-controller.js";

const router = express.Router();

router
.route('/')
.get(warehousesController.index);

export default router;