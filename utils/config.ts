export interface Environment {
  baseUrl: string;
  name: string;
}

export const environments: Record<string, Environment> = {
  dev: {
    baseUrl: 'http://10.168.6.147:8083/login',
    name: 'Development'
  },
  // staging: {
  //   baseUrl: 'https://www.playdphstg.com/', 
  //   name: 'Staging'
  // }
};

// Get current environment from environment variable or default to dev
export function getCurrentEnvironment(): Environment {
  const envName = process.env.TEST_ENV || 'dev';
  return environments[envName] || environments.dev;
}

// Get base URL for current environment
export function getBaseUrl(): string {
  return getCurrentEnvironment().baseUrl;
}

// Helper function to build full URLs
export function buildUrl(path: string = ''): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}
