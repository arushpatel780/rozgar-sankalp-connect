
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Job } from '@/contexts/JobsContext';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  showEmployerActions?: boolean;
  onDelete?: (id: string) => void;
}

const JobCard = ({ 
  job, 
  showApplyButton = true,
  showEmployerActions = false,
  onDelete
}: JobCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
  
  return (
    <div className="job-card animate-fade-in">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-rozgar-primary">
          <Link to={`/jobs/${job.id}`} className="hover:underline">
            {job.title}
          </Link>
        </h3>
        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
          {job.status === 'active' ? 'Active' : 'Closed'}
        </Badge>
      </div>
      
      <p className="font-medium text-gray-700 mt-1">{job.company}</p>
      
      <div className="flex flex-wrap gap-3 mt-3">
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>{job.jobType}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <Badge variant="outline" className="mr-2">{job.category}</Badge>
      </div>
      
      <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
      
      <div className="mt-4 text-gray-800 font-medium">{job.salary}</div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {showApplyButton && job.status === 'active' && (
          <Link to={`/jobs/${job.id}`}>
            <Button>Apply Now</Button>
          </Link>
        )}
        
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        
        {showEmployerActions && (
          <>
            <Link to={`/employer/jobs/${job.id}/applicants`}>
              <Button variant="outline">View Applicants</Button>
            </Link>
            <Link to={`/employer/jobs/edit/${job.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(job.id)}>
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
