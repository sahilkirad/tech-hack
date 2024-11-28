import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products with images and their Google Drive links
    axios.get('/api/products').then(response => {
      setProducts(response.data); // Ensure response includes 'images' field
    });
  }, []);

  return (
    <Layout>
      <Link className="btn-primary" href={'/products/new'}>Add new product</Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Product name</td>
            <td>Drive Link</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.title}</td>

              {/* Display Images */}
              <td>
                {product.images?.length > 0 ? (
                  product.images.map((link, index) => (
                    <div key={index} className="mb-2">
                      {/* Google Drive Link */}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View on Google Drive
                      </a>
                    </div>
                  ))
                ) : (
                  <span>No images available</span>
                )}
              </td>

              {/* Actions */}
              <td>
                <Link className="btn-default" href={`/products/edit/${product._id}`}>
                  Edit
                </Link>
                <Link className="btn-red" href={`/products/delete/${product._id}`}>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
