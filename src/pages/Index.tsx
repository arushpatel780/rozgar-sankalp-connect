
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rozgar-primary to-rozgar-secondary py-20 px-6 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rozgar Sankalp Connect
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Bridging the gap between job seekers and employers across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/register')}
              className="bg-white text-rozgar-primary hover:bg-gray-100 text-lg px-6 py-6 h-auto"
              size="lg"
            >
              Register Now
            </Button>
            <Button 
              onClick={() => navigate('/jobs')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-rozgar-primary text-lg px-6 py-6 h-auto"
              size="lg"
            >
              Browse Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-rozgar-primary rounded-full p-4 mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location-Based Jobs</h3>
              <p className="text-gray-600">
                Find jobs near you with our location-based search. No more commuting long distances.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-rozgar-primary rounded-full p-4 mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Applications</h3>
              <p className="text-gray-600">
                Simple and straightforward application process for job seekers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-rozgar-primary rounded-full p-4 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Employer Dashboard</h3>
              <p className="text-gray-600">
                Powerful tools for employers to post jobs and manage applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers and employers on Rozgar Sankalp Connect today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/login')}
              className="text-lg px-6 py-6 h-auto"
              size="lg"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              variant="outline"
              className="text-lg px-6 py-6 h-auto"
              size="lg"
            >
              Create an Account
            </Button>
          </div>
        </div>
      </section>

      {/* Role-Based Access Banner */}
      <section className="py-10 px-6 bg-rozgar-primary text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">For Job Seekers</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find jobs near your location
                </li>
                <li className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Apply with just a few clicks
                </li>
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Track your application status
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/register')}
                className="mt-6 bg-white text-rozgar-primary hover:bg-gray-100"
              >
                Find a Job
              </Button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">For Employers</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Post job listings easily
                </li>
                <li className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Manage applications efficiently
                </li>
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Find local talent quickly
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/register')}
                className="mt-6 bg-white text-rozgar-primary hover:bg-gray-100"
              >
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
