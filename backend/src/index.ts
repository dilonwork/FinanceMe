// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import { Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid'; // 用於生成唯一ID

const app = express();
const PORT = process.env.PORT || 3000; // 後端運行在端口 3000

app.use(cors()); // 啟用 CORS
app.use(express.json()); // 啟用 JSON body parser

let db: Database; // 聲明 db 變量

// 初始化資料庫並啟動伺服器
initializeDatabase().then((database) => {
  db = database;
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// 股票 API 路由
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await db.all('SELECT * FROM stocks');
    res.json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

app.post('/api/stocks', async (req, res) => {
  try {
    const { symbol, name, currentPrice, purchasePrice, shares } = req.body;
    if (!symbol || !name || !currentPrice || !purchasePrice || !shares) {
      return res.status(400).json({ error: 'Missing required stock fields' });
    }

    const id = uuidv4();
    const currentValue = currentPrice * shares;
    const profitLoss = currentValue - (purchasePrice * shares);

    await db.run(
      'INSERT INTO stocks (id, symbol, name, currentPrice, purchasePrice, shares, currentValue, profitLoss) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id, symbol, name, currentPrice, purchasePrice, shares, currentValue, profitLoss
    );
    res.status(201).json({ id, symbol, name, currentPrice, purchasePrice, shares, currentValue, profitLoss });
  } catch (err) {
    console.error('Error adding stock:', err);
    res.status(500).json({ error: 'Failed to add stock' });
  }
});

app.put('/api/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol, name, currentPrice, purchasePrice, shares } = req.body;
    if (!symbol || !name || !currentPrice || !purchasePrice || !shares) {
      return res.status(400).json({ error: 'Missing required stock fields' });
    }

    const currentValue = currentPrice * shares;
    const profitLoss = currentValue - (purchasePrice * shares);

    const result = await db.run(
      'UPDATE stocks SET symbol = ?, name = ?, currentPrice = ?, purchasePrice = ?, shares = ?, currentValue = ?, profitLoss = ? WHERE id = ?',
      symbol, name, currentPrice, purchasePrice, shares, currentValue, profitLoss, id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json({ id, symbol, name, currentPrice, purchasePrice, shares, currentValue, profitLoss });
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

app.delete('/api/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM stocks WHERE id = ?', id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    console.error('Error deleting stock:', err);
    res.status(500).json({ error: 'Failed to delete stock' });
  }
});
