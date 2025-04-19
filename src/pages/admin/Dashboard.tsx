
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs } from '@/contexts/JobsContext';
import { Briefcase, Users, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const { jobs, applications } = useJobs();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    employers: 0,
    jobSeekers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  });
  
  useEffect(() => {
    // In a real app, these would come from API calls
    // Here we're using mock data
    setStats({
      totalUsers: 120,
      employers: 40,
      jobSeekers: 80,
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'active').length,
      totalApplications: applications.length,
    });
  }, [jobs, applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, jobs, and platform analytics
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalUsers}</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Badge variant="outline">{stats.employers}</Badge>
                <span className="text-sm">Employers</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline">{stats.jobSeekers}</Badge>
                <span className="text-sm">Job Seekers</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalJobs}</CardTitle>
            <CardDescription>Total Job Listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Badge variant="outline">{stats.activeJobs}</Badge>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline">{stats.totalJobs - stats.activeJobs}</Badge>
                <span className="text-sm">Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalApplications}</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Application statistics
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and their access to the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Approve Employers
              </Button>
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <X className="h-4 w-4" />
                Suspend Users
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>
              Moderate and manage job listings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Manage Job Listings
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Approve Jobs
              </Button>
              <Button variant="outline" className="flex-1 flex items-center gap-2">
                <X className="h-4 w-4" />
                Delete Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities Tab */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Monitor recent activities on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="pt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Job Posted</p>
                      <p className="text-sm text-muted-foreground">Software Developer at Tech Solutions</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Posted 2 hours ago</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Updated</p>
                      <p className="text-sm text-muted-foreground">Marketing Manager at Brand Builders</p>
                    </div>
                    <Badge variant="outline">Updated</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Updated 5 hours ago</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="pt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New User Registered</p>
                      <p className="text-sm text-muted-foreground">John Doe - Job Seeker</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Registered 3 hours ago</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Employer Registered</p>
                      <p className="text-sm text-muted-foreground">Acme Corporation</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Registered 1 day ago</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="pt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Application</p>
                      <p className="text-sm text-muted-foreground">Software Developer at Tech Solutions</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Applied 1 hour ago</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Status Updated</p>
                      <p className="text-sm text-muted-foreground">Marketing Manager at Brand Builders</p>
                    </div>
                    <Badge variant="default">Accepted</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Updated 4 hours ago</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
