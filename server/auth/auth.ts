// server/auth/auth.ts
import { Router } from 'express';
import { query } from '../db';

const router = Router();

// POST /test/auth - 認証（仮）
router.post('/', async (req, res) => {
  try {
    const { password } = req.body;

    console.log('Auth attempt:', { password: '***' }); // デバッグ用


    // ユーザー情報を取得
    const r = await query(
      'SELECT id, name, attribute, age FROM users WHERE password = $1',
      [password]
    );

    // ユーザーが見つからない場合
    if (r.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid name or password' 
      });
    }

    // 認証成功
    const user = r.rows[0];
    res.status(200).json({
      success: 200,
      user_id: user.id,
      name: user.name,
      attribute: user.attribute,
      age: user.age
    });

  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;