import express from 'express';
import { verifyToken } from '../controllers/authController.js';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', verifyToken, createReport);
router.get('/', verifyToken, getReports);
router.get('/:id', verifyToken, getReportById);
router.put('/:id', verifyToken, updateReport);
router.delete('/:id', verifyToken, deleteReport);

export default router;
