
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

// Job types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  jobType: string;
  category: string;
  postedDate: Date;
  employerId: string;
  status: 'active' | 'closed';
}

export interface JobApplication {
  id: string;
  jobId: string;
  seekerId: string;
  status: 'applied' | 'under_review' | 'accepted' | 'rejected';
  appliedDate: Date;
  coverLetter?: string;
}

// Context type
interface JobsContextType {
  jobs: Job[];
  applications: JobApplication[];
  isLoading: boolean;
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  fetchJobById: (id: string) => Promise<Job | undefined>;
  createJob: (jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'status'>) => Promise<string>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  applyToJob: (jobId: string, coverLetter?: string) => Promise<boolean>;
  getJobApplications: (jobId: string) => JobApplication[];
  getUserApplications: () => JobApplication[];
  getEmployerJobs: () => Job[];
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<boolean>;
}

// Filters for job search
export interface JobFilters {
  location?: string;
  category?: string;
  jobType?: string;
  search?: string;
}

// Sample data
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Software Developer',
    company: 'Tech Solutions',
    location: '110001',
    description: 'We are looking for a skilled software developer to join our team...',
    requirements: ['React', 'Node.js', '3+ years experience', 'Bachelor\'s degree'],
    salary: '₹6,00,000 - ₹10,00,000 per annum',
    jobType: 'Full-time',
    category: 'Information Technology',
    postedDate: new Date(2023, 3, 15),
    employerId: '2', // Employer user id
    status: 'active',
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Brand Builders',
    location: '400001',
    description: 'Seeking a marketing professional to lead our brand strategy...',
    requirements: ['5+ years marketing experience', 'MBA preferred', 'Digital marketing skills'],
    salary: '₹8,00,000 - ₹12,00,000 per annum',
    jobType: 'Full-time',
    category: 'Marketing',
    postedDate: new Date(2023, 3, 10),
    employerId: '2',
    status: 'active',
  },
  {
    id: '3',
    title: 'Customer Service Representative',
    company: 'Support Hub',
    location: '110001',
    description: 'Join our team to provide excellent customer support...',
    requirements: ['Good communication skills', 'Problem-solving ability', 'Customer-oriented'],
    salary: '₹2,50,000 - ₹3,50,000 per annum',
    jobType: 'Part-time',
    category: 'Customer Service',
    postedDate: new Date(2023, 3, 20),
    employerId: '2',
    status: 'active',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Data Insights',
    location: '500001',
    description: 'Looking for a data scientist to analyze large datasets and extract insights...',
    requirements: ['Python', 'Machine Learning', 'Statistics', 'Master\'s degree preferred'],
    salary: '₹10,00,000 - ₹15,00,000 per annum',
    jobType: 'Full-time',
    category: 'Data Science',
    postedDate: new Date(2023, 3, 5),
    employerId: '2',
    status: 'active',
  },
  {
    id: '5',
    title: 'Graphic Designer',
    company: 'Creative Studio',
    location: '700001',
    description: 'Join our creative team to design visual content for our clients...',
    requirements: ['Adobe Creative Suite', 'Portfolio', '2+ years experience'],
    salary: '₹4,00,000 - ₹7,00,000 per annum',
    jobType: 'Contract',
    category: 'Design',
    postedDate: new Date(2023, 3, 12),
    employerId: '2',
    status: 'active',
  },
];

const sampleApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    seekerId: '1',
    status: 'applied',
    appliedDate: new Date(2023, 3, 16),
    coverLetter: 'I am excited to apply for this position...',
  },
  {
    id: '2',
    jobId: '3',
    seekerId: '1',
    status: 'under_review',
    appliedDate: new Date(2023, 3, 21),
    coverLetter: 'I believe my skills in customer service make me a perfect fit...',
  },
];

// Create context
const JobsContext = createContext<JobsContextType | null>(null);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [applications, setApplications] = useState<JobApplication[]>(sampleApplications);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all jobs with optional filters
  const fetchJobs = async (filters?: JobFilters) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredJobs = [...sampleJobs];
      
      if (filters) {
        if (filters.location) {
          filteredJobs = filteredJobs.filter(job => job.location === filters.location);
        }
        
        if (filters.category) {
          filteredJobs = filteredJobs.filter(job => job.category === filters.category);
        }
        
        if (filters.jobType) {
          filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(searchLower) || 
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
          );
        }
      }
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific job by ID
  const fetchJobById = async (id: string): Promise<Job | undefined> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = jobs.find(job => job.id === id);
      return job;
    } catch (error) {
      console.error('Error fetching job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch job details. Please try again.",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new job
  const createJob = async (jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'status'>): Promise<string> => {
    if (!user || user.role !== 'employer') {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only employers can create job listings.",
      });
      return '';
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob: Job = {
        ...jobData,
        id: `${jobs.length + 1}`,
        postedDate: new Date(),
        employerId: user.id,
        status: 'active',
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      
      toast({
        title: "Success",
        description: "Job listing created successfully.",
      });
      
      return newJob.id;
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job listing. Please try again.",
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing job
  const updateJob = async (id: string, jobData: Partial<Job>): Promise<boolean> => {
    if (!user || user.role !== 'employer') {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only employers can update job listings.",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === id ? { ...job, ...jobData } : job
        )
      );
      
      toast({
        title: "Success",
        description: "Job listing updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update job listing. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a job
  const deleteJob = async (id: string): Promise<boolean> => {
    if (!user || user.role !== 'employer') {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only employers can delete job listings.",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      
      toast({
        title: "Success",
        description: "Job listing deleted successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job listing. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Apply to a job
  const applyToJob = async (jobId: string, coverLetter?: string): Promise<boolean> => {
    if (!user || user.role !== 'seeker') {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only job seekers can apply to jobs.",
      });
      return false;
    }
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.seekerId === user.id
    );
    
    if (existingApplication) {
      toast({
        variant: "destructive",
        title: "Already Applied",
        description: "You have already applied to this job.",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApplication: JobApplication = {
        id: `${applications.length + 1}`,
        jobId,
        seekerId: user.id,
        status: 'applied',
        appliedDate: new Date(),
        coverLetter,
      };
      
      setApplications(prevApplications => [...prevApplications, newApplication]);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit application. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get applications for a specific job
  const getJobApplications = (jobId: string): JobApplication[] => {
    return applications.filter(app => app.jobId === jobId);
  };

  // Get all applications for the current user
  const getUserApplications = (): JobApplication[] => {
    if (!user) return [];
    
    if (user.role === 'seeker') {
      return applications.filter(app => app.seekerId === user.id);
    }
    
    return [];
  };

  // Get all jobs posted by the current employer
  const getEmployerJobs = (): Job[] => {
    if (!user || user.role !== 'employer') return [];
    return jobs.filter(job => job.employerId === user.id);
  };

  // Update application status (for employers)
  const updateApplicationStatus = async (
    applicationId: string, 
    status: JobApplication['status']
  ): Promise<boolean> => {
    if (!user || user.role !== 'employer') {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only employers can update application status.",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast({
        title: "Status Updated",
        description: "Application status updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        applications,
        isLoading,
        fetchJobs,
        fetchJobById,
        createJob,
        updateJob,
        deleteJob,
        applyToJob,
        getJobApplications,
        getUserApplications,
        getEmployerJobs,
        updateApplicationStatus,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
