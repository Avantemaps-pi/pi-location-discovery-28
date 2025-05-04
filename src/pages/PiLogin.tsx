
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isPiBrowser } from '@/utils/piNetwork/piNetworkDetection';
import { initializePiNetwork, isSdkInitialized } from '@/utils/piNetwork';
import { requestUserPermissions } from '@/utils/piNetwork';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { verifyPiAuthWithBackend } from '@/utils/piNetwork/piAuthIntegration';
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

const PiLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const [loginStage, setLoginStage] = useState<string>('init');
  const loadingStartTime = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Track performance metrics
  const metrics = useRef({
    sdkLoadTime: 0,
    authTime: 0,
    verifyTime: 0,
    totalTime: 0
  });
  
  // Initialize Pi SDK when the component mounts with improved error handling and performance tracking
  useEffect(() => {
    // Start measuring performance
    loadingStartTime.current = performance.now();
    
    const initPiSdk = async () => {
      setIsLoading(true);
      setLoginStage('sdk');
      const sdkStartTime = performance.now();
      
      try {
        if (isSdkInitialized()) {
          console.log('Pi Network SDK is already initialized');
          metrics.current.sdkLoadTime = performance.now() - sdkStartTime;
          console.log(`SDK was already initialized (${Math.round(metrics.current.sdkLoadTime)}ms)`);
          setIsSdkReady(true);
          setIsLoading(false);
          return;
        }
        
        await initializePiNetwork();
        metrics.current.sdkLoadTime = performance.now() - sdkStartTime;
        console.log(`Pi Network SDK initialized successfully (${Math.round(metrics.current.sdkLoadTime)}ms)`);
        setIsSdkReady(true);
      } catch (error) {
        console.error('Failed to initialize Pi Network SDK:', error);
        setError('Failed to initialize Pi Network SDK. Please try again.');
        
        // Auto-retry initialization a few times with exponential backoff
        if (initAttempts < 3) {
          const nextAttempt = initAttempts + 1;
          const delay = 1000 * Math.pow(1.5, nextAttempt); // 1.5s, 2.25s, 3.375s
          console.log(`Retrying SDK initialization (attempt ${nextAttempt}/3) in ${delay}ms...`);
          setInitAttempts(nextAttempt);
          setTimeout(initPiSdk, delay);
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
        setLoginStage('sdk');
        const sdkStartTime = performance.now();
        await initializePiNetwork();
        metrics.current.sdkLoadTime = performance.now() - sdkStartTime;
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
      setLoginStage('auth');
      const authStartTime = performance.now();
      const authResult = await requestUserPermissions();
      metrics.current.authTime = performance.now() - authStartTime;
      
      if (!authResult) {
        throw new Error("Authentication failed. Please try again.");
      }
      
      console.log(`Pi authentication successful (${Math.round(metrics.current.authTime)}ms):`, authResult);
      
      // Verify with backend and establish Supabase session
      setLoginStage('verify');
      const verifyStartTime = performance.now();
      toast.loading("Verifying your account...", { id: "pi-verify" });
      
      const verificationSuccess = await verifyPiAuthWithBackend(
        authResult.accessToken,
        authResult.uid,
        authResult.username
      );
      
      metrics.current.verifyTime = performance.now() - verifyStartTime;
      toast.dismiss("pi-verify");
      
      if (!verificationSuccess) {
        throw new Error("Failed to verify authentication with our servers.");
      }
      
      toast.success(`Welcome, ${authResult.username}!`);
      
      // Calculate total time
      if (loadingStartTime.current) {
        metrics.current.totalTime = performance.now() - loadingStartTime.current;
        console.log(`Login performance metrics:
          - SDK load: ${Math.round(metrics.current.sdkLoadTime)}ms
          - Authentication: ${Math.round(metrics.current.authTime)}ms
          - Verification: ${Math.round(metrics.current.verifyTime)}ms
          - Total time: ${Math.round(metrics.current.totalTime)}ms
        `);
      }
      
      // Preload data before redirect
      setLoginStage('preload');
      await Promise.all([
        // Preload common data here
        new Promise(resolve => setTimeout(resolve, 200)) // Placeholder
      ]);
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Pi authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoginStage('complete');
    }
  };
  
  const getLoginStateMessage = () => {
    switch (loginStage) {
      case 'sdk': return "Connecting to Pi Network...";
      case 'auth': return "Authenticating your account...";
      case 'verify': return "Verifying your credentials...";
      case 'preload': return "Loading your data...";
      case 'complete': return error ? "Login failed" : "Login successful!";
      default: return "Preparing login...";
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
            
            {/* Login status indicator */}
            <div className="mb-6 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary animate-pulse transition-all" 
                      style={{ 
                        width: loginStage === 'sdk' ? '25%' : 
                               loginStage === 'auth' ? '50%' : 
                               loginStage === 'verify' ? '75%' : 
                               loginStage === 'preload' ? '90%' : '100%' 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-center font-medium">{getLoginStateMessage()}</p>
                </div>
              ) : error ? (
                <div className="p-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              ) : isSdkReady && (
                <div className="p-3 flex items-center gap-2 text-sm text-green-500 bg-green-50 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  Ready to connect
                </div>
              )}
            </div>
            
            <Button 
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={handlePiLogin}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {getLoginStateMessage()}
                </>
              ) : 'Connect with Pi Network'}
            </Button>
            
            {!isSdkReady && isPiBrowser() && !isLoading && (
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
