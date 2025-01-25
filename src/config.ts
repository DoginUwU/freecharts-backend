import { container } from "tsyringe";
import { FileServerStorage } from "./storage/FileServerStorage";

export const storage = container.resolve(FileServerStorage);
