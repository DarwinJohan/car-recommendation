import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'store_it',
    });

    const [existing] = await conn.execute('SELECT * FROM users WHERE Email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    await conn.execute(
      'INSERT INTO users (Username, Password, Email, Role, CompanyID) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, 'User', 1]
    );

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Database error' });
  }
}
