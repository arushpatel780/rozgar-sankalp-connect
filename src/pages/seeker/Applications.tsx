
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { useJobs, JobApplication, Job } from '@/contexts/JobsContext';
import { Briefcase, Calendar } from 'lucide-react';

const Applications = () => {
  const { getUserApplications, jobs, isLoading } = useJobs();
  const [applications, setApplications] = useState<(JobApplication & { job?: Job })[]>([]);
  
  useEffect(() => {
    const userApplications = getUserApplications();
    
    // Combine applications with job data
    const combinedData = userApplications.map(app => {
      const jobData = jobs.find(job => job.id === app.jobId);
      return { ...app, job: jobData };
    });
    
    setApplications(combinedData);
  }, [getUserApplications, jobs]);
  
  // Filter applications by status
  const allApplications = applications;
  const pendingApplications = applications.filter(app => app.status === 'applied' || app.status === 'under_review');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  
  // Function to render application status badge
  const renderStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return <Badge variant="secondary">Applied</Badge>;
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'accepted':
        return <Badge variant="default">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({allApplications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApplications.length})
          </TabsTrigger>
        </TabsList>
        
        {/* All Applications Tab */}
        <TabsContent value="all">
          {renderApplicationsTable(allApplications, isLoading, renderStatusBadge)}
        </TabsContent>
        
        {/* Pending Applications Tab */}
        <TabsContent value="pending">
          {renderApplicationsTable(pendingApplications, isLoading, renderStatusBadge)}
        </TabsContent>
        
        {/* Accepted Applications Tab */}
        <TabsContent value="accepted">
          {renderApplicationsTable(acceptedApplications, isLoading, renderStatusBadge)}
        </TabsContent>
        
        {/* Rejected Applications Tab */}
        <TabsContent value="rejected">
          {renderApplicationsTable(rejectedApplications, isLoading, renderStatusBadge)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render applications table
const renderApplicationsTable = (
  applications: (JobApplication & { job?: Job })[],
  isLoading: boolean,
  renderStatusBadge: (status: JobApplication['status']) => JSX.Element | null
) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
      </div>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't applied to any jobs in this category yet.
          </p>
          <Link to="/seeker/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  <Link 
                    to={`/jobs/${application.jobId}`}
                    className="hover:text-rozgar-primary hover:underline"
                  >
                    {application.job?.title || 'Unknown Job'}
                  </Link>
                </TableCell>
                <TableCell>{application.job?.company || 'Unknown Company'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}</span>
                  </div>
                </TableCell>
                <TableCell>{renderStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/jobs/${application.jobId}`}>
                    <Button variant="ghost" size="sm">View Job</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Applications;
