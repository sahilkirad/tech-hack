import { model, models, Schema } from "mongoose";

// Define the Order schema
const OrderSchema = new Schema(
  {
    line_items: [
      {
        price_data: {
          product_data: {
            name: { type: String, required: true },
          },
          price: { type: Number, required: true }, // Ensure price is saved as a Number
        },
        quantity: { type: Number, required: true },
      },
    ],
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    streetAddress: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Order model, or use the existing model if it already exists
export const Order = models?.Order || model("Order", OrderSchema);
