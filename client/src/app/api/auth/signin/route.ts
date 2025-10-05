import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_USER_IDS, SAMPLE_CIRCLE_OWNER_ID } from "@/lib/mockData";

// 開発用のサンプルユーザーデータ
const MOCK_USERS = [
  {
    id: SAMPLE_CIRCLE_OWNER_ID,
    username: "test_user",
    password: "password123",
    name: "テストユーザー",
    type: "student" as const
  },
  {
    id: SAMPLE_USER_IDS[0],
    username: "user001",
    password: "password123",
    name: "ユーザー1",
    type: "student" as const
  },
  {
    id: SAMPLE_USER_IDS[1],
    username: "user002", 
    password: "password123",
    name: "ユーザー2",
    type: "professional" as const
  },
  {
    id: SAMPLE_USER_IDS[2],
    username: "admin",
    password: "admin123",
    name: "管理者",
    type: "student" as const
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション：必須フィールドの確認
    if (!body.username || typeof body.username !== 'string') {
      return NextResponse.json({ 
        error: "Username is required" 
      }, { status: 400 });
    }

    if (!body.password || typeof body.password !== 'string') {
      return NextResponse.json({ 
        error: "Password is required" 
      }, { status: 400 });
    }

    // ユーザーの認証
    const user = MOCK_USERS.find(
      u => u.username === body.username.trim() && u.password === body.password
    );

    if (!user) {
      // 認証失敗時は少し待機（ブルートフォース攻撃の対策）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({ 
        error: "ユーザーネームまたはパスワードが正しくありません" 
      }, { status: 401 });
    }

    // 開発用：意図的に一定確率で失敗させる（ネットワークエラーなどを模擬）
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
      return NextResponse.json({ 
        error: "サーバーエラーが発生しました" 
      }, { status: 500 });
    }

    // 認証成功時のレスポンス
    const response = {
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        type: user.type
      },
      // 開発用：実際のJWTトークンの代わりにシンプルなトークンを生成
      token: `mock_token_${user.id}_${Date.now()}`,
      expiresIn: 24 * 60 * 60 * 1000 // 24時間（ミリ秒）
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error in authentication:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}