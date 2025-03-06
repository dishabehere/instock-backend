import initKnex from "knex";
import configuration from "../knexfile.js";
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
    const inventoryDeleted = await knex("inventories")
      .where({ warehouse_id: req.params.id })
      .delete();

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

export {
  index,
  findOne,
  remove
}
