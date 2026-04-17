// server/src/db.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = './finances.db'; // 資料庫檔案將儲存在 server 目錄下

export const initializeDatabase = async () => {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS stocks (
      id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      currentPrice REAL NOT NULL,
      purchasePrice REAL NOT NULL,
      shares INTEGER NOT NULL,
      currentValue REAL NOT NULL,
      profitLoss REAL NOT NULL
    );
    -- 可以添加其他表的創建語句，例如 foreign_currency, loans
  `);

  console.log('Database initialized and tables created.');
  return db;
};
