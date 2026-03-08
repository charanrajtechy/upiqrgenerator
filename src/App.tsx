import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaymentPage from "./pages/PaymentPage";
import NotFound from "./pages/NotFound";
import ThemeToggle from "@/components/upi/ThemeToggle";
import FeatureRequestModal from "@/components/upi/FeatureRequestModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeToggle />
        <FeatureRequestModal />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/p/:data" element={<PaymentPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
