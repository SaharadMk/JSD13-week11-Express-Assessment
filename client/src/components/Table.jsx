export const tableList = () => {
  return (
    <div>
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
  );
};
