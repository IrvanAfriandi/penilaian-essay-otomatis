import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Exams from "./pages/Exams";
import ExamDetail from "./pages/ExamDetail";
import UploadAnswer from "./pages/UploadAnswer";
import ParticipantView from "./pages/ParticipantView";
import EditParticipant from "./pages/EditParticipant";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/students" element={<AppLayout><Students /></AppLayout>} />
          <Route path="/exams" element={<AppLayout><Exams /></AppLayout>} />
          <Route path="/exams/:id" element={<AppLayout><ExamDetail /></AppLayout>} />
          <Route path="/exams/:examId/upload/:participantId" element={<AppLayout><UploadAnswer /></AppLayout>} />
          <Route path="/exams/:examId/participant/:participantId" element={<AppLayout><ParticipantView /></AppLayout>} />
          <Route path="/exams/:examId/edit/:participantId" element={<AppLayout><EditParticipant /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
