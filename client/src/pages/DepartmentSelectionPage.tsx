import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import InteractiveSatellite from "@/components/InteractiveSatellite";
import { departments } from "@/lib/satelliteUtils";
import { getDepartmentDetails } from "@/lib/departmentDetails";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DepartmentSelectionPage = () => {
  const [, navigate] = useLocation();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleSelectDepartment = useCallback((departmentId: string, departmentName: string) => {
    setSelectedDepartment(departmentId);
    setShowDetailsDialog(true);
  }, []);

  const handleApplyNow = useCallback(() => {
    if (selectedDepartment) {
      navigate(`/apply/${selectedDepartment}`);
    }
    setShowDetailsDialog(false);
  }, [navigate, selectedDepartment]);

  const departmentDetails = selectedDepartment ? getDepartmentDetails(selectedDepartment) : null;
  const selectedDeptInfo = selectedDepartment ? departments.find(d => d.id === selectedDepartment) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-12 page-transition active">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-bold text-star-white mb-4">
          Choose Your Department
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Select a satellite subsystem that matches your expertise
        </p>
      </div>

      <div className="relative w-full max-w-3xl aspect-square mb-8">
        <InteractiveSatellite onSelectDepartment={handleSelectDepartment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="department-item bg-deep-blue bg-opacity-50 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-satellite-blue border-opacity-30 hover:border-opacity-100 transition-all cursor-pointer"
            onClick={() => handleSelectDepartment(dept.id, dept.name)}
          >
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 rounded-full ${dept.color} flex items-center justify-center mr-3`}>
                <i className={`fas fa-${dept.icon} text-star-white`}></i>
              </div>
              <h3 className="text-xl font-bold">{dept.name}</h3>
            </div>
            <p className="text-gray-300">{dept.description}</p>
          </div>
        ))}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-deep-blue bg-opacity-90 p-8 rounded-xl max-w-2xl border border-satellite-blue text-white">
          <DialogTitle className="text-2xl font-bold text-stellar-yellow">
            {departmentDetails?.title || (selectedDeptInfo?.name || "")}
          </DialogTitle>
          
          <DialogDescription className="text-white">
            {departmentDetails ? (
              <div className="mt-4 space-y-4">
                <div className="text-star-white whitespace-pre-line">
                  {departmentDetails.description}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-stellar-yellow mb-2">
                    Skills & Knowledge Needed:
                  </h4>
                  <ul className="list-none space-y-2">
                    {departmentDetails.skills.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-satellite-blue mr-2">✔️</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleApplyNow}
                      className="bg-stellar-yellow text-deep-blue hover:bg-yellow-400 rounded-full px-6 py-2 font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Apply Now
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setShowDetailsDialog(false);
                        navigate(`/department/${selectedDepartment}`);
                      }}
                      className="bg-satellite-blue text-white hover:bg-satellite-blue/80 rounded-full px-6 py-2 font-bold text-lg transition-all"
                    >
                      Learn More
                    </Button>
                  </div>
                  
                  <DialogClose asChild>
                    <Button 
                      className="bg-transparent hover:bg-space-black border border-satellite-blue text-satellite-blue hover:text-white rounded-full px-4 py-2"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </div>
            ) : (
              <p>Department details not available</p>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentSelectionPage;
