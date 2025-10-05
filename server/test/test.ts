const { Router } = require('express');
const { query } = require('../db');

const router = Router();

// /test/ping : DBの疎通確認
router.get('/ping', async (_req:any, res:any) => {
  try {
    const r = await query('SELECT now() AS now');
    res.json({ ok: true, now: r.rows[0].now });
  } catch (e:any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/users', async (_req:any, res:any) => {
  try {
    const r = await query(
      'SELECT id, name, attribute, age FROM users ORDER BY id DESC LIMIT 10'
    );
    res.json(r.rows);
  } catch (e: any) {
    console.error(e); // ←サーバ側にも出す
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
