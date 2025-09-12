// Cache service for performance optimization
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Set cache item with TTL
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Delete cache item
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean expired items
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[]; oldestItem: number; newestItem: number } {
    const keys = this.keys();
    const timestamps = keys.map(key => this.cache.get(key)?.timestamp || 0);
    
    return {
      size: this.size(),
      keys,
      oldestItem: Math.min(...timestamps),
      newestItem: Math.max(...timestamps)
    };
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Clean expired items every 5 minutes
setInterval(() => {
  cacheService.cleanExpired();
}, 5 * 60 * 1000);

export default cacheService;

// Cache keys constants
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  CHAT_SESSIONS: 'chat_sessions',
  ANALYTICS_DATA: 'analytics_data',
  SCHOOL_DATA: 'school_data',
  POPULAR_QUERIES: 'popular_queries',
  USER_FEEDBACK: 'user_feedback'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 30 * 60 * 1000,      // 30 minutes
  VERY_LONG: 2 * 60 * 60 * 1000 // 2 hours
} as const;


