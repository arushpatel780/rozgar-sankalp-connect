
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Briefcase, Clock, ArrowLeft, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchJobById, jobs, applyToJob, getUserApplications, isLoading } = useJobs();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(jobs.find(j => j.id === id));
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const userApplications = getUserApplications();
  const hasApplied = userApplications.some(app => app.jobId === id);
  
  useEffect(() => {
    const loadJob = async () => {
      if (id) {
        const jobData = await fetchJobById(id);
        if (jobData) {
          setJob(jobData);
        } else {
          // Job not found, redirect to jobs page
          navigate('/jobs');
        }
      }
    };
    
    loadJob();
  }, [id, fetchJobById, navigate]);
  
  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsApplying(true);
    try {
      const success = await applyToJob(id!, coverLetter);
      if (success) {
        setDialogOpen(false);
        // Reload the page to reflect the new application status
        window.location.reload();
      }
    } finally {
      setIsApplying(false);
    }
  };
  
  if (isLoading || !job) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rozgar-primary"></div>
      </div>
    );
  }
  
  const timeAgo = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <p className="text-xl">{job.company}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {job.status === 'active' ? (
                hasApplied ? (
                  <Button variant="outline" disabled className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Applied
                  </Button>
                ) : (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to {job.title}</DialogTitle>
                        <DialogDescription>
                          Submit your application for this position at {job.company}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="cover-letter" className="text-sm font-medium">
                            Cover Letter (optional)
                          </label>
                          <Textarea
                            id="cover-letter"
                            placeholder="Tell the employer why you're a good fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleApply}
                          disabled={isApplying}
                        >
                          {isApplying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )
              ) : (
                <Button variant="outline" disabled>
                  Job Closed
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Posted {timeAgo}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{job.category}</Badge>
            {job.status === 'active' ? (
              <Badge className="bg-green-600">Active</Badge>
            ) : (
              <Badge variant="secondary">Closed</Badge>
            )}
          </div>
          
          <div className="text-lg font-medium text-rozgar-primary">
            {job.salary}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="description" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>{job.company}</CardTitle>
              <CardDescription>About the company</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Information about {job.company} will be displayed here. This would include the company description, mission, values, and other details that help job seekers learn more about the organization.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        
        {job.status === 'active' && !hasApplied && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Apply Now</Button>
            </DialogTrigger>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
