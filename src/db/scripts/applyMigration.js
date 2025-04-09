import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    console.log('正在连接数据库...');
    
    // 读取迁移文件
    const migrationFile = path.join(process.cwd(), 'src', 'db', 'migrations', '0001_add_role_column.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    console.log('正在应用迁移...');
    
    // 执行迁移
    await pool.query(migrationSQL);
    
    console.log('迁移成功完成！');
    
    // 关闭连接
    await pool.end();
    
    process.exit(0);
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

applyMigration(); 