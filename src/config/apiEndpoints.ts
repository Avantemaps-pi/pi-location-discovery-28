
import { PI_CONFIG } from './environment';

/**
 * API endpoints configuration
 * Automatically switches between testnet and mainnet URLs based on environment
 */

// Base URLs for different environments
const BASE_URLS = {
  // Pi Network API endpoints
  PI_NETWORK: {
    testnet: 'https://api.testnet.minepi.com/v2',
    mainnet: 'https://api.minepi.com/v2'
  },
  
  // Avante Maps API endpoints
  AVANTE_MAPS: {
    testnet: 'https://testnet-api.avantemaps.com',
    mainnet: 'https://api.avantemaps.com'
  },
  
  // Open Maps API endpoints
  OPEN_MAPS: {
    testnet: 'https://dev.openmaps.io/api/v1',
    mainnet: 'https://api.openmaps.io/v1'
  }
};

// Helper function to get the correct endpoint based on environment
const getEndpoint = (apiType: keyof typeof BASE_URLS): string => {
  const isTestnet = PI_CONFIG.isTestnet;
  const environment = isTestnet ? 'testnet' : 'mainnet';
  return BASE_URLS[apiType][environment];
};

// Export API endpoints
export const API_ENDPOINTS = {
  // Pi Network endpoints
  PI: {
    base: getEndpoint('PI_NETWORK'),
    status: `${getEndpoint('PI_NETWORK')}/status`,
    payments: `${getEndpoint('PI_NETWORK')}/payments`,
  },
  
  // Avante Maps endpoints
  AVANTE: {
    base: getEndpoint('AVANTE_MAPS'),
    businesses: `${getEndpoint('AVANTE_MAPS')}/businesses`,
    analytics: `${getEndpoint('AVANTE_MAPS')}/analytics`,
  },
  
  // Open Maps endpoints
  OPEN_MAPS: {
    base: getEndpoint('OPEN_MAPS'),
    search: `${getEndpoint('OPEN_MAPS')}/search`,
    geocode: `${getEndpoint('OPEN_MAPS')}/geocode`,
  }
};

// Function to get current environment label for display purposes
export const getCurrentEnvironment = (): 'TESTNET' | 'MAINNET' => {
  return PI_CONFIG.isTestnet ? 'TESTNET' : 'MAINNET';
};
