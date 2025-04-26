
import { isPiNetworkAvailable } from './helpers';
import { initializePiNetwork } from './initialization';

/**
 * Request wallet address permission explicitly
 * This function is specifically used when wallet_address permission is required
 * for payment operations
 */
export const requestWalletPermission = async (): Promise<string | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    return null;
  }
  
  try {
    // Ensure SDK is initialized before requesting permissions
    if (!window.Pi?.init) {
      console.log('Pi Network SDK was not initialized. Initializing now...');
      try {
        await initializePiNetwork();
      } catch (error) {
        console.error('Failed to initialize Pi Network SDK:', error);
        return null;
      }
    }
    
    console.log('Specifically requesting wallet_address permission');
    // Make a focused request just for wallet_address permission
    const authResult = await window.Pi?.authenticate(['wallet_address'], (payment) => {
      console.log('Incomplete payment found during wallet address request:', payment);
    });
    
    if (!authResult) {
      console.error('Failed to get wallet_address permission - authentication was null or undefined');
      return null;
    }
    
    // Check if wallet_address permission was granted using roles array
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    
    if (hasWalletPermission && 'wallet_address' in authResult.user) {
      const walletAddress = authResult.user.wallet_address as string;
      if (walletAddress) {
        console.log('Wallet address permission successfully granted:', walletAddress);
        return walletAddress;
      }
    }
    
    console.warn('Wallet address permission was not granted or address is not available');
    return null;
  } catch (error) {
    console.error('Error requesting wallet address permission:', error);
    return null;
  }
};
