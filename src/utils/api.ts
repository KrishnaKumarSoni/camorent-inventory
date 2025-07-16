// API utility functions with error handling and fallbacks

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API call function with error handling
async function apiCall<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new ApiError(data.error);
    }

    return { data, success: true };
  } catch (error) {
    console.error('API call failed:', error);
    
    if (error instanceof ApiError) {
      return { error: error.message, success: false };
    }
    
    // Network error or other issues
    return { 
      error: 'Network error. Please check your connection and try again.', 
      success: false 
    };
  }
}

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

// Specific API functions
export const api = {
  // Inventory API calls
  async getInventory(filters?: { sku_id?: string; status?: string; condition?: string }) {
    const params = new URLSearchParams();
    if (filters?.sku_id) params.append('sku_id', filters.sku_id);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.condition) params.append('condition', filters.condition);
    
    const url = `${BASE_URL}/api/inventory${params.toString() ? `?${params.toString()}` : ''}`;
    return apiCall<{ items: any[] }>(url);
  },

  async createInventoryItem(data: any) {
    return apiCall<{ id: string; message: string }>(`${BASE_URL}/api/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInventoryItem(id: string) {
    return apiCall<{ item: any }>(`${BASE_URL}/api/inventory/${id}`);
  },

  async updateInventoryItem(id: string, data: any) {
    return apiCall<{ message: string }>(`${BASE_URL}/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // SKU API calls
  async getSKUs(category?: string) {
    const url = category ? `${BASE_URL}/api/skus?category=${category}` : `${BASE_URL}/api/skus`;
    return apiCall<{ skus: any[] }>(url);
  },

  async createSKU(data: any) {
    return apiCall<{ id: string; message: string }>(`${BASE_URL}/api/skus`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getSKU(id: string) {
    return apiCall<{ sku: any }>(`${BASE_URL}/api/skus/${id}`);
  },

  // Categories API call
  async getCategories() {
    return apiCall<{ categories: string[] }>(`${BASE_URL}/api/categories`);
  },

  // Audio processing API call
  async processAudio(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch(`${BASE_URL}/api/process-audio`, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData - let browser handle it
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new ApiError(data.error);
      }

      return { data, success: true };
    } catch (error) {
      console.error('Audio processing failed:', error);
      
      if (error instanceof ApiError) {
        return { error: error.message, success: false };
      }
      
      return { 
        error: 'Audio processing failed. Please try again.', 
        success: false 
      };
    }
  },

  // Text processing API call
  async processText(text: string) {
    try {
      const response = await fetch(`${BASE_URL}/api/process-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new ApiError(data.error);
      }

      return { data, success: true };
    } catch (error) {
      console.error('Text processing failed:', error);
      
      if (error instanceof ApiError) {
        return { error: error.message, success: false };
      }
      
      return { 
        error: 'Text processing failed. Please try again.', 
        success: false 
      };
    }
  },

  // Health check
  async healthCheck() {
    return apiCall<{ status: string; message: string }>('/api/health');
  }
};

// Offline support utilities
export const offlineStorage = {
  // Save data to localStorage for offline access
  saveToLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  // Load data from localStorage
  loadFromLocal<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  },

  // Clear offline data
  clearLocal(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear from localStorage:', error);
    }
  }
};

// Network status utilities
export const networkUtils = {
  // Check if online
  isOnline(): boolean {
    return navigator.onLine;
  },

  // Add network status listeners
  onNetworkChange(callback: (isOnline: boolean) => void) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};