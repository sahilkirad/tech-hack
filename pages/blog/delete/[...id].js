import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [blogInfo, setBlogInfo] = useState();

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/blog?id=${id}`).then((response) => {
      setBlogInfo(response.data);
    });
  }, [id]);

  const deleteBlog = async () => {
    await axios.delete(`/api/blog?id=${id}`);
    router.push("/blog");
  };

  return (
    <Layout>
      <h1>
        Are you sure you want to delete the blog: &quot;{blogInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteBlog} className="btn-red">
          Yes
        </button>
        <button onClick={() => router.push("/blog")} className="btn-default">
          No
        </button>
      </div>
    </Layout>
  );
}
