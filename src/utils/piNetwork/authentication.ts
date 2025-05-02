
import { isPiNetworkAvailable } from './helpers';
import { initializePiNetwork } from './initialization';
import { Scope } from './types';

/**
 * Request additional user permissions
 * According to SDK documentation, this should request any scopes that may have been rejected 
 * or not requested previously
 */
export const requestUserPermissions = async (): Promise<{
  username: string;
  uid: string;
  accessToken: string;
  walletAddress?: string;
} | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    return null;
  }
  
  // Ensure SDK is initialized
  if (!window.Pi?.init) {
    console.log('Pi Network SDK was not initialized. Initializing now...');
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      return null;
    }
  }

  try {
    // Use authenticate to request the required scopes as per SDK reference
    console.log('Requesting permissions with authenticate: username, payments, wallet_address');
    const scopes: Scope[] = ['username', 'payments', 'wallet_address'];
    
    const authResult = await window.Pi?.authenticate(scopes, (payment) => {
      console.log('Incomplete payment found during permission request:', payment);
      // Handle incomplete payment if needed
    });
    
    console.log('Permission request result:', authResult);
    
    if (!authResult) {
      console.error('Failed to get user permissions - authentication was null or undefined');
      return null;
    }

    // Safely extract wallet address if permission was granted
    let walletAddress: string | undefined = undefined;
    
    // Check if wallet_address permission was granted (using roles array)
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    console.log('Has wallet_address permission:', hasWalletPermission);

    if (hasWalletPermission && 'wallet_address' in authResult.user) {
      const userWalletAddress = authResult.user.wallet_address as string;
      if (userWalletAddress) {
        walletAddress = userWalletAddress;
        console.log('Wallet address permission granted:', walletAddress);
      }
    } else {
      console.warn('Wallet address permission not granted or address not available');
    }

    return {
      username: authResult.user.username,
      uid: authResult.user.uid,
      accessToken: authResult.accessToken,
      walletAddress: walletAddress
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};
