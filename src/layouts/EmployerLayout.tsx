
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import EmployerSidebar from '@/components/EmployerSidebar';
import Navbar from '@/components/Navbar';
import { Toaster } from "@/components/ui/toaster";

const EmployerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <EmployerSidebar />
          <main className="flex-grow p-6">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default EmployerLayout;
