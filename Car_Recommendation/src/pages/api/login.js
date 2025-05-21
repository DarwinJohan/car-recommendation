import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // ganti kalau kamu pakai password di XAMPP
      database: 'store_it' // sesuaikan nama DB
    });

    // Cek apakah user sudah ada
    const [rows] = await conn.execute('SELECT * FROM users WHERE Email = ? AND Password = ?', [email, password]);

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Login berhasil', user: rows[0] });
    } else {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
