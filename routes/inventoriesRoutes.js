import express from 'express';
import * as inventoriesController from "../controllers/inventories-controllers.js";

const router = express.Router();

router
.route('/')
.get(inventoriesController.index);

export default router;