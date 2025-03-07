import initKnex from "knex";
import configuration from "../knexfile.js";
import {excludeTimestamps} from '../Utils/functionsUtils.js';
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    const rawData = await knex("inventories")
      .select("inventories.*", "warehouses.warehouse_name")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id");

    const data = rawData.map(
      ({ updated_at, created_at, warehouse_id, ...rest }) => ({
        ...rest,
        warehouse_name: rest.warehouse_name,
      })
    );
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving Inventories List: ${error}`);
  }
};

//get a single inventory item
const findOne = async (req, res) => {
  try {
    const inventoryFound = await knex("inventories")
      .select("inventories.*", "warehouses.warehouse_name")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where("inventories.id", req.params.id)
      .first();

    if (!inventoryFound) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    const { updated_at, created_at, warehouse_id, ...data } =
      inventoryFound;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Unable to retrieve inventory data with inventory ID ${req.params.id}`,
    });
  }
};

//Delete inventory item
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryDeleted = await knex("inventories")
      .where({ id })
      .delete();

    if (inventoryDeleted === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${id} not found`,
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error deleting inventory with ID ${req.params.id}`,
    });
  }
};

// Create a new inventory item
const add = async (req, res) => {
  try {
    const { warehouse_id, item_name, description, category, status, quantity } = req.body;

    if (!warehouse_id || !item_name || !description || !category || !status || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const warehouseExists = await knex("warehouses").where({ id: warehouse_id }).first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id. Warehouse not found." });
    }

    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number." });
    }

    const [newInventoryId] = await knex("inventories")
      .insert(req.body);

    const createdInventory = await knex("inventories").where({ id: newInventoryId }).first();
    const filteredInventory = excludeTimestamps(createdInventory);

    res.status(201).json(filteredInventory);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error creating inventory item.", error: error.message });
  }
};

// Update an existing inventory item
const update = async (req, res) => {
  try {
    console.log("called");
    const { id } = req.params;
    const { warehouse_id, item_name, description, category, status, quantity } = req.body;

    const existingInventory = await knex("inventories").where({ id }).first();
    console.log("existing inventory", existingInventory, id);
    if (!existingInventory) {
      return res.status(404).json({ message: `Inventory with ID ${id} not found` });
    }

    if (!warehouse_id || !item_name || !description || !category || !status || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const warehouseExists = await knex("warehouses").where({ id: warehouse_id }).first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "Invalid warehouse_id. Warehouse not found." });
    }

    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number." });
    }

    await knex("inventories")
      .where({ id })
      .update(req.body);

    const updatedInventory = await knex("inventories")
      .select("inventories.*", "warehouses.warehouse_name")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where("inventories.id", id)
      .first();

    const { updated_at, created_at, ...filteredInventory } = updatedInventory;

    res.status(200).json(filteredInventory);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error updating inventory item.", error: error.message });
  }
};

export { index, findOne, remove, add, update };
