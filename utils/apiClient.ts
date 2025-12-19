import { API_URL } from './config';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiClientOptions extends RequestInit {
  body?: any;
}

const apiClient = async (
  endpoint: string,
  { body, ...customConfig }: ApiClientOptions = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (token) {
    headers['x-auth-token'] = token;
  }

  const config: RequestInit = {
    method: customConfig.method || (body ? 'POST' : 'GET'),
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    if (body instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
        return; 
      }
      return await response.json();
    }

    let errorMessage = `An unexpected error occurred. (Status: ${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.msg || errorData.message || (errorData.errors ? JSON.stringify(errorData.errors) : errorMessage);
    } catch (e) {
      const textResponse = await response.text();
      if (textResponse.toLowerCase().includes('gateway')) {
        errorMessage = 'The server is currently unavailable. Please try again later. (Gateway Error)';
      } else {
        errorMessage = `The server returned an invalid response. (Status: ${response.status})`;
      }
    }
    throw new ApiError(errorMessage);

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('API Client Network Error:', error);
    throw new ApiError('Network error: Please check your internet connection and try again.');
  }
};

export default apiClient;
