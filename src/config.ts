import { container } from "tsyringe";
import { SupabaseStorage } from "./storage/SupabaseStorage";

import "./database/mongoose";
import { RedisCache } from "./cache/RedisCache";

// export const storage = container.resolve(FileServerStorage);
// export const storage = container.resolve(GoogleBucketStorage);
export const storage = container.resolve(SupabaseStorage);

export const cache = container.resolve(RedisCache);
