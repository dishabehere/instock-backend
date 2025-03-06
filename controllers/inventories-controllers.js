import initKnex from "knex";
import configuration from "../knexfile.js";
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

const getInventoriesByWarehouse = async (req, res) => {
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

export { index, findOne, getInventoriesByWarehouse };
