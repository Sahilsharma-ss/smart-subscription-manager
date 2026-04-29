import { pool } from "../db/db.js";

export const getMetadata = async (req, res) => {
  try {
    const [categories, services, plans] = await Promise.all([
      pool.query("SELECT * FROM categories ORDER BY name"),
      pool.query("SELECT * FROM services ORDER BY name"),
      pool.query("SELECT * FROM subscription_plans ORDER BY plan_name"),
    ]);

    return res.json({
      categories: categories.rows,
      services: services.rows,
      plans: plans.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch metadata" });
  }
};
