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
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(r.rows[0]);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//ユーザー情報削除
/*
router.delete('/:userId',async(req, res) => {
  try{
    const { userId } = req.params;

    const check = await query('SELECT id FROM users WHERE id = $1', [userId]);
    if(check.rows.length == 0){
      return res.status(404).json({error:'User not found'});
    }

    await query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({message: 'User deleted', userId});
  } catch(e: any){
    console.error(e);
    res.status(500).json({ error: e.message });
    //console.log("koko");
  }
});
*/

//ユーザー情報更新
router.patch('/:userId', async(req, res) => {
  try{
    const { userId } = req.params;
    const { name, attribute, age } = req.body;

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (attribute) {
      fields.push(`attribute = $${idx++}`);
      values.push(attribute);
    }
    if (age !== undefined) {
      fields.push(`age = $${idx++}`);
      values.push(age);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const sql = `
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE id = $${idx}
      RETURNING id, name, attribute, age, created_at, updated_at
    `;
    values.push(userId);

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated',
      user: result.rows[0],
    });
  }catch(e: any){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;