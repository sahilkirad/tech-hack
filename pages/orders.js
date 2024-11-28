import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    line_items: [],
    name: "",
    email: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    country: "",
    paid: false,
  });

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  const addProduct = () => {
    setNewOrder((prev) => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        { price_data: { product_data: { name: "" }, price: 0 }, quantity: 1 },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/orders", newOrder);
      setOrders((prev) => [response.data, ...prev]);
      setNewOrder({
        line_items: [],
        name: "",
        email: "",
        city: "",
        postalCode: "",
        streetAddress: "",
        country: "",
        paid: false,
      });
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <Layout>
      <h1>Orders</h1>

      {/* Form to add new orders */}
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="btn-primary">Add New Order</h2>
        <div>
          <label>Recipient Name</label>
          <input
            type="text"
            value={newOrder.name}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={newOrder.email}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            placeholder="City"
            value={newOrder.city}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, city: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={newOrder.postalCode}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, postalCode: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Street Address"
            value={newOrder.streetAddress}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, streetAddress: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={newOrder.country}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, country: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Paid</label>
          <input
            type="checkbox"
            checked={newOrder.paid}
            onChange={(e) => setNewOrder((prev) => ({ ...prev, paid: e.target.checked }))}
          />
        </div>
        <div>
          <h3>Products</h3>
          {newOrder.line_items.map((item, index) => (
            <div key={index} className="product-item">
              <input
                type="text"
                placeholder="Product Name"
                value={item.price_data.product_data.name}
                onChange={(e) => {
                  const updatedItems = [...newOrder.line_items];
                  updatedItems[index].price_data.product_data.name = e.target.value;
                  setNewOrder((prev) => ({ ...prev, line_items: updatedItems }));
                }}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => {
                  const updatedItems = [...newOrder.line_items];
                  updatedItems[index].quantity = parseInt(e.target.value, 10);
                  setNewOrder((prev) => ({ ...prev, line_items: updatedItems }));
                }}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price_data.price}
                onChange={(e) => {
                  const updatedItems = [...newOrder.line_items];
                  updatedItems[index].price_data.price = parseFloat(e.target.value);
                  setNewOrder((prev) => ({ ...prev, line_items: updatedItems }));
                }}
                required
              />
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={addProduct}>
            Add Product
          </button>
        </div><br/>
        <button type="submit" className="btn-primary">Create Order</button>
      </form>

      {/* Display existing orders */}
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td>
                  {Array.isArray(order.line_items) ? (
                    order.line_items.map((l, index) => (
                      <div key={index}>
                        {l.price_data?.product_data?.name || "Unknown Product"} x {l.quantity || 1} @ ${l.price_data?.price || 0}
                      </div>
                    ))
                  ) : (
                    <span>No items</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
