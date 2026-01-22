import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Patte & Cie API",
      version: "1.0.0",
      description: "Documentation de l’API Patte & Cie",
    },
    servers: [
      {
        url: "https://pattes-and-cie.onrender.com/api",
        description: "deployment server",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
