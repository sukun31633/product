import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// ดึงรายการสินค้า หรือค้นหาด้วยรหัสสินค้า
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const product_code = searchParams.get('product_code');

  try {
    if (product_code) {
      // ค้นหาสินค้าตามรหัสสินค้า
      const [rows] = await pool.query('SELECT * FROM products WHERE product_code = ?', [product_code]);
      return NextResponse.json(rows[0] || {}); // ถ้าไม่เจอสินค้า ให้คืนค่า {}
    } else {
      // ดึงสินค้าทั้งหมด
      const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// เพิ่มสินค้า
export async function POST(req) {
  const body = await req.json();
  const { product_code, product_name, price } = body;

  try {
    await pool.query('INSERT INTO products (product_code, product_name, price) VALUES (?, ?, ?)', [
      product_code,
      product_name,
      price,
    ]);
    return NextResponse.json({ message: 'Product added!' }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ลบสินค้า
export async function DELETE(req) {
  const body = await req.json();
  const { id } = body;

  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Product deleted!' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
