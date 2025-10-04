import express, { Router } from 'express';
import {
    getCircles,
    getAllCircles,
    createCircle,
    getCircleById,
    applyToCircle,
    deleteCircle
} from './controllers/circleController';

const router: Router = express.Router();

// GET /api/circle - サークル一覧取得（ページネーション付き）
router.get('/circle', getCircles);

// GET /api/all_circle - 全サークル取得
router.get('/all_circle', getAllCircles);

// POST /api/circle - サークル追加
router.post('/circle', createCircle);

// GET /api/circle/:circleId - サークル詳細取得
router.get('/circle/:circleId', getCircleById);

// POST /api/circle/:circleId - 参加申請
router.post('/circle/:circleId', applyToCircle);

// DELETE /api/circle/:circleId - サークル削除
router.delete('/circle/:circleId', deleteCircle);

// PATCH /api/circle/:circleId - サークル情報更新（後回し）
// router.patch('/circle/:circleId', updateCircle);

export default router;