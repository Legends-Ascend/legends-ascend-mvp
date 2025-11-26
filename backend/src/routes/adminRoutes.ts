import { Router, Response } from 'express';
import { requireAdmin, AdminAuthenticatedRequest } from '../middleware/adminAuth';

/**
 * Admin Routes
 * Following TECHNICAL_ARCHITECTURE.md - REST API versioning /v1/...
 * Implements US-051 admin dashboard endpoints
 */

const router = Router();

/**
 * GET /api/v1/admin
 * Admin dashboard endpoint (placeholder for future admin features)
 * Protected by admin middleware
 */
router.get('/', requireAdmin, (req: AdminAuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Admin Dashboard',
      user: {
        username: req.user?.username,
        role: req.user?.role,
      },
    },
  });
});

/**
 * GET /api/v1/admin/health
 * Admin health check endpoint
 * Protected by admin middleware
 */
router.get('/health', requireAdmin, (req: AdminAuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Admin API is healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
