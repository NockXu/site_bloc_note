import { Router } from 'express';
import { DatabaseHealthCheck } from '../config/healthCheck';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 users:
 *                   type: integer
 *                   example: 5
 *                 notes:
 *                   type: integer
 *                   example: 12
 *                 lastCheck:
 *                   type: string
 *                   example: 2023-01-01T00:00:00.000Z
 *       503:
 *         description: Database unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Connection timeout
 */
router.get('/', async (req, res) => {
  const isHealthy = await DatabaseHealthCheck.isHealthy();
  
  if (!isHealthy) {
    return res.status(503).json({
      status: 'error',
      message: 'Database unavailable',
      timestamp: new Date().toISOString()
    });
  }

  const stats = await DatabaseHealthCheck.getStats();
  res.status(200).json(stats);
});

/**
 * @swagger
 * /health/test:
 *   get:
 *     summary: Test database operations
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Results of database operations test
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connection:
 *                   type: boolean
 *                 read:
 *                   type: boolean
 *                 write:
 *                   type: boolean
 *                 delete:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                   nullable: true
 */
router.get('/test', async (req, res) => {
  const testResults = await DatabaseHealthCheck.testOperations();
  
  const allOperationsPassed = Object.values(testResults)
    .filter(key => key !== 'error')
    .every(result => result === true);

  const statusCode = allOperationsPassed ? 200 : 503;
  
  res.status(statusCode).json({
    ...testResults,
    timestamp: new Date().toISOString(),
    allTestsPassed: allOperationsPassed
  });
});

export default router;
