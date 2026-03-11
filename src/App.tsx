import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Estoque from "./pages/Estoque";
import Producao from "./pages/Producao";
import Funcionarios from "./pages/Funcionarios";
import Equipamentos from "./pages/Equipamentos";
import Pendencias from "./pages/Pendencias";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute requiredRole="lider"><Index /></ProtectedRoute>} />
            <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
            <Route path="/producao" element={<ProtectedRoute><Producao /></ProtectedRoute>} />
            <Route path="/funcionarios" element={<ProtectedRoute requiredRole="lider"><Funcionarios /></ProtectedRoute>} />
            <Route path="/equipamentos" element={<ProtectedRoute requiredRole="lider"><Equipamentos /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
