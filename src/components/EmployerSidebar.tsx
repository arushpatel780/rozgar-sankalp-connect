
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Briefcase, Users, Plus, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const EmployerSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/employer/dashboard',
    },
    {
      icon: Briefcase,
      label: 'Manage Jobs',
      path: '/employer/jobs',
    },
    {
      icon: Users,
      label: 'Applicants',
      path: '/employer/applicants',
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/employer/notifications',
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Employer</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <h3 className="font-semibold mb-1">Welcome, {user?.name}</h3>
              <p className="text-sm text-muted-foreground">Manage your job listings</p>
            </div>
            
            <div className="px-3 py-2">
              <Button 
                className="w-full flex items-center gap-2" 
                onClick={() => navigate('/employer/jobs/create')}
              >
                <Plus className="h-4 w-4" />
                <span>Post New Job</span>
              </Button>
            </div>
            
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default EmployerSidebar;
