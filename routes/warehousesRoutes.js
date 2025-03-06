import express from "express";
import * as warehousesController from "../controllers/warehouses-controller.js";
import * as inventoriesController from "../controllers/inventories-controllers.js";

const router = express.Router();

router
.route("/")
.get(warehousesController.index);

router
  .route("/:id")
  .get(warehousesController.findOne)
  .delete(warehousesController.remove);

router
.route('/:id/inventories')
.get(inventoriesController.getInventoriesByWarehouse);

export default router;
