// server/user/user.ts
import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /test/user/:userId - ユーザー情報取得 + 参加申請一覧
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // ユーザー情報を取得
    const userResult = await query(
      `SELECT 
        id,
        name,
        attribute,
        age,
        created_at,
        updated_at
      FROM users
      WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // そのユーザーが作成したサークルへの参加申請を取得
    // user_owner_id = userId のものを検索
    const applicationsResult = await query(
      `SELECT 
      user_appliment_id
      FROM apply_circles
      WHERE user_owner_id = $1`,
      [userId]
    );

    // user_appliment_id を配列に変換
    const appliment_ids = applicationsResult.rows.map(row => row.user_appliment_id);

    // レスポンス
    res.status(200).json({
      ...user,
      appliment_ids: appliment_ids
    });

  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;