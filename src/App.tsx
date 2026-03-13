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
import RFQPage from "./pages/RFQPage";
import ImpactPage from "./pages/ImpactPage";
import CSRPage from "./pages/CSRPage";
import SuppliersPage from "./pages/SuppliersPage";
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
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/csr" element={<CSRPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
