import axios, { AxiosInstance } from "axios";
import { Storage } from "./storage";
import { singleton } from "tsyringe";

@singleton()
export class FileServerStorage extends Storage {
  private api: AxiosInstance;

  constructor() {
    super();

    this.api = axios.create({
      baseURL: process.env.FILE_SERVER_API_URL,
      auth: {
        username: process.env.FILE_SERVER_API_USERNAME!,
        password: process.env.FILE_SERVER_API_PASSWORD!,
      },
    });
  }

  public async upload(
    filePath: string,
    data: Buffer<ArrayBufferLike>,
  ): Promise<void> {
    await this.api.put(filePath, data);
  }

  public async read(filePath: string): Promise<Buffer<ArrayBufferLike>> {
    const { data } = await this.api.get<Buffer<ArrayBufferLike>>(filePath, {
      responseType: "arraybuffer",
    });

    return data;
  }
}
