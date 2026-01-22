import { Request, Response, NextFunction } from "express";
import * as Joi from "joi";


export const animalSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.base": "Le nom de l’animal doit être une chaîne de caractères.",
      "string.empty": "Le nom de l’animal est obligatoire.",
      "string.max": "Le nom de l’animal ne doit pas dépasser 100 caractères.",
      "any.required": "Le nom de l’animal est obligatoire.",
    }),

  species: Joi.string()
    .max(50)
    .required()
    .messages({
      "string.base": "L’espèce doit être une chaîne de caractères.",
      "string.empty": "L’espèce est obligatoire.",
      "string.max": "L’espèce ne doit pas dépasser 50 caractères.",
      "any.required": "L’espèce est obligatoire.",
    }),

  breed: Joi.string()
    .max(50)
    .required()
    .messages({
      "string.base": "La race doit être une chaîne de caractères.",
      "string.empty": "La race est obligatoire.",
      "string.max": "La race ne doit pas dépasser 50 caractères.",
      "any.required": "La race est obligatoire.",
    }),

  dateOfBirth: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "La date de naissance doit être une date valide.",
      "date.format": "La date de naissance doit être au format ISO (YYYY-MM-DD).",
      "any.required": "La date de naissance est obligatoire.",
    }),

  picture: Joi.string()
    .uri()
    .allow(null)
    .optional()
    .messages({
      "string.base": "L’URL de l’image doit être une chaîne de caractères.",
      "string.uri": "L’URL de l’image doit être une URL valide.",
    }),

  weight: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Le poids doit être un nombre.",
      "number.positive": "Le poids doit être un nombre positif.",
      "any.required": "Le poids est obligatoire.",
    }),

  gender: Joi.string()
    .valid("M", "F")
    .required()
    .messages({
      "any.only": "Le genre doit être 'M' ou 'F'.",
      "any.required": "Le genre est obligatoire.",
    }),

  ownerId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.base": "L’identifiant du propriétaire doit être une chaîne de caractères.",
      "string.guid": "L’identifiant du propriétaire doit être un UUID valide.",
      "any.required": "L’identifiant du propriétaire est obligatoire.",
    }),
}).unknown(false);


export const validateCreateAnimal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = animalSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Erreur de validation des données.",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;
  next();
};

export const validateUpdateAnimal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateSchema = animalSchema.fork(
    Object.keys(animalSchema.describe().keys),
    (schema) => schema.optional()
  );

  const { error, value } = updateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Erreur de validation des données.",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  req.body = value;
  next();
};
