
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Calendar, User, Mail, MapPin, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useJobs, Job, JobApplication } from '@/contexts/JobsContext';

interface ApplicantViewData {
  applicationId: string;
  status: JobApplication['status'];
  appliedDate: Date;
  coverLetter?: string;
  // In a real app, these would come from the user profile
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
}

const JobApplicants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchJobById, getJobApplications, updateApplicationStatus, isLoading } = useJobs();
  
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantViewData | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        // Fetch job details
        const jobData = await fetchJobById(id);
        if (jobData) {
          setJob(jobData);
          
          // Fetch applications for this job
          const jobApplications = getJobApplications(id);
          setApplications(jobApplications);
        } else {
          // Job not found, redirect
          navigate('/employer/jobs');
        }
      }
    };
    
    loadData();
  }, [id, fetchJobById, getJobApplications, navigate]);
  
  const handleViewApplicant = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;
    
    // In a real app, you would fetch the user profile data
    // Here we're creating mock user data
    const mockUserData: ApplicantViewData = {
      applicationId: application.id,
      status: application.status,
      appliedDate: new Date(application.appliedDate),
      coverLetter: application.coverLetter,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      location: '110001',
      experience: '3 years',
      education: 'Bachelor of Technology',
    };
    
    setSelectedApplicant(mockUserData);
  };
  
  const handleUpdateStatus = async (status: JobApplication['status']) => {
    if (!selectedApplicant) return;
    
    setIsUpdatingStatus(true);
    try {
      const success = await updateApplicationStatus(selectedApplicant.applicationId, status);
      
      if (success) {
        // Update local state
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.id === selectedApplicant.applicationId ? { ...app, status } : app
          )
        );
        
        // Update selected applicant
        setSelectedApplicant(prev => prev ? { ...prev, status } : null);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // Filter applications by status
  const allApplications = applications;
  const pendingApplications = applications.filter(app => app.status === 'applied');
  const reviewingApplications = applications.filter(app => app.status === 'under_review');
  const processedApplications = applications.filter(app => 
    app.status === 'accepted' || app.status === 'rejected'
  );
  
  if (isLoading || !job) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rozgar-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{job.title} - Applicants</h1>
        <p className="text-muted-foreground">
          Review and manage applications for this position
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <CardDescription>
            {job.company} • {job.location} • {job.jobType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
              {job.status === 'active' ? 'Active' : 'Closed'}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
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
        
        {/* All Applications Tab */}
        <TabsContent value="all">
          {renderApplicationsTable(allApplications, handleViewApplicant)}
        </TabsContent>
        
        {/* Pending Applications Tab */}
        <TabsContent value="pending">
          {renderApplicationsTable(pendingApplications, handleViewApplicant)}
        </TabsContent>
        
        {/* Under Review Applications Tab */}
        <TabsContent value="reviewing">
          {renderApplicationsTable(reviewingApplications, handleViewApplicant)}
        </TabsContent>
        
        {/* Processed Applications Tab */}
        <TabsContent value="processed">
          {renderApplicationsTable(processedApplications, handleViewApplicant)}
        </TabsContent>
      </Tabs>
      
      {/* Applicant Details Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              Review the applicant's information and manage their application status
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-md p-6 text-center">
                    <div className="h-24 w-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold">{selectedApplicant.name}</h3>
                    <p className="text-gray-600 mt-1">Applicant</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedApplicant.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedApplicant.phone}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedApplicant.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Application Status</h3>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          selectedApplicant.status === 'accepted' ? 'default' : 
                          selectedApplicant.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {selectedApplicant.status === 'applied' ? 'Applied' : 
                         selectedApplicant.status === 'under_review' ? 'Under Review' :
                         selectedApplicant.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </Badge>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Applied {formatDistanceToNow(selectedApplicant.appliedDate, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isUpdatingStatus || selectedApplicant.status === 'applied'}
                        onClick={() => handleUpdateStatus('applied')}
                      >
                        Mark as Applied
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isUpdatingStatus || selectedApplicant.status === 'under_review'}
                        onClick={() => handleUpdateStatus('under_review')}
                      >
                        Under Review
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        disabled={isUpdatingStatus || selectedApplicant.status === 'accepted'}
                        onClick={() => handleUpdateStatus('accepted')}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={isUpdatingStatus || selectedApplicant.status === 'rejected'}
                        onClick={() => handleUpdateStatus('rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  
                  {selectedApplicant.coverLetter && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                      <div className="bg-gray-50 p-4 rounded-md text-gray-700 max-h-48 overflow-y-auto">
                        <p className="whitespace-pre-line">{selectedApplicant.coverLetter}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Experience</h3>
                    <p>{selectedApplicant.experience}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                    <p>{selectedApplicant.education}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApplicant(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to render applications table
const renderApplicationsTable = (
  applications: JobApplication[],
  onViewApplicant: (id: string) => void
) => {
  if (applications.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
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
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">
                  {application.id}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}
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
                    onClick={() => onViewApplicant(application.id)}
                  >
                    View Details
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

export default JobApplicants;
