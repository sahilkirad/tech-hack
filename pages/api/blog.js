import { Blog } from "@/models/Blog";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query.id) {
      const blog = await Blog.findById(req.query.id);
      res.json(blog);
    } else {
      const blogs = await Blog.find();
      res.json(blogs);
    }
  }

  if (method === "POST") {
    const { title, content } = req.body;
    const newBlog = await Blog.create({ title, content });
    res.json(newBlog);
  }

  if (method === "PUT") {
    const { id, title, content } = req.body;
    await Blog.findByIdAndUpdate(id, { title, content });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query.id) {
      await Blog.findByIdAndDelete(req.query.id);
      res.json(true);
    }
  }
}
