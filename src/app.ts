import express from "express";
import routes from "./routes";
import "./types/errorException"; // Import pour rendre ErrorException disponible globalement

const app = express();

app.use(express.json());
app.use("/api", routes);

export default app;
