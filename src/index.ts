import app from "./app";
import { swaggerSpec, swaggerUi } from "./swagger";

const PORT = 3010;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
