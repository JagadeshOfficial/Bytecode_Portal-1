import { Router } from 'express';
import { getLeads, createLead, updateLead, deleteLead } from './controller';
import { protect, authorize } from '@/middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', authorize('CEO', 'SUPER_ADMIN', 'MANAGER'), deleteLead);

export default router;
