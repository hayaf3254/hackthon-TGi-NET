// test-connection.ts
import 'dotenv/config';
import { Pool } from 'pg';

async function testConnection() {
  console.log('環境変数確認:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '設定済み' : '未設定');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL環境変数が設定されていません');
    process.exit(1);
  }

  // DATABASE_URLから options パラメータを除去
  let connectionString = process.env.DATABASE_URL;
  console.log('元のconnectionString:', connectionString);

  // options パラメータが含まれている場合は除去
  if (connectionString.includes('options=')) {
    const url = new URL(connectionString);
    url.searchParams.delete('options');
    connectionString = url.toString();
    console.log('修正後のconnectionString:', connectionString);
  }

  console.log('\n接続テスト開始...');

  // 複数の接続設定でテスト
  const configs = [
    {
      name: 'SSL reject unauthorized: false',
      config: {
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
      }
    },
    {
      name: 'SSL reject unauthorized: true',
      config: {
        connectionString: connectionString,
        ssl: { rejectUnauthorized: true }
      }
    },
    {
      name: 'SSL なし',
      config: {
        connectionString: connectionString,
        ssl: false
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n--- ${name} でテスト ---`);
    const pool = new Pool(config);

    try {
      // 接続テスト
      const client = await pool.connect();
      console.log('✅ 接続成功');

      // 簡単なクエリテスト
      const result = await client.query('SELECT NOW() as current_time');
      console.log('✅ クエリ実行成功:', result.rows[0].current_time);

      client.release();
      await pool.end();

      console.log(`✅ ${name} での接続は正常に動作しています`);
      break; // 成功したら終了

    } catch (error) {
      console.error(`❌ ${name} でエラー:`, error.message);
      console.error('エラーコード:', error.code);
      await pool.end();
    }
  }
}

// macOS固有の情報を表示
console.log('=== システム情報 ===');
console.log('OS:', process.platform);
console.log('Node.js バージョン:', process.version);
console.log('アーキテクチャ:', process.arch);

testConnection().catch(console.error);