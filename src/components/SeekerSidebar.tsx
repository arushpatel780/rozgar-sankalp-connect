
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
import { Home, Search, FileText, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LocationSelector from './LocationSelector';

const SeekerSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/seeker/dashboard',
    },
    {
      icon: Search,
      label: 'Find Jobs',
      path: '/seeker/jobs',
    },
    {
      icon: FileText,
      label: 'My Applications',
      path: '/seeker/applications',
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/seeker/notifications',
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Job Seeker</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <h3 className="font-semibold mb-1">Welcome, {user?.name}</h3>
              <p className="text-sm text-muted-foreground">Find your dream job</p>
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
        
        <SidebarGroup>
          <SidebarGroupLabel>Your Location</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <LocationSelector />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SeekerSidebar;
