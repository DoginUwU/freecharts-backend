import { singleton } from "tsyringe";
import { Storage } from "./storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@singleton()
export class SupabaseStorage extends Storage {
  private storage: ReturnType<SupabaseClient["storage"]["from"]>;

  constructor() {
    super();

    const supabase = createClient(
      process.env.SUPABASE_PROJECT_URL as string,
      process.env.SUPABASE_API_KEY as string,
    );

    this.storage = supabase.storage.from(
      process.env.SUPABASE_STORAGE_NAME as string,
    );
  }

  public async upload(
    filePath: string,
    data: Buffer<ArrayBufferLike>,
  ): Promise<void> {
    await this.storage.upload(filePath, data);
  }

  public async read(filePath: string): Promise<Buffer<ArrayBufferLike>> {
    const { data, error } = await this.storage.download(filePath);
    if (error || !data) {
      throw error || new Error("No data returned");
    }
    return Buffer.from(await data.arrayBuffer());
  }
}
