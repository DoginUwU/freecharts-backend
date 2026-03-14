import { singleton } from "tsyringe";
import { Cache } from "./cache";
import Redis from "ioredis";

@singleton()
export class RedisCache extends Cache {
  private redis: Redis;

  constructor() {
    super();

    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

    this.redis.on("error", (err) => {
      console.error("Redis error:", err);
    });

    this.redis.on("connect", () => {
      console.log("Connected to Redis");
    });
  }

  public async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (err) {
      console.error("Error parsing Redis value:", err);
      return null;
    }
  }
  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (ttl) {
      await this.redis.set(key, stringValue, "EX", ttl);
    } else {
      await this.redis.set(key, stringValue);
    }
  }
  public async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
