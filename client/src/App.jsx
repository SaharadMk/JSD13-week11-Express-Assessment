import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/Theme";

const API = "http://localhost:3001/products";

export default function App() {
  const { lightTheme, darkTheme, theme, setTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false); //เก็บสถานะการโหลดข้อมูล
  const [products, setProducts] = useState([]); //เก็บค่าข้อมูลที่fetchมา
  const [error, setError] = useState(null); //เก็บสถานะ ถ้าไม่สามารถดึงข้อมูลได้
  // เก็บค่าที่ผู้ใช้กำลังพิมพ์ในฟอร์ม
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: 1, // default ตามโจทย์
  });

  // Fetch ข้อมูลจาก Server มาที่ Client
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // เปลี่ยน URL มาชี้ที่ Backend ของคุณ
        const response = await fetch(API);

        // เช็ก HTTP Status เพื่อความปลอดภัย
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setProducts(data); // อัพเดทตัวproducts
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง"); //ทำการset state เมื่อเกิดerror ถ้าไม่สามารถดึงข้อมูลมาได้
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    // 1. (Option) ถามเพื่อความชัวร์ก่อนลบ
    const isConfirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?");
    if (!isConfirm) return;

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });

      // เช็ก HTTP Status เพื่อความปลอดภัย
      if (!response.ok) {
        throw new Error(
          `Cannot delete this product! HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      // เอา message จากฝั่ง Server มาแสดง Alert
      alert(data.message);
      // โชว์ใน Console ว่าลบอะไรไป (เพื่อการ Debug)
      console.log("สินค้าที่ถูกลบ:", data.deletedProduct);

      // อัปเดตหน้าจอ
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง"); //ทำการset state เมื่อเกิดerror ถ้าไม่สามารถดึงข้อมูลมาได้
    }
  };

  const handleAddProduct = async (e) => {
    // 🚨 สำคัญมาก: ป้องกันไม่ให้หน้าเว็บรีเฟรชตัวเองตอนกด Submit ฟอร์ม
    e.preventDefault();
    // เช็คเบื้องต้นว่ากรอกข้อมูลครบไหม (Frontend Validation)
    if (!formData.name || !formData.price) {
      alert("Please insert name and price");
      return;
    }
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // บอก Server ว่าเราส่งข้อมูลไปเป็น JSON นะ
        },
        body: JSON.stringify(formData), // แปลง Object เป็น String JSON
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง"); //ทำการset state เมื่อเกิดerror ถ้าไม่สามารถดึงข้อมูลมาได้
    }
  };

  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center p-10 w-full ${theme ? lightTheme : darkTheme}`}
      >
        {/* ส่วนหัวข้อ */}
        <h1 className="text-center leading-tight">
          Generation Thailand
          <br />
          Express - Assessment
        </h1>

        {/* ปุ่มสลับ Theme แยกออกมาต่างหาก */}
        <button
          onClick={() => setTheme(!theme)}
          className="mt-6 px-4 py-2 rounded bg-slate-800 text-white dark:bg-slate-200 dark:text-black cursor-pointer"
        >
          switch header theme
        </button>
      </div>
      <div className="w-full">
        <h1 className="text-center text-3xl font-bold">Product List</h1>

        {error && (
          <p className="text-center p-8 text-red-500 font-medium">{error}</p>
        )}

        {loading ? (
          <p className="text-center p-8 text-slate-500 font-medium">
            กำลังโหลดข้อมูล...
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center mt-6 overflow-x-auto ">
            <table className="w-full max-w-2xl text-left border-collapse border border-gray-300">
              {/* 1. ส่วนหัวตาราง (Header) */}
              <thead>
                <tr className="bg-gray-200 border-b border-gray-300">
                  <th className="p-3">สินค้า</th>
                  <th className="p-3 text-center">ราคา</th>
                  <th className="p-3 text-center">จำนวน</th>
                  <th className="p-3 text-center">จัดการ</th>
                </tr>
              </thead>

              {/* 2. ส่วนข้อมูล (Body) */}
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3 text-center">฿{p.price}</td>
                    <td className="p-3 text-center">{p.quantity}</td>
                    {/* เพิ่มคอลัมน์ปุ่มลบตรงนี้ */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-700 hover:bg-red-400 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
