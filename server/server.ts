import express from 'express';
import testRouter from './test/test';

const app = express();
app.use(express.json());

// test.ts のルーターを /test 配下にマウント
app.use('/test', testRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
