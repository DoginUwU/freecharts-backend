import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

export abstract class Storage {
  protected __dirname: string = dirname(__filename);

  public abstract upload(
    filePath: string,
    data: Buffer<ArrayBufferLike>,
  ): Promise<void>;
  public abstract read(filePath: string): Promise<Buffer<ArrayBufferLike>>;
}
