import express from "express";
import cors from "cors";
import { products } from "./fakeDB/fakeDB.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/products", (req, res, next) => {
  try {
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get("/products/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

app.post("/products", (req, res, next) => {
  try {
    const { name, price, quantity } = req.body;

    // Validation: ตรวจสอบว่ามี name และ price ส่งมาหรือไม่
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Products required for name and price",
      });
    }

    // สร้าง product ชิ้นใหม่
    const newProduct = {
      id: String(Date.now()), // สร้าง id จาก Timestamp ตามโจทย์
      name: name,
      price: price,
      quantity: quantity !== undefined ? Number(quantity) : 1, // ถ้าไม่ส่ง quantity มา ให้เป็นค่า default คือ 1
    };

    products.push(newProduct);

    return res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

app.put("/products/:id", (req, res, next) => {
  try {
    const product = products.find((u) => u.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }
    const { name, price, quantity } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "name and price required" });
    }

    product.name = String(name);
    product.price = Number(price);
    product.quantity = quantity !== undefined ? Number(quantity) : product.quantity;

    return res
      .status(200)
      .json({
        success: true,
        message: "Product updated successfully",
        updatedProduct: product,
      });
  } catch (err) {
    next(err);
  }
});

app.delete("/products/:id", (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const [deleted] = products.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: deleted,
    });
  } catch (err) {
    next(err);
  }
});

const PORT = 3001;

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit the process with an error code
  }
}

start();
