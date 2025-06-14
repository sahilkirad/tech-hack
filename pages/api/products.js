import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  switch (method) {
    case 'GET':
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        return res.status(200).json(product);
      } else {
        const products = await Product.find();
        return res.status(200).json(products);
      }

    case 'POST': {
      const { title, description, price, images, properties } = req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        properties,
      });
      return res.status(201).json(productDoc);
    }

    case 'PUT': {
      const { _id, title, description, price, images, properties } = req.body;
      await Product.updateOne({ _id }, { title, description, price, images, properties });
      return res.status(200).json({ success: true });
    }

    case 'DELETE': {
      if (req.query?.id) {
        await Product.deleteOne({ _id: req.query.id });
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ error: 'Product ID required' });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
