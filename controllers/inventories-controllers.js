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

export { index };
