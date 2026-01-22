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
        url: "http://localhost:3010/api",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
