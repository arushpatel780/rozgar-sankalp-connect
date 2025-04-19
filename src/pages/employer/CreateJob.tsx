
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@/contexts/JobsContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Predefined options for select fields
const categories = [
  'Information Technology',
  'Marketing',
  'Sales',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Customer Service',
  'Design',
  'Data Science',
];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
  'Temporary',
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob, isLoading } = useJobs();
  const { user } = useAuth();
  
  const [jobData, setJobData] = useState({
    title: '',
    company: user?.name || '',
    location: user?.location || '',
    description: '',
    requirements: '',
    salary: '',
    jobType: '',
    category: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setJobData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!jobData.title.trim()) newErrors.title = 'Job title is required';
    if (!jobData.company.trim()) newErrors.company = 'Company name is required';
    if (!jobData.location.trim()) newErrors.location = 'Location is required';
    if (!jobData.description.trim()) newErrors.description = 'Job description is required';
    if (!jobData.requirements.trim()) newErrors.requirements = 'Job requirements are required';
    if (!jobData.salary.trim()) newErrors.salary = 'Salary information is required';
    if (!jobData.jobType) newErrors.jobType = 'Job type is required';
    if (!jobData.category) newErrors.category = 'Job category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Convert requirements string to array
    const requirementsList = jobData.requirements
      .split('\n')
      .filter(item => item.trim().length > 0);
    
    try {
      const jobId = await createJob({
        ...jobData,
        requirements: requirementsList,
      });
      
      if (jobId) {
        navigate('/employer/jobs');
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
          <CardDescription>
            Fill in the details below to create a new job listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-job-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Software Developer"
                  value={jobData.title}
                  onChange={handleInputChange}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Tech Solutions Inc."
                  value={jobData.company}
                  onChange={handleInputChange}
                  className={errors.company ? 'border-destructive' : ''}
                />
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (PIN Code) <span className="text-destructive">*</span></Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. 110001"
                  value={jobData.location}
                  onChange={handleInputChange}
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salary <span className="text-destructive">*</span></Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="e.g. ₹5,00,000 - ₹7,00,000 per annum"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  className={errors.salary ? 'border-destructive' : ''}
                />
                {errors.salary && (
                  <p className="text-sm text-destructive">{errors.salary}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Job Category <span className="text-destructive">*</span></Label>
                <Select
                  value={jobData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger 
                    id="category"
                    className={errors.category ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type <span className="text-destructive">*</span></Label>
                <Select
                  value={jobData.jobType}
                  onValueChange={(value) => handleSelectChange('jobType', value)}
                >
                  <SelectTrigger 
                    id="jobType"
                    className={errors.jobType ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobType && (
                  <p className="text-sm text-destructive">{errors.jobType}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, and what the job entails..."
                value={jobData.description}
                onChange={handleInputChange}
                className={errors.description ? 'border-destructive' : ''}
                rows={6}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements <span className="text-destructive">*</span>
                <span className="text-sm text-muted-foreground ml-2">(One per line)</span>
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List the required skills, education, and experience (one per line)..."
                value={jobData.requirements}
                onChange={handleInputChange}
                className={errors.requirements ? 'border-destructive' : ''}
                rows={4}
              />
              {errors.requirements && (
                <p className="text-sm text-destructive">{errors.requirements}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/employer/jobs')}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="create-job-form"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Job Listing'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateJob;
