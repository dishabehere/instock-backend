import express from "express";
import * as warehousesController from "../controllers/warehouses-controller.js";

const router = express.Router();

router
.route("/")
.get(warehousesController.index)
.post(warehousesController.add);

router
  .route("/:id")
  .get(warehousesController.findOne)
  .put(warehousesController.update)
  .delete(warehousesController.remove);

router
.route('/:id/inventories')
.get(warehousesController.inventories);

export default router;
