import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      // Fetch all orders, sorted by creation date (newest first)
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
  } else if (req.method === "POST") {
    // Extract fields from the request body
    const { line_items, name, email, city, postalCode, streetAddress, country, paid } = req.body;

    // Validate the received line_items
    if (!Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ error: "Line items are required and must be an array." });
    }

    // Validate line_items structure
    for (const item of line_items) {
      if (
        !item.price_data ||
        !item.price_data.product_data ||
        !item.price_data.product_data.name ||
        typeof item.price_data.price !== "number" ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          error: "Each line item must include product name, price, and quantity.",
        });
      }
    }

    try {
      // Create a new order
      const newOrder = await Order.create({
        line_items,
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid,
      });
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order", details: error.message });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: "Method not allowed" });
  }
}
