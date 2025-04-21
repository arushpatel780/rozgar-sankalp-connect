
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { JobsProvider } from "./contexts/JobsContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import PublicLayout from "./layouts/PublicLayout";
import EmployerLayout from "./layouts/EmployerLayout";
import SeekerLayout from "./layouts/SeekerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import SeekerDashboard from "./pages/seeker/Dashboard";
import JobSearch from "./pages/seeker/JobSearch";
import JobDetails from "./pages/seeker/JobDetails";
import Applications from "./pages/seeker/Applications";
import EmployerDashboard from "./pages/employer/Dashboard";
import ManageJobs from "./pages/employer/ManageJobs";
import CreateJob from "./pages/employer/CreateJob";
import JobApplicants from "./pages/employer/JobApplicants";
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobsProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
              </Route>
              
              {/* Job Seeker Routes */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["seeker"]}>
                    <SeekerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
                <Route path="/seeker/jobs" element={<JobSearch />} />
                <Route path="/seeker/applications" element={<Applications />} />
              </Route>
              
              {/* Employer Routes */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <EmployerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/jobs" element={<ManageJobs />} />
                <Route path="/employer/jobs/create" element={<CreateJob />} />
                <Route path="/employer/jobs/:id/applicants" element={<JobApplicants />} />
              </Route>
              
              {/* Admin Routes */}
              <Route 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </JobsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
