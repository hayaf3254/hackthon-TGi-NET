import express from 'express';
import circleRoutes from '/routes/circleRoutes';

const app = express();

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルート
app.use('/api', circleRoutes);

// サーバー起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});

export default app;