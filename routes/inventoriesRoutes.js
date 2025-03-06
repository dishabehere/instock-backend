import express from "express";
import * as inventoriesController from "../controllers/inventories-controllers.js";

const router = express.Router();

router.route("/")
.get(inventoriesController.index);

router
.route("/:id")
.get(inventoriesController.findOne)
.delete(inventoriesController.remove);

export default router;
