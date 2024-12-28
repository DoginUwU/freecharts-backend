import { Router } from "express";
import { BaseController } from "../controllers/base.controller";

const baseRoutes = Router()
const baseController = new BaseController()

baseRoutes.get('/', baseController.get)

export { baseRoutes }
