import { Router } from 'express';
import { getAllAnimals } from '../controllers/animal.controller';

const router = Router();

router.get('/', getAllAnimals);

export default router;
