
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isPiBrowser } from '@/utils/piNetwork/piNetworkDetection';
import { initializePiNetwork, isSdkInitialized } from '@/utils/piNetwork';
import { requestUserPermissions } from '@/utils/piNetwork';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { verifyPiAuthWithBackend } from '@/utils/piNetwork/piAuthIntegration';
import { Loader2 } from "lucide-react";

const PiLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const navigate = useNavigate();
  
  // Initialize Pi SDK when the component mounts with improved error handling
  useEffect(() => {
    const initPiSdk = async () => {
      setIsLoading(true);
      try {
        if (isSdkInitialized()) {
          console.log('Pi Network SDK is already initialized');
          setIsSdkReady(true);
          setIsLoading(false);
          return;
        }
        
        await initializePiNetwork();
        console.log('Pi Network SDK initialized successfully');
        setIsSdkReady(true);
      } catch (error) {
        console.error('Failed to initialize Pi Network SDK:', error);
        setError('Failed to initialize Pi Network SDK. Please try again.');
        
        // Auto-retry initialization a few times
        if (initAttempts < 3) {
          console.log(`Retrying SDK initialization (attempt ${initAttempts + 1}/3)...`);
          setInitAttempts(prev => prev + 1);
          setTimeout(initPiSdk, 1500); // Retry after 1.5 seconds
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only initialize if in Pi Browser
    if (isPiBrowser()) {
      initPiSdk();
    } else {
      // If not in Pi Browser, show warning and redirect after a delay
      toast.warning("This page is optimized for Pi Browser. You may experience limited functionality.");
      setTimeout(() => {
        if (location.pathname === '/pi-login') {
          navigate('/');
        }
      }, 5000);
    }
  }, [navigate, initAttempts]);
  
  const handlePiLogin = async () => {
    if (!isSdkReady) {
      try {
        await initializePiNetwork();
        setIsSdkReady(true);
      } catch (error) {
        setError('Failed to initialize Pi Network SDK. Please try again.');
        toast.error('Pi Network SDK initialization failed. Please try again.');
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Request authentication from Pi Network
      const authResult = await requestUserPermissions();
      
      if (!authResult) {
        throw new Error("Authentication failed. Please try again.");
      }
      
      console.log("Pi authentication successful:", authResult);
      
      // Verify with backend and establish Supabase session
      const verificationSuccess = await verifyPiAuthWithBackend(
        authResult.accessToken,
        authResult.uid,
        authResult.username
      );
      
      if (!verificationSuccess) {
        throw new Error("Failed to verify authentication with our servers.");
      }
      
      toast.success(`Welcome, ${authResult.username}!`);
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Pi authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout hideSidebar={true}>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Sign in with Pi Network
            </CardTitle>
            <CardDescription className="text-center">
              Authenticate using your Pi Network account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <img src="/lovable-uploads/Avantemaps.png" alt="Pi Logo" className="w-12 h-12" />
            </div>
            
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={handlePiLogin}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : 'Connect with Pi Network'}
            </Button>
            
            {!isSdkReady && isPiBrowser() && (
              <p className="text-sm text-center mt-4 text-amber-600">
                Initializing Pi Network SDK... Please wait.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>By connecting, you agree to the terms and conditions of Pi Network and Avante Maps.</p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PiLogin;
