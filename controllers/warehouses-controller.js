import initKnex from "knex";
import configuration from "../knexfile.js";
import {excludeTimestamps} from '../functionsUtils.js';
const knex = initKnex(configuration);

const index = async (_req, res) => {
  try {
    const rawData = await knex("warehouses");
    const data = rawData.map(({ updated_at, created_at, ...rest }) => rest);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving Warehouses List: ${error}`);
  }
};

//Get single warehouse
const findOne = async (req, res) => {
  try {
    const warehousesFound = await knex("warehouses").where({ id: req.params.id });

    if (warehousesFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehousesFound[0];
    const { updated_at, created_at, ...data } = warehouseData;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

//Delete warehouse and inventory
const remove = async (req, res) => {
  try {
    const warehouseDeleted = await knex("warehouses")
      .where({ id: req.params.id })
      .delete();

    if (warehouseDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Unable to delete warehouse: ${error}`,
    });
  }
};


const inventories = async (req, res) => {
  try {
    const warehouseInventories = await knex("inventories")
      .where({warehouse_id: req.params.id})
      .select('id', 'item_name', 'category', 'status', 'quantity')

    res.status(200).json(warehouseInventories);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: `Unable to retrieve inventory data for warehouse ID ${req.params.id}`,
    });
  }
};

//Create new warehouse and add it
 
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex =
    /^(\+\d{1,3}[-]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  return phoneRegex.test(phoneNumber);
};

const add = async (req, res) => {
  try {
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    if (
      !warehouse_name ||
      !address ||
      !city ||
      !country ||
      !contact_name ||
      !contact_position ||
      !contact_phone ||
      !contact_email
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validateEmail(contact_email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validatePhoneNumber(contact_phone)) {
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    const [newWarehouseId] = await knex("warehouses").insert(req.body);
    const [createdWarehouse] = await knex("warehouses").where({
      id: newWarehouseId,
    });
    const filteredWarehouse = excludeTimestamps(createdWarehouse);

    res.status(201).json(filteredWarehouse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating warehouse.", error: error.message });
  }
};

// Update an existing warehouse
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    const existingWarehouse = await knex("warehouses").where({ id }).first();
    if (!existingWarehouse) {
      return res.status(404).json({ message: `Warehouse with ID ${id} not found` });
    }

    if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validateEmail(contact_email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validatePhoneNumber(contact_phone)) {
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    await knex("warehouses").where({ id }).update(req.body);
    
    const updatedWarehouse = await knex("warehouses").where({ id }).first();
    const { updated_at, created_at, ...filteredWarehouse } = updatedWarehouse;

    res.status(200).json(filteredWarehouse);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Error updating warehouse.", error: error.message });
  }
};


export {
  index,
  findOne,
  remove,
  inventories,
  add,
  update
}
