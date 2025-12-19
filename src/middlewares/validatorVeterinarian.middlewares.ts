import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const veterinarianSchema = Joi.object({
  userId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      "string.base": "L'identifiant de l'utilisateur doit être une chaîne de caractères.",
      "string.guid": "L'identifiant de l'utilisateur doit être un UUID valide.",
      "any.required": "L'identifiant de l'utilisateur est obligatoire.",
    }),

  name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.base": "Le nom du vétérinaire doit être une chaîne de caractères.",
      "string.empty": "Le nom du vétérinaire est obligatoire.",
      "string.max": "Le nom du vétérinaire ne doit pas dépasser 100 caractères.",
      "any.required": "Le nom du vétérinaire est obligatoire.",
    }),

  phone: Joi.string()
    .max(25)
    .pattern(/^[\d\s\+\-\(\)]+$/)
    .required()
    .messages({
      "string.base": "Le numéro de téléphone doit être une chaîne de caractères.",
      "string.empty": "Le numéro de téléphone est obligatoire.",
      "string.max": "Le numéro de téléphone ne doit pas dépasser 25 caractères.",
      "string.pattern.base": "Le numéro de téléphone contient des caractères invalides.",
      "any.required": "Le numéro de téléphone est obligatoire.",
    }),
}).unknown(false);

export const updateVeterinarianSchema = Joi.object({
  name: Joi.string()
    .max(100)
    .optional()
    .messages({
      "string.base": "Le nom du vétérinaire doit être une chaîne de caractères.",
      "string.empty": "Le nom du vétérinaire ne peut pas être vide.",
      "string.max": "Le nom du vétérinaire ne doit pas dépasser 100 caractères.",
    }),

  phone: Joi.string()
    .max(25)
    .pattern(/^[\d\s\+\-\(\)]+$/)
    .optional()
    .messages({
      "string.base": "Le numéro de téléphone doit être une chaîne de caractères.",
      "string.empty": "Le numéro de téléphone ne peut pas être vide.",
      "string.max": "Le numéro de téléphone ne doit pas dépasser 25 caractères.",
      "string.pattern.base": "Le numéro de téléphone contient des caractères invalides.",
    }),
}).unknown(false);

export const validateCreateVeterinarian = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = veterinarianSchema.validate(req.body, {
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

export const validateUpdateVeterinarian = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = updateVeterinarianSchema.validate(req.body, {
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
