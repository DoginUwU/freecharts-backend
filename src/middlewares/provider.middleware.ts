import { NextFunction, Request, Response } from "express";
import {
  ProviderEngine,
  SupportedProviderEngines,
} from "../engines/ProviderEngine";
import { container } from "tsyringe";
import { AisWebEngine } from "../engines/providers/AisWebEngine";

const providers: Record<SupportedProviderEngines, ProviderEngine> = {
  aisweb: container.resolve(AisWebEngine),
};

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

  next();
}
