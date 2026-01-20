import express from "express";
import routes from "./routes";

const app = express();

import cors from "cors";

if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: [process.env.CLIENT_URL] }));
}

app.use(express.json());
app.use("/api", routes);

export default app;
