
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, MapPin, Users, Clock } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
  };
  
  const featuredCategories = [
    { name: 'Information Technology', icon: <Briefcase className="h-10 w-10 text-rozgar-primary" /> },
    { name: 'Healthcare', icon: <Users className="h-10 w-10 text-rozgar-primary" /> },
    { name: 'Engineering', icon: <Briefcase className="h-10 w-10 text-rozgar-primary" /> },
    { name: 'Marketing', icon: <Users className="h-10 w-10 text-rozgar-primary" /> },
  ];
  
  const featuredLocations = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'
  ];
  
  const testimonials = [
    {
      text: "Rozgar Sankalp helped me find a job in my city quickly. The application process was smooth and I received multiple interview calls.",
      author: "Rahul S., Software Developer",
    },
    {
      text: "As an employer, finding qualified local candidates was always a challenge. This platform has simplified my recruitment process significantly.",
      author: "Priya M., HR Manager",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rozgar-primary to-rozgar-secondary text-white py-20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-opacity-80 bg-pattern"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Find Your Dream Job Near You
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Connect with employers in your locality and discover opportunities that match your skills and aspirations.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Job title, keywords, or company"
                className="pl-10 h-12 bg-white text-gray-900 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-rozgar-accent hover:bg-orange-600">
              Search
            </Button>
          </form>
          
          <div className="mt-8 text-sm">
            <p>Popular searches: Software Developer, Marketing, Sales, Customer Service</p>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore opportunities across various industries and find your perfect career match
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer"
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
            >
              <div className="flex justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-2">Explore jobs</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')}
            className="mt-4"
          >
            View All Categories
          </Button>
        </div>
      </section>
      
      {/* Locations Section */}
      <section className="py-10 bg-gray-50 rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Popular Locations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find opportunities in your city or explore jobs across India
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {featuredLocations.map((location, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow p-4 text-center cursor-pointer flex flex-col items-center"
              onClick={() => navigate(`/jobs?location=${encodeURIComponent(location)}`)}
            >
              <MapPin className="h-5 w-5 text-rozgar-primary mb-2" />
              <span className="text-gray-800">{location}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')}
            className="mt-4"
          >
            View All Locations
          </Button>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">How Rozgar Sankalp Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect job seekers with local employers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-rozgar-primary rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
            <p className="text-gray-600">
              Sign up as a job seeker or employer to get started with Rozgar Sankalp
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-rozgar-primary rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Specify Your Location</h3>
            <p className="text-gray-600">
              Enter your PIN code to find nearby opportunities or talent
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-rozgar-primary rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Apply or Post Jobs</h3>
            <p className="text-gray-600">
              Apply to jobs as a seeker or post job listings as an employer
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-10 bg-gray-50 rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from people who have found success with Rozgar Sankalp
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 text-rozgar-primary">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-4">{testimonial.text}</p>
              <p className="font-semibold text-sm">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-rozgar-primary text-white rounded-lg py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Whether you're looking for your next career opportunity or searching for talent, Rozgar Sankalp is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/register')}
            className="bg-white text-rozgar-primary hover:bg-gray-100"
            size="lg"
          >
            Create an Account
          </Button>
          <Button
            onClick={() => navigate('/jobs')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-rozgar-primary"
            size="lg"
          >
            Browse Jobs
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
