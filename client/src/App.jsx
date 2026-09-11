import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/Theme";

export default function App() {
  const { lightTheme, darkTheme, theme, setTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false); //เก็บสถานะการโหลดข้อมูล
  const [products, setProducts] = useState([]); //เก็บค่าข้อมูลที่fetchมา
  const [error, setError] = useState(null); //เก็บสถานะ ถ้าไม่สามารถดึงข้อมูลได้

  // Fetch ข้อมูลจาก Server มาที่ Client
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // เปลี่ยน URL มาชี้ที่ Backend ของคุณ
        const response = await fetch("http://localhost:3001/products");

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
