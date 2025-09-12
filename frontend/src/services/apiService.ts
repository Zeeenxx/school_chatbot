import cacheService, { CACHE_KEYS, CACHE_TTL } from './cacheService';

interface ChatMessage {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  text: string;
  type: string;
  data?: any;
  sessionId: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface CmsData {
    [key: string]: any;
    id?: number;
}

class ApiService {
  private getBaseURL(): string {
    // Use environment variable for backend URL in production, or proxy in development
    return process.env.REACT_APP_API_URL || window.location.origin;
  }

  private get baseURL() {
    return this.getBaseURL();
  }
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    useCache: boolean = false,
    cacheKey?: string,
    cacheTTL: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    // Check cache first
    if (useCache && cacheKey) {
      const cachedData = cacheService.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      cache: 'no-cache', // Add this line to prevent browser caching
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          this.clearToken();
          throw new Error('Authentication expired. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response if caching is enabled
      if (useCache && cacheKey) {
        cacheService.set(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> {
    try {
        const response = await this.request<{ user: User; token: string; refreshToken: string; message: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(credentials)
        }
      );

      this.setToken(response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      return {
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken
      };
    } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
            throw new Error('Invalid username or password.');
        }
        throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string; refreshToken: string }> {
    const response = await this.request<{ user: User; token: string; refreshToken: string; message: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData)
      }
    );

    this.setToken(response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    return {
      user: response.user,
      token: response.token,
      refreshToken: response.refreshToken
    };
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearToken();
      cacheService.clear(); // Clear all cached data on logout
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.request<{ user: User; message: string }>(
      '/api/auth/profile',
      { method: 'GET' },
      true, // Use cache
      CACHE_KEYS.USER_PROFILE,
      CACHE_TTL.MEDIUM
    );

    return response.user;
  }

  // Public method for fetching facilities
  async getPublicFacilities(): Promise<any[]> {
    return await this.request('/api/public/facilities', { method: 'GET' });
  }

  // Chat methods
  async sendMessage(messageData: ChatMessage): Promise<ChatResponse> {
    const response = await this.request<ChatResponse>(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify(messageData)
      }
    );

    return response;
  }

  // Analytics methods
  async getAnalytics(period: string = '7d'): Promise<any> {
    return await this.request(
      `/api/analytics/dashboard?period=${period}`,
      { method: 'GET' },
      true, // Use cache
      `${CACHE_KEYS.ANALYTICS_DATA}_${period}`,
      CACHE_TTL.SHORT
    );
  }

  async getPopularQueries(limit: number = 20): Promise<any> {
    return await this.request(
      `/api/analytics/popular-queries?limit=${limit}`,
      { method: 'GET' },
      true, // Use cache
      `${CACHE_KEYS.POPULAR_QUERIES}_${limit}`,
      CACHE_TTL.MEDIUM
    );
  }

  async submitFeedback(feedbackData: { sessionId: string; rating: number; feedbackText: string }): Promise<void> {
    await this.request(
      '/api/analytics/feedback',
      {
        method: 'POST',
        body: JSON.stringify(feedbackData)
      }
    );

    // Clear related cache
    cacheService.delete(CACHE_KEYS.USER_FEEDBACK);
  }

  // Utility methods
  async checkUsernameAvailability(username: string): Promise<{ available: boolean; message: string }> {
    return await this.request(
      '/api/auth/check-username',
      {
        method: 'POST',
        body: JSON.stringify({ username })
      }
    );
  }

  async checkPasswordStrength(password: string): Promise<{ isValid: boolean; errors: string[]; strength: string }> {
    return await this.request(
      '/api/auth/check-password',
      {
        method: 'POST',
        body: JSON.stringify({ password })
      }
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return await this.request(
      '/api/health',
      { method: 'GET' },
      true, // Use cache
      'health_check',
      CACHE_TTL.SHORT
    );
  }

  // Generic CMS service factory
  createCmsService<T extends CmsData>(resource: string) {
    const endpoint = `/api/cms/${resource}`;

    return {
      getAll: (): Promise<T[]> => {
        const url = `${endpoint}?_=${new Date().getTime()}`;
        return this.request<T[]>(url, { method: 'GET' });
      },
      getById: (id: number): Promise<T> => {
        const url = `${endpoint}/${id}?_=${new Date().getTime()}`;
        return this.request<T>(url, { method: 'GET' });
      },
      create: (data: T): Promise<T> => {
        return this.request<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(data)
        });
      },
      update: (id: number, data: T): Promise<{ message: string }> => {
        return this.request<{ message: string }>(`${endpoint}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      },
      delete: (id: number): Promise<void> => {
        return this.request<void>(`${endpoint}/${id}`, { method: 'DELETE' });
      }
    };
  }

  // Knowledge Base service
  createKnowledgeBaseService<T extends CmsData>() {
    const endpoint = '/api/knowledge';

    return {
      getAll: (): Promise<T[]> => {
        const url = `${endpoint}?_=${new Date().getTime()}`;
        return this.request<T[]>(url, { method: 'GET' });
      },
      getById: (id: number): Promise<T> => {
        const url = `${endpoint}/${id}?_=${new Date().getTime()}`;
        return this.request<T>(url, { method: 'GET' });
      },
      create: (data: T): Promise<T> => {
        return this.request<T>(endpoint, {
          method: 'POST',
          body: JSON.stringify(data)
        });
      },
      update: (id: number, data: T): Promise<{ message: string }> => {
        return this.request<{ message: string }>(`${endpoint}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      },
      delete: (id: number): Promise<void> => {
        return this.request<void>(`${endpoint}/${id}`, { method: 'DELETE' });
      }
    };
  }

  // Cache management
  clearCache(): void {
    cacheService.clear();
  }

  getCacheStats(): any {
    return cacheService.getStats();
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;


