
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SolanaWalletProvider } from "./components/SolanaWalletProvider";
import Index from "./pages/Index";
import VibeDex from "./pages/VibeDex";
import DealRoomPage from "./pages/DealRoomPage";
import DaoPage from "./pages/DaoPage";
import ForumsPage from "./pages/ForumsPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SolanaWalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="bottom-right" theme="dark" closeButton />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dex" element={<VibeDex />} />
                <Route path="/deal-room" element={<DealRoomPage />} />
                <Route path="/dao" element={<DaoPage />} />
                <Route path="/forums" element={<ForumsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </SolanaWalletProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
