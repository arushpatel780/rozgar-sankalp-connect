
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useJobs, JobApplication } from '@/contexts/JobsContext';

const Applicants = () => {
  const { getJobApplications } = useJobs();
  const [activeTab, setActiveTab] = useState('all');
  
  // Get all applications across all jobs
  const allApplications = Object.values(useJobs().jobs).flatMap(job => 
    getJobApplications(job.id)
  );
  
  // Filter applications by status
  const pendingApplications = allApplications.filter(app => app.status === 'applied');
  const reviewingApplications = allApplications.filter(app => app.status === 'under_review');
  const processedApplications = allApplications.filter(app => 
    app.status === 'accepted' || app.status === 'rejected'
  );
  
  // Get applications based on active tab
  const getApplicationsByTab = () => {
    switch (activeTab) {
      case 'pending':
        return pendingApplications;
      case 'reviewing':
        return reviewingApplications;
      case 'processed':
        return processedApplications;
      default:
        return allApplications;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Applicants</h1>
        <p className="text-muted-foreground">
          View and manage applicants across all your job postings
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({allApplications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            New ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing ({reviewingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({processedApplications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {renderApplicationsTable(getApplicationsByTab())}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render applications table
const renderApplicationsTable = (applications: JobApplication[]) => {
  if (applications.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">
            There are no applicants in this category.
          </p>
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
              <TableHead>Applicant ID</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  Job #{application.jobId.substring(0, 8)}
                </TableCell>
                <TableCell>
                  {new Date(application.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a href={`/employer/jobs/${application.jobId}/applicants`}>View Details</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Applicants;
