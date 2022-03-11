import { Router } from 'express';
import { verifyToken } from '@middleware/auth';

var router = Router();

router.get('/', verifyToken)
router.put('', verifyToken);

export default router;