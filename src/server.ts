import "express-async-errors";
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { baseRoutes } from "./routes/base.route";
import { airfieldRoutes } from "./routes/airfields.route";
import { providerMiddleware } from "./middlewares/provider.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(baseRoutes);
app.use("/airfields", providerMiddleware, airfieldRoutes);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log(`Listen in http://localhost:${3000}`);
});
