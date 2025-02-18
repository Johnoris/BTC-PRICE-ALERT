import express from "express";
import { checkPrice } from "../services/price";

const alertsRouter = express.Router();

// GET Current Bitcoin Price
alertsRouter.get("/price", async (_req, res) => {
  try {
    const btcRes = await checkPrice();
    res.status(200).json(btcRes);
  } catch (error) {
    console.error("Error fetching the Bitcoin price:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking the Bitcoin price." });
  }
});

export default alertsRouter;
