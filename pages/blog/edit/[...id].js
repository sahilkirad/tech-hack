import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "@/components/BlogForm";

export default function EditBlog() {
  const [blogInfo, setBlogInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/blog?id=${id}`).then((response) => {
      setBlogInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1>Edit Blog</h1>
      {blogInfo && <BlogForm {...blogInfo} />}
    </Layout>
  );
}
