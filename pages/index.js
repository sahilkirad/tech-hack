import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { useState, useEffect } from "react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function Home() {
  const { data: session } = useSession();
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const productRes = await axios.get('/api/products');
      const orderRes = await axios.get('/api/orders');
      setProductData(productRes.data);
      setOrderData(orderRes.data);
    }
    fetchData();
  }, []);

  const productChartData = {
    labels: productData.map(product => product.title),
    datasets: [
      {
        label: "Price (USD)",
        data: productData.map(product => product.price),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Aggregating the total quantity of items ordered by each user
  const aggregatedOrderData = orderData.reduce((acc, order) => {
    const username = order.name || "Unknown";
    if (!acc[username]) {
      acc[username] = 0;
    }

    // Sum up the quantities for each item in the order's line_items
    if (Array.isArray(order.line_items)) {
      order.line_items.forEach(item => {
        acc[username] += item.quantity || 0;
      });
    }

    return acc;
  }, {});

  // Preparing data for the order chart
  const orderChartData = {
    labels: Object.keys(aggregatedOrderData), // Usernames
    datasets: [
      {
        label: "Total Items Ordered",
        data: Object.values(aggregatedOrderData), // Total number of items ordered per user
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between mb-4">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="User Avatar" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
      <div className="charts grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-container bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Product Analytics</h3>
          <Bar data={productChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="chart-container bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Order Analytics by User</h3>
          <Bar data={orderChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </Layout>
  );
}
