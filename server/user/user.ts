// server/user/user.ts
import { Router } from 'express';
import { query } from '../db';

const router = Router();


router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const r = await query(
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

    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'Circle not found' });
    }

    res.json(r.rows[0]);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;