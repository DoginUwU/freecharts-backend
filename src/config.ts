import { container } from "tsyringe";
import { GoogleBucketStorage } from "./storage/GoogleBucketStorage";

// export const storage = container.resolve(FileServerStorage);
export const storage = container.resolve(GoogleBucketStorage);
