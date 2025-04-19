
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs, JobFilters as FiltersType } from '@/contexts/JobsContext';
import JobFilters from '@/components/JobFilters';
import JobCard from '@/components/JobCard';
import { useAuth } from '@/contexts/AuthContext';

const JobSearch = () => {
  const { user } = useAuth();
  const { jobs, fetchJobs, isLoading } = useJobs();
  const [searchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const initFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    location: searchParams.get('location') || user?.location || '',
  };
  
  useEffect(() => {
    // Fetch jobs with initial filters
    fetchJobs(initFilters);
  }, [fetchJobs]);
  
  const handleFilterChange = (filters: FiltersType) => {
    fetchJobs(filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Find Jobs</h1>
        <p className="text-muted-foreground">
          Browse through job opportunities matching your skills and preferences
        </p>
      </div>
      
      <JobFilters onFilterChange={handleFilterChange} isLoading={isLoading} />
      
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rozgar-primary"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground mb-4">
              Found {jobs.length} job{jobs.length !== 1 && 's'}
              {searchParams.get('search') && ` for "${searchParams.get('search')}"`}
              {searchParams.get('category') && ` in ${searchParams.get('category')}`}
              {searchParams.get('location') && ` near ${searchParams.get('location')}`}
            </div>
            
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
