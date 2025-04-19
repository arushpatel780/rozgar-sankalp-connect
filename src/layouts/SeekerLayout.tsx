
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import SeekerSidebar from '@/components/SeekerSidebar';
import Navbar from '@/components/Navbar';

const SeekerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 w-full">
          <SeekerSidebar />
          <main className="flex-grow p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SeekerLayout;
