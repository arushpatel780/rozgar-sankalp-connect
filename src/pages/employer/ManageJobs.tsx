
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Users, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useJobs, Job } from '@/contexts/JobsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ManageJobs = () => {
  const { getEmployerJobs, deleteJob, updateJob, getJobApplications, isLoading } = useJobs();
  const [jobs, setJobs] = useState<(Job & { applicantCount: number })[]>([]);
  const [jobToClose, setJobToClose] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Get employer jobs and add applicant count
    const employerJobs = getEmployerJobs();
    const jobsWithApplicants = employerJobs.map(job => ({
      ...job,
      applicantCount: getJobApplications(job.id).length,
    }));
    
    setJobs(jobsWithApplicants);
  }, [getEmployerJobs, getJobApplications]);
  
  const handleCloseJob = async () => {
    if (!jobToClose) return;
    
    setIsProcessing(true);
    try {
      await updateJob(jobToClose, { status: 'closed' });
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobToClose ? { ...job, status: 'closed' } : job
      ));
    } finally {
      setJobToClose(null);
      setIsProcessing(false);
    }
  };
  
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    setIsProcessing(true);
    try {
      await deleteJob(jobToDelete);
      
      // Update local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobToDelete));
    } finally {
      setJobToDelete(null);
      setIsProcessing(false);
    }
  };
  
  // Filter jobs by status
  const activeJobs = jobs.filter(job => job.status === 'active');
  const closedJobs = jobs.filter(job => job.status === 'closed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground">
            Create, edit, and monitor your job listings
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
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active Jobs ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed Jobs ({closedJobs.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Active Jobs Tab */}
        <TabsContent value="active" className="mt-4">
          <JobsTable 
            jobs={activeJobs} 
            isLoading={isLoading} 
            showCloseButton={true}
            onCloseJob={setJobToClose}
            onDeleteJob={setJobToDelete}
          />
        </TabsContent>
        
        {/* Closed Jobs Tab */}
        <TabsContent value="closed" className="mt-4">
          <JobsTable 
            jobs={closedJobs} 
            isLoading={isLoading} 
            showCloseButton={false}
            onDeleteJob={setJobToDelete}
          />
        </TabsContent>
      </Tabs>
      
      {/* Close Job Dialog */}
      <Dialog open={!!jobToClose} onOpenChange={() => setJobToClose(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Job Listing</DialogTitle>
            <DialogDescription>
              This will mark the job as closed and it will no longer appear in job searches.
              You can still view applications that were already submitted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJobToClose(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleCloseJob}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Close Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Job Alert Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job listing
              and remove all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteJob}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground"
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Jobs Table Component
interface JobsTableProps {
  jobs: (Job & { applicantCount: number })[];
  isLoading: boolean;
  showCloseButton: boolean;
  onCloseJob?: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
}

const JobsTable = ({ 
  jobs, 
  isLoading, 
  showCloseButton,
  onCloseJob,
  onDeleteJob
}: JobsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rozgar-primary"></div>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {showCloseButton 
              ? "You don't have any active job listings. Create one to start finding talent."
              : "You don't have any closed job listings."}
          </p>
          {showCloseButton && (
            <Link to="/employer/jobs/create">
              <Button>Post New Job</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">
          {showCloseButton ? 'Active Job Listings' : 'Closed Job Listings'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map(job => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{job.title}</span>
                    <span className="text-sm text-muted-foreground">{job.company}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{job.category}</Badge>
                </TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Badge>{job.applicantCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/employer/jobs/${job.id}/applicants`}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Users className="h-4 w-4" />
                        <span className="sr-only">View Applicants</span>
                      </Button>
                    </Link>
                    <Link to={`/employer/jobs/edit/${job.id}`}>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    {showCloseButton && onCloseJob && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onCloseJob(job.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => onDeleteJob(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageJobs;
