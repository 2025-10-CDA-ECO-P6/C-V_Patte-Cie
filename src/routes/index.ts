import { Router } from 'express';
import animalRoutes from './animal.routes';

const router = Router();

router.use('/animals', animalRoutes);

export default router;
