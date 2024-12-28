import { Request, Response } from "express";

export class BaseController {
  public async get(req: Request, res: Response) {
    res.status(200).send("Hello from dev :)");
  }
}
