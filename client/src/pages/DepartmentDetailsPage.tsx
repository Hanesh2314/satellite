import { useParams, Link, useLocation } from "wouter";
import { getDepartmentDetails } from "@/lib/departmentDetails";
import { getDepartmentById } from "@/lib/satelliteUtils";
import { Button } from "@/components/ui/button";
import DepartmentDetails from "@/components/DepartmentDetails";
import { ArrowLeft } from "lucide-react";

const DepartmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  const departmentDetails = id ? getDepartmentDetails(id) : null;
  const departmentBasic = id ? getDepartmentById(id) : null;
  
  const handleApply = () => {
    if (id) {
      navigate(`/apply/${id}`);
    }
  };
  
  if (!departmentDetails || !departmentBasic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="bg-deep-blue bg-opacity-80 p-8 rounded-xl max-w-lg border border-satellite-blue text-white">
          <h2 className="text-2xl font-bold text-stellar-yellow mb-4">Department Not Found</h2>
          <p className="mb-6">The department you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate("/departments")}
            className="bg-satellite-blue text-white hover:bg-satellite-blue/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen px-4 py-12 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/departments")}
            variant="outline"
            className="mb-6 text-satellite-blue border-satellite-blue hover:bg-satellite-blue hover:text-white transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments
          </Button>
        </div>
        
        <DepartmentDetails 
          id={id}
          title={departmentBasic.name}
          color={departmentBasic.color}
          description={departmentDetails.description}
          responsibilities={departmentDetails.responsibilities}
          skills={departmentDetails.skills}
          qualifications={departmentDetails.qualifications}
          projects={departmentDetails.projects}
        />
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleApply}
            className="bg-stellar-yellow text-deep-blue hover:bg-yellow-400 rounded-full px-8 py-3 font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            size="lg"
          >
            Apply to Join This Department
            <span className="ml-2">🚀</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;