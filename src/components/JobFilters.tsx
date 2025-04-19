
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JobFilters as FiltersType } from '@/contexts/JobsContext';

interface JobFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
  isLoading: boolean;
}

// Predefined filter options
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

const locations = [
  '110001', // Delhi
  '400001', // Mumbai
  '560001', // Bangalore
  '600001', // Chennai
  '700001', // Kolkata
  '500001', // Hyderabad
];

const JobFilters = ({ onFilterChange, isLoading }: JobFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FiltersType>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    location: searchParams.get('location') || '',
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  
  // Handle filter selection
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      if (prev[filterType as keyof FiltersType] === value) {
        // Deselect if already selected
        return { ...prev, [filterType]: '' };
      } else {
        // Select new value
        return { ...prev, [filterType]: value };
      }
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.location) params.set('location', filters.location);
    setSearchParams(params);
    
    // Trigger filter change
    onFilterChange(filters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      jobType: '',
      location: '',
    });
    setSearchParams({});
    onFilterChange({});
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for jobs, skills, or companies"
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-rozgar-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your job search results
                </SheetDescription>
              </SheetHeader>
              
              {/* Categories */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Job Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.category === category}
                        onCheckedChange={() => handleFilterChange('category', category)}
                      />
                      <Label htmlFor={`category-${category}`} className="ml-2 cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Job Types */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Job Type</h3>
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.jobType === type}
                        onCheckedChange={() => handleFilterChange('jobType', type)}
                      />
                      <Label htmlFor={`type-${type}`} className="ml-2 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Locations */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="space-y-2">
                  {locations.map(location => (
                    <div key={location} className="flex items-center">
                      <Checkbox
                        id={`location-${location}`}
                        checked={filters.location === location}
                        onCheckedChange={() => handleFilterChange('location', location)}
                      />
                      <Label htmlFor={`location-${location}`} className="ml-2 cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex mt-8 space-x-2">
                <Button onClick={applyFilters} disabled={isLoading} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear All
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap gap-4">
            {/* Categories Dropdown */}
            <div className="relative group">
              <Button variant="outline" size="sm">
                Category {filters.category && `• ${filters.category.split(' ')[0]}...`}
              </Button>
              <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md p-4 w-64 z-10 hidden group-hover:block">
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`desktop-category-${category}`}
                        checked={filters.category === category}
                        onCheckedChange={() => handleFilterChange('category', category)}
                      />
                      <Label htmlFor={`desktop-category-${category}`} className="ml-2 cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Job Types Dropdown */}
            <div className="relative group">
              <Button variant="outline" size="sm">
                Job Type {filters.jobType && `• ${filters.jobType}`}
              </Button>
              <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md p-4 w-64 z-10 hidden group-hover:block">
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={`desktop-type-${type}`}
                        checked={filters.jobType === type}
                        onCheckedChange={() => handleFilterChange('jobType', type)}
                      />
                      <Label htmlFor={`desktop-type-${type}`} className="ml-2 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Locations Dropdown */}
            <div className="relative group">
              <Button variant="outline" size="sm">
                Location {filters.location && `• ${filters.location}`}
              </Button>
              <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md p-4 w-64 z-10 hidden group-hover:block">
                <div className="space-y-2">
                  {locations.map(location => (
                    <div key={location} className="flex items-center">
                      <Checkbox
                        id={`desktop-location-${location}`}
                        checked={filters.location === location}
                        onCheckedChange={() => handleFilterChange('location', location)}
                      />
                      <Label htmlFor={`desktop-location-${location}`} className="ml-2 cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Filters Pills */}
          <div className="flex flex-wrap gap-2 ml-2">
            {filters.category && (
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                {filters.category}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => handleFilterChange('category', '')}
                />
              </Badge>
            )}
            {filters.jobType && (
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                {filters.jobType}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => handleFilterChange('jobType', '')}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                {filters.location}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => handleFilterChange('location', '')}
                />
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={applyFilters} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
