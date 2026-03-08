import { container } from "tsyringe";
import { SupabaseStorage } from "./storage/SupabaseStorage";

import "./database/mongoose";

// export const storage = container.resolve(FileServerStorage);
// export const storage = container.resolve(GoogleBucketStorage);
export const storage = container.resolve(SupabaseStorage);
