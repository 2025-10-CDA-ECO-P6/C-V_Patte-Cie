import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const vaccineSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.base": "Le nom du vaccin doit être une chaîne de caractères.",
      "string.empty": "Le nom du vaccin est obligatoire.",
      "string.max": "Le nom du vaccin ne doit pas dépasser 100 caractères.",
      "any.required": "Le nom du vaccin est obligatoire.",
    }),

  administrationDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "La date d’administration doit être une date valide.",
      "date.format": "La date d’administration doit être au format ISO (YYYY-MM-DD).",
    }),

  vaccineStatus: Joi.string()
    .valid("pending", "administered", "expired")
    .required()
    .messages({
      "any.only": "Le statut du vaccin doit être : pending, administered ou expired.",
      "any.required": "Le statut du vaccin est obligatoire.",
    }),

  reminderDelays: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "Chaque délai de rappel doit être un nombre.",
          "number.integer": "Chaque délai de rappel doit être un entier.",
          "number.positive": "Chaque délai de rappel doit être un nombre positif.",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Les délais de rappel doivent être une liste de nombres.",
      "array.min": "Au moins un délai de rappel est requis.",
      "any.required": "Les délais de rappel sont obligatoires.",
    }),

  animalId: Joi.string()
    .uuid()
    .optional()
    .messages({
    "string.base": "L’identifiant de l’animal doit être une chaîne de caractères.",
    "string.guid": "L’identifiant de l’animal doit être un UUID valide.",
  }),

veterinarianId: Joi.string()
  .uuid()
  .optional()
  .messages({
    "string.base": "L’identifiant du vétérinaire doit être une chaîne de caractères.",
    "string.guid": "L’identifiant du vétérinaire doit être un UUID valide.",
  }),
}).unknown(false);

export const validateCreateVaccine = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = vaccineSchema.validate(req.body, {
    abortEarly: false, // renvoie toutes les erreurs, pas seulement la 1ère
    stripUnknown: true, // supprime les champs qui ne sont pas définis dans le schema (evite les injections)
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

export const validateUpdateVaccine = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = vaccineSchema.validate(req.body, {
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