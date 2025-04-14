import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth";
import Index from "./pages/Index";
import Recommendations from "./pages/Recommendations";
import Bookmarks from "./pages/Bookmarks";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Settings from "./pages/Settings";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Registration from "./pages/Registration";
import UpdateRegistration from "./pages/UpdateRegistration";
import NotFound from "./pages/NotFound";
import Communicon from "./pages/Communicon";
import Notifications from "./pages/Notifications";
import RegisteredBusiness from "./pages/RegisteredBusiness";
import VerificationInfo from "./pages/VerificationInfo";
import Review from "./pages/Review";
import Pricing from "./pages/Pricing";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedScheme = localStorage.getItem('colorScheme');
    
    if (savedScheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (savedScheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      localStorage.setItem('colorScheme', 'light');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/communicon" element={<Communicon />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/registered-business" element={<RegisteredBusiness />} />
                <Route path="/verification-info" element={<VerificationInfo />} />
                <Route path="/review/:businessId?" element={<Review />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/update-registration/:businessId?" element={<UpdateRegistration />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
