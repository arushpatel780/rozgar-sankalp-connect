
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Briefcase, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs, Job, JobApplication } from '@/contexts/JobsContext';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const { getEmployerJobs, getJobApplications, isLoading } = useJobs();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    newApplicants: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<(JobApplication & { job?: Job })[]>([]);
  
  useEffect(() => {
    // Get employer jobs
    const jobs = getEmployerJobs();
    
    // Calculate stats
    const activeJobs = jobs.filter(job => job.status === 'active');
    let totalApplicants = 0;
    let newApplicants = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get all applications across jobs
    const allApplications: (JobApplication & { job?: Job })[] = [];
    
    jobs.forEach(job => {
      const applications = getJobApplications(job.id);
      applications.forEach(app => {
        totalApplicants++;
        if (new Date(app.appliedDate) > sevenDaysAgo) {
          newApplicants++;
        }
        
        allApplications.push({ ...app, job });
      });
    });
    
    // Sort applications by date (newest first)
    allApplications.sort((a, b) => 
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
    
    // Set the stats
    setStats({
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      totalApplicants,
      newApplicants,
    });
    
    // Set recent jobs (latest 3)
    setRecentJobs(jobs.slice(0, 3));
    
    // Set recent applications (latest 5)
    setRecentApplications(allApplications.slice(0, 5));
  }, [getEmployerJobs, getJobApplications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/employer/jobs/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalJobs}</CardTitle>
            <CardDescription>Total Jobs Posted</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.activeJobs}</CardTitle>
            <CardDescription>Active Job Listings</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.totalApplicants}</CardTitle>
            <CardDescription>Total Applicants</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.newApplicants}</CardTitle>
            <CardDescription>New Applicants (7 days)</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      {/* Tabs for Recent Activities */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          <TabsTrigger value="applications">Recent Applications</TabsTrigger>
        </TabsList>
        
        {/* Recent Jobs Tab */}
        <TabsContent value="jobs" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map(job => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-rozgar-primary mb-2">
                          <Link to={`/employer/jobs/${job.id}/applicants`} className="hover:underline">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{job.category}</Badge>
                          <Badge variant="outline">{job.jobType}</Badge>
                          <Badge variant="outline">{job.location}</Badge>
                        </div>
                      </div>
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Link to={`/employer/jobs/${job.id}/applicants`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Applicants</span>
                          </Button>
                        </Link>
                        <Link to={`/employer/jobs/edit/${job.id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center mt-4">
                <Link to="/employer/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start attracting talent by posting your first job listing.
              </p>
              <Link to="/employer/jobs/create">
                <Button>Post New Job</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        {/* Recent Applications Tab */}
        <TabsContent value="applications" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
            </div>
          ) : recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map(application => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-rozgar-primary mb-2">
                          <Link to={`/employer/jobs/${application.jobId}/applicants`} className="hover:underline">
                            {application.job?.title || 'Unknown Job'}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Application ID: {application.id}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          application.status === 'accepted' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {application.status === 'applied' ? 'Applied' : 
                         application.status === 'under_review' ? 'Under Review' :
                         application.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <Link to={`/employer/jobs/${application.jobId}/applicants`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center mt-4">
                <Link to="/employer/applicants">
                  <Button variant="outline">View All Applicants</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">
                Once you receive applications, they'll show up here.
              </p>
              <Link to="/employer/jobs/create">
                <Button>Post New Job</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerDashboard;
