
import { Request, Response, NextFunction } from 'express';
import * as animalService from '../services/animal.service';

export const getAllAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const animals = await animalService.getAllAnimals();
    res.status(200).json(animals);
  } catch (error) {
    next(error); 
  }
};
