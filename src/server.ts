import "dotenv/config";

import "express-async-errors";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { baseRoutes } from "./routes/base.route";
import { airfieldRoutes } from "./routes/airfields.route";
import { providerMiddleware } from "./middlewares/provider.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import * as Sentry from "@sentry/node";
import { geoRoutes } from "./routes/geo.route";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();

app.use(cors());
app.use(express.json());

app.use(baseRoutes);
app.use("/airfields", providerMiddleware, airfieldRoutes);
app.use("/geo", providerMiddleware, geoRoutes);

Sentry.setupExpressErrorHandler(app);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listen in http://localhost:${port}`);
});
