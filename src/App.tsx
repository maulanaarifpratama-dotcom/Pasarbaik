import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import AboutPage from "./pages/AboutPage";
import { SuppliersList, SupplierProfile } from "./pages/SuppliersPage";
import { ProgramsList, ProgramDetail } from "./pages/ProgramsPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import NotFound from "./pages/NotFound";
import SupplierCenterLayout from "./pages/SupplierCenter/SupplierCenterLayout";
import RFQInbox from "./pages/SupplierCenter/RFQInbox";
import RFQDetail from "./pages/SupplierCenter/RFQDetail";
import BuyerRFQPage from "./pages/BuyerRFQPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/partner") ||
    location.pathname.startsWith("/supplier-center");

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/suppliers" element={<SuppliersList />} />
        <Route path="/suppliers/:slug" element={<SupplierProfile />} />
        <Route path="/programs" element={<ProgramsList />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rfq" element={<RFQPage />} />
        <Route path="/my-rfq" element={<BuyerRFQPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/partner/*" element={<PartnerDashboard />} />
        <Route path="/supplier-center" element={<SupplierCenterLayout />}>
          <Route index element={<RFQInbox />} />
          <Route path="rfq" element={<RFQInbox />} />
          <Route path="rfq/:id" element={<RFQDetail />} />
        </Route>
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
