// server/user/user.ts
const { Router } =require('express');
const { query } =require('../db');

const router = Router();

// GET /test/user/:userId - ユーザー情報取得 + 参加申請一覧
router.get('/:userId', async (req:any, res:any) => {
  try {
    const uid = Number(req.params.userId);
    if (!Number.isInteger(uid) || uid <= 0) {
      return res.status(400).json({ error: 'invalid userId' });
    }

    // ユーザー情報を取得（created_at / updated_at を含む）
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
      [uid]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // そのユーザーが作成したサークルへの参加申請（申込者ID一覧）
    const applicationsResult = await query(
      `SELECT user_appliment_id
       FROM apply_circles
       WHERE user_owner_id = $1`,
      [uid]
    );

    const appliment_ids = applicationsResult.rows.map(
      (row: any) => row.user_appliment_id
    );

    // レスポンス
    return res.status(200).json({
      ...user,            // id, name, attribute, age, created_at, updated_at
      appliment_ids
    });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});


//ユーザ登録
router.post('/', async (req:any, res:any) => {
  try {
    const { name, attribute, age, password } = req.body ?? {};

    // --- バリデーション ---
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name は必須です' });
    }
    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'password は必須です' });
    }
    let ageInt: number | null = null;
    if (age !== undefined && age !== null && age !== '') {
      const n = Number(age);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ error: 'age は0以上の整数で指定してください' });
      }
      ageInt = n;
    }

    // --- 登録 ---
    const insertSql = `
      INSERT INTO users (name, attribute, age, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, attribute, age
    `;
    const params = [name.trim(), attribute ?? null, ageInt, password];

    const result = await query(insertSql, params);
    const created = result.rows[0];

    // 201 Created
    return res.status(201).json(created);
  } catch (e: any) {
    // 一意制約（例: name の UNIQUE を付けた場合）
    if (e?.code === '23505') {
      return res.status(409).json({ error: '同じ name のユーザーが既に存在します' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
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
router.patch('/:userId', async(req:any, res:any) => {
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

module.exports = router;