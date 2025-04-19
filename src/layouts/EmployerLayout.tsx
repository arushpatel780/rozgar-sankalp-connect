
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import EmployerSidebar from '@/components/EmployerSidebar';
import Navbar from '@/components/Navbar';

const EmployerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 w-full">
          <EmployerSidebar />
          <main className="flex-grow p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployerLayout;
