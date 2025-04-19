
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Menu } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'seeker': return '/seeker/dashboard';
      case 'employer': return '/employer/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="md:hidden">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
            </div>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-rozgar-primary">Rozgar</span>
            <span className="font-semibold text-rozgar-secondary">Sankalp</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-rozgar-primary transition-colors">Home</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-rozgar-primary transition-colors">Jobs</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>

        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={user?.role === 'seeker' ? '/seeker/applications' : '/employer/jobs'}>
                  {user?.role === 'seeker' ? 'My Applications' : 'My Jobs'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
