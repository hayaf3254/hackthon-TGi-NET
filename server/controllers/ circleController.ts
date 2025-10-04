import express from 'express';
import { mockCircles } from './data/mockData';
import { CircleListResponse, ErrorResponse } from './types';

const router = express.Router();

router.get('/circles', (req: express.Request, res: express.Response) => {
    try {
        const offset: number = parseInt(req.query.offset as string || '0', 10);
        const limit: number = parseInt(req.query.limit as string || '10', 10);

        if (offset < 0 || limit < 1 || limit > 100) {
            res.status(400).json({
                error: 'Invalid parameters',
                message: 'offset must be >= 0, limit must be between 1 and 100'
            } as ErrorResponse);
            return;
        }

        const paginatedCircles = mockCircles.slice(offset, offset + limit);

        res.json({
            total: mockCircles.length,
            offset: offset,
            limit: limit,
            data: paginatedCircles
        } as CircleListResponse);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        } as ErrorResponse);
    }
});

export default router;