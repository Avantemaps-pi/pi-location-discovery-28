
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context
export default AuthContext;
