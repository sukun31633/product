'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_code: '', product_name: '', price: '' });
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // ดึงข้อมูลสินค้า
  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  // ค้นหาสินค้าตามรหัสสินค้า
  const searchProduct = async () => {
    const res = await fetch(`/api/products?product_code=${searchCode}`);
    const data = await res.json();
    setSearchResult(data);
  };

  // เพิ่มสินค้า
  const addProduct = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert('Product added!');
    setForm({ product_code: '', product_name: '', price: '' });
    fetchProducts(); // โหลดข้อมูลใหม่
  };

  // ลบสินค้า
  const deleteProduct = async (id) => {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    alert('Product deleted!');
    fetchProducts(); // โหลดข้อมูลใหม่
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function สำหรับแปลงวันที่
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* ฟอร์มเพิ่มสินค้า */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="รหัสสินค้า"
          value={form.product_code}
          onChange={(e) => setForm({ ...form, product_code: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={form.product_name}
          onChange={(e) => setForm({ ...form, product_name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="ราคา"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2">
          เพิ่มรายการ
        </button>
      </div>

      {/* ฟอร์มค้นหา */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="ค้นหาโดยใช้รหัสสินค้า"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={searchProduct} className="bg-green-500 text-white px-4 py-2">
          ค้นหา 
        </button>
      </div>

      {/* แสดงผลการค้นหา */}
      {searchResult && (
        <div className="mb-4 border p-4 bg-gray-100">
          <h2 className="text-lg font-bold">Search Result:</h2>
          {searchResult.id ? (
            <p>
              <strong>{searchResult.product_code}</strong> - {searchResult.product_name} - 
              {searchResult.price} บาท <br />
              <small>Created At: {formatDate(searchResult.created_at)}</small>
            </p>
          ) : (
            <p>No product found.</p>
          )}
        </div>
      )}

      {/* รายการสินค้า */}
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-2">
            <strong>{product.product_code}</strong> - {product.product_name} - {product.price} บาท<br />
            <small>Created At: {formatDate(product.created_at)}</small>
            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 text-white px-2 py-1 ml-4"
              
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
