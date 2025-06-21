import { singleton } from "tsyringe";
import { Storage } from "./storage";
import { Bucket, Storage as GCPStorage } from "@google-cloud/storage";

@singleton()
export class GoogleBucketStorage extends Storage {
  private storage: GCPStorage;
  private bucket: Bucket;

  constructor() {
    super();

    this.storage = new GCPStorage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY_PATH,
    });

    this.bucket = this.storage.bucket(process.env.GCP_BUCKET_NAME as string);
  }

  public async upload(
    filePath: string,
    data: Buffer<ArrayBufferLike>,
  ): Promise<void> {
    const file = this.bucket.file(filePath);

    await file.save(data, {
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });
  }

  public async read(filePath: string): Promise<Buffer<ArrayBufferLike>> {
    const [buffer] = await this.bucket.file(filePath).download();

    return buffer;
  }
}
