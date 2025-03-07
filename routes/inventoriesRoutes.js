import express from "express";
import * as inventoriesController from "../controllers/inventories-controllers.js";


const router = express.Router();

router.route("/")
.get(inventoriesController.index)
.post(inventoriesController.add);

router
.route("/:id")
.get(inventoriesController.findOne)
.delete(inventoriesController.remove)
.put(inventoriesController.update);


export default router;
