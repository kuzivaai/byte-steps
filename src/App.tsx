import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CookieConsent } from "@/components/CookieConsent";
import { Privacy } from "@/pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Skip to main content link */}
        <div className="sr-only focus-within:not-sr-only">
          <a 
            href="#main-content" 
            className="absolute top-4 left-4 bg-blue-600 text-white p-3 rounded z-50 text-lg focus:not-sr-only"
          >
            Skip to main content
          </a>
        </div>
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
