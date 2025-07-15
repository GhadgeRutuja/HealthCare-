
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2, Stethoscope } from "lucide-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import ServicesPage from "./pages/ServicesPage";
import FindDoctors from "./pages/FindDoctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 flex items-center justify-center">
    <div className="text-center">
      <div className="gradient-sky p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
        <Stethoscope className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-sky-900 mb-2">HealthCare+</h2>
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
        <span className="text-sky-600">Loading...</span>
      </div>
    </div>
  </div>
);

// App routes component that checks auth loading
const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/doctors" element={<FindDoctors />} />
        <Route path="/find-doctors" element={<FindDoctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/patient" element={<Login />} />
        <Route path="/login/doctor" element={<Login />} />
        <Route path="/login/admin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/patient" element={<SignUp />} />
        <Route path="/signup/doctor" element={<SignUp />} />
        <Route path="/book-appointment" element={<BookingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
