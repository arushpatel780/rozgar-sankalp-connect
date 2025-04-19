
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs, Job } from '@/contexts/JobsContext';
import JobCard from '@/components/JobCard';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const { fetchJobs, jobs, getUserApplications, applications, isLoading } = useJobs();
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  
  const userApplications = getUserApplications();
  
  useEffect(() => {
    // Fetch jobs on component mount
    fetchJobs();
  }, [fetchJobs]);
  
  useEffect(() => {
    if (jobs.length > 0 && user?.location) {
      // Filter nearby jobs
      const nearby = jobs
        .filter(job => job.location === user.location)
        .slice(0, 3);
      setNearbyJobs(nearby);
      
      // Create recommended jobs based on different categories
      const recommended = jobs
        .filter(job => job.location !== user.location) // Different locations
        .slice(0, 3);
      setRecommendedJobs(recommended);
    }
  }, [jobs, user]);
  
  // Stats
  const applicationStats = {
    total: userApplications.length,
    pending: userApplications.filter(app => app.status === 'applied').length,
    underReview: userApplications.filter(app => app.status === 'under_review').length,
    accepted: userApplications.filter(app => app.status === 'accepted').length,
    rejected: userApplications.filter(app => app.status === 'rejected').length,
  };

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
          <Link to="/seeker/jobs">
            <Button className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{applicationStats.total}</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{applicationStats.pending + applicationStats.underReview}</CardTitle>
            <CardDescription>In Progress</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{applicationStats.accepted}</CardTitle>
            <CardDescription>Accepted</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{applicationStats.rejected}</CardTitle>
            <CardDescription>Rejected</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      {/* Location Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rozgar-primary" />
            Your Location
          </CardTitle>
          <CardDescription>
            Jobs are shown based on your current location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {user?.location || 'No location set'}
            </Badge>
            <Link to="/seeker/profile">
              <Button variant="ghost" size="sm">
                Update
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Jobs Tabs */}
      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">Nearby Jobs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
            </div>
          ) : nearbyJobs.length > 0 ? (
            <>
              {nearbyJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
              <div className="text-center mt-6">
                <Link to="/seeker/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No nearby jobs found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any jobs in your current location.
              </p>
              <Link to="/seeker/jobs">
                <Button>Browse All Jobs</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
            </div>
          ) : recommendedJobs.length > 0 ? (
            <>
              {recommendedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
              <div className="text-center mt-6">
                <Link to="/seeker/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recommended jobs yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your profile to get personalized job recommendations.
              </p>
              <Link to="/seeker/jobs">
                <Button>Browse All Jobs</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Recent Applications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
          </div>
        ) : userApplications.length > 0 ? (
          <div className="space-y-4">
            {userApplications.slice(0, 3).map(application => {
              const job = jobs.find(j => j.id === application.jobId);
              if (!job) return null;
              
              return (
                <div key={application.id} className="job-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-rozgar-primary">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="font-medium text-gray-700">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>
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
                </div>
              );
            })}
            
            <div className="text-center mt-6">
              <Link to="/seeker/applications">
                <Button variant="outline">View All Applications</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Apply to jobs to see your applications here.
            </p>
            <Link to="/seeker/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
