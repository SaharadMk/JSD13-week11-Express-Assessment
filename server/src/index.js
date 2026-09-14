import express from "express";
import cors from "cors";
import { products } from "./fakeDB/fakeDB.js";

const app = express();

// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "http://localhost:5175",
//   ], // frontend domain
//   credentials: true, // ✅ allow cookies
// };
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

// Helper สำหรับส่ง Error Response ให้เป็นมาตรฐานเดียวกันทั้ง API
const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

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
      // FIX 1: เปลี่ยนมาใช้ sendError() เพื่อให้ response format ตรงกับ endpoint อื่น
      return sendError(res, 404, "Product not found!");
    }

    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

app.post("/products", (req, res, next) => {
  try {
    const { name, price, quantity } = req.body;

    // FIX 2: ปรับ Validation และใช้ sendError() แทนโครงสร้างเดิม
    if (!name || price === undefined) {
      return sendError(res, 400, "Name and price are required");
    }

    // สร้าง product ชิ้นใหม่
    const newProduct = {
      id: String(Date.now()), // สร้าง id จาก Timestamp ตามโจทย์
      name: name,
      price: price,
      quantity: quantity !== undefined ? Number(quantity) : 1, // ถ้าไม่ส่ง quantity มา ให้เป็นค่า default คือ 1
    };

    // โค้ดส่วนบนของการสร้าง newProduct ยังเหมือนเดิม
    products.push(newProduct);

    // เปลี่ยนบรรทัด return เป็นแบบนี้
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      newProduct: newProduct,
    });
  } catch (err) {
    next(err);
  }
});

app.put("/products/:id", (req, res, next) => {
  try {
    // FIX 3: เปลี่ยนชื่อตัวแปร u เป็น p เพื่ออ่านโค้ดเข้าใจง่ายขึ้น และเปลี่ยนมาใช้ sendError()
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found!");
    }
    const { name, price, quantity } = req.body;

    // FIX 4: ใช้ sendError() และปรับข้อความให้เป็นมาตรฐานเดียวกับ POST
    if (!name || price === undefined) {
      return sendError(res, 400, "Name and price are required");
    }
    product.name = String(name);
    product.price = Number(price);
    product.quantity =
      quantity !== undefined ? Number(quantity) : product.quantity;

    return res.status(200).json({
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
      // FIX 5: เปลี่ยนมาใช้ sendError()
      return sendError(res, 404, "Product not found!");
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

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  return sendError(
    res,
    500,
    `Something went wrong on the server: ${err.message}`,
  );
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
