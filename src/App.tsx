import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import RFQPage from "./pages/RFQPage";
import ImpactPage from "./pages/ImpactPage";
import CSRPage from "./pages/CSRPage";
import { SuppliersList, SupplierProfile } from "./pages/SuppliersPage";
import { ProgramsList, ProgramDetail } from "./pages/ProgramsPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/suppliers" element={<SuppliersList />} />
            <Route path="/suppliers/:id" element={<SupplierProfile />} />
            <Route path="/programs" element={<ProgramsList />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="/csr" element={<CSRPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
