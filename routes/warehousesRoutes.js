import express from 'express';
import * as warehousesController from "../controllers/warehouses-controller.js";

const router = express.Router();

router
.route('/')
.get(warehousesController.index);

router
  .route('/:id')
  .delete(warehousesController.remove);

export default router;