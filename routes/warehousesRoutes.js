import express from "express";
import * as warehousesController from "../controllers/warehouses-controller.js";
import * as inventoriesController from "../controllers/inventories-controllers.js";

const router = express.Router();

router
.route("/")
.get(warehousesController.index)
.post(warehousesController.createWarehouse);

router
  .route("/:id")
  .get(warehousesController.findOne)
  .delete(warehousesController.remove);

router
.route('/:id/inventories')
.get(warehousesController.inventories);

export default router;
