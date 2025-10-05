// このファイルはアプリケーション起動時にサンプルデータを初期化するために使用します
// 実際のプロダクションでは削除してください

import { initializeSampleData } from './mockData';

// 開発環境でのみサンプルデータを初期化
if (process.env.NODE_ENV === 'development') {
  initializeSampleData();
  console.log('📊 Sample chat data initialized for development');
}

export {}; // ESモジュールとして扱うための空のexport