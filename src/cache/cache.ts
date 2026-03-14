export abstract class Cache {
  public abstract get<T>(key: string): Promise<T | null>;
  public abstract set<T>(key: string, value: T, ttl?: number): Promise<void>;
  public abstract delete(key: string): Promise<void>;
}
