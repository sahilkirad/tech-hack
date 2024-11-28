import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    axios.get("/api/blog").then((response) => {
      setBlogs(response.data);
    });
  }, []);

  const handleViewDetails = (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    setSelectedBlog(blog);
  };

  const closeDetails = () => {
    setSelectedBlog(null);
  };

  return (
    <Layout>
      <Link className="btn-primary" href="/blog/new">
        Add New Blog
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Title</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>
                <button
                  onClick={() => handleViewDetails(blog._id)}
                  className="text-blue-500 underline"
                >
                  {blog.title}
                </button>
              </td>
              <td>
                <Link className="btn-default" href={`/blog/edit/${blog._id}`}>
                  Edit
                </Link>
                <Link className="btn-red" href={`/blog/delete/${blog._id}`}>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBlog && (
        <div className="details-modal">
          <h2>{selectedBlog.title}</h2>
          <p>{selectedBlog.content}</p>
          <button onClick={closeDetails} className="btn-default mt-4">
            Close
          </button>
        </div>
      )}
    </Layout>
  );
}
