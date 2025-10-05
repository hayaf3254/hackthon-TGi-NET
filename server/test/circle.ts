// server/test/circle.ts
import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET /test/circle - サークル一覧取得（最大10件）
router.get('/circle', async (_req, res) => {
  try {
    const r = await query(
      `SELECT 
        circle_id,
        circle_name,
        text,
        user_owner_id as user_id
      FROM circles
      ORDER BY created_at DESC
      LIMIT 10`
    );
    res.json(r.rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


//サークル作成
router.post('/circle', async (req, res) => {
  try {
    const { circle_name, text, user_id } = req.body;

    console.log('Received body:', req.body); // デバッグ用

    // バリデーション
    if (!circle_name || !user_id) {
      return res.status(400).json({ 
        error: 'circle_name and user_id are required' 
      });
    }

    const r = await query(
      `INSERT INTO circles (circle_name, text, user_owner_id)
       VALUES ($1, $2, $3)
       RETURNING circle_id, circle_name, text, user_owner_id as user_id`,
      [circle_name, text || null, user_id]
    );

    res.status(200).json({
      success: 200,
      data: r.rows[0]
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//個別にサークル情報取得
router.get('/circle/:circleId', async (req, res) => {
  try {
    const { circleId } = req.params;

    const r = await query(
      `SELECT 
        circle_id,
        circle_name,
        text,
        tag,
        user_owner_id as user_id,
        created_at,
        updated_at
      FROM circles
      WHERE circle_id = $1`,
      [circleId]
    );

    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'Circle not found' });
    }

    res.json(r.rows[0]);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//サークル削除
router.delete('/circle/:circleId', async (req, res) => {
  try {
    const { circleId } = req.params;

    // サークルの存在確認
    const checkResult = await query(
      'SELECT circle_id FROM circles WHERE circle_id = $1',
      [circleId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Circle not found' });
    }

    // サークル削除（apply_circlesは CASCADE で自動削除される）
    await query(
      'DELETE FROM circles WHERE circle_id = $1',
      [circleId]
    );

    res.status(200).json({
      success: 200,
      message: 'Circle deleted successfully',
      circle_id: parseInt(circleId)
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


//参加申請
router.post('/circle/:circleId', async (req, res) => {
  try {
    const { circleId } = req.params;
    const { user_appliment_id } = req.body;

    console.log('Application request:', { circleId, user_appliment_id }); // デバッグ用

    // バリデーション
    if (!user_appliment_id) {
      return res.status(400).json({ 
        error: 'user_appliment_id is required' 
      });
    }

    // サークルの存在確認と owner_id 取得
    const circleResult = await query(
      'SELECT user_owner_id FROM circles WHERE circle_id = $1',
      [circleId]
    );

    if (circleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Circle not found' });
    }

    const user_owner_id = circleResult.rows[0].user_owner_id;

    // 参加申請を追加
    const r = await query(
      `INSERT INTO apply_circles (circle_id, user_owner_id, user_appliment_id, auth)
       VALUES ($1, $2, $3, FALSE)
       RETURNING application_id, circle_id, user_owner_id, user_appliment_id, auth, created_at`,
      [circleId, user_owner_id, user_appliment_id]
    );

    res.status(200).json({
      success: 200,
      data: r.rows[0]
    });
  } catch (e: any) {
    console.error(e);
    // 重複申請などのエラーハンドリング
    if (e.code === '23505') { // unique violation
      return res.status(409).json({ error: 'Application already exists' });
    }
    res.status(500).json({ error: e.message });
  }
});




export default router;