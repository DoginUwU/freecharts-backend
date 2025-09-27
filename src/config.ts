import { container } from "tsyringe";
import { SupabaseStorage } from "./storage/SupabaseStorage";

// export const storage = container.resolve(FileServerStorage);
// export const storage = container.resolve(GoogleBucketStorage);
export const storage = container.resolve(SupabaseStorage);
