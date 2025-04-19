
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
import { Home, Users, Briefcase, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: Users,
      label: 'Manage Users',
      path: '/admin/users',
    },
    {
      icon: Briefcase,
      label: 'Manage Jobs',
      path: '/admin/jobs',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings',
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <h3 className="font-semibold mb-1">Welcome, {user?.name}</h3>
              <p className="text-sm text-muted-foreground">System Administrator</p>
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

export default AdminSidebar;
