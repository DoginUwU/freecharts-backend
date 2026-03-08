import { NextFunction, Request, Response } from "express";
import {
  ProviderEngine,
  SupportedProviderEngines,
} from "../engines/ProviderEngine";
import { container } from "tsyringe";
import { AisWebEngine } from "../engines/providers/AisWebEngine";
import { GeoEngine } from "../engines/GeoEngine";

const providers: Record<SupportedProviderEngines, ProviderEngine> = {
  aisweb: container.resolve(AisWebEngine),
};

const geoProvider = container.resolve(GeoEngine);

export function providerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { provider } = req.headers;

  if (!provider || typeof provider !== "string") {
    next(new Error("Missing provider"));
  }

  const providerInstance = providers[provider as SupportedProviderEngines];

  if (!providerInstance) {
    next(new Error(`Provider ${provider} not found`));
  }

  req.provider = providerInstance;
  req.geoEngine = geoProvider;

  next();
}
