import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ApplicantDetailsModal from "@/components/ApplicantDetailsModal";
import AboutUsEditor from "@/components/AboutUsEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getYearDisplayText } from "@/lib/satelliteUtils";

export interface Applicant {
  id: number;
  name: string;
  contactInfo: string;
  department: string;
  branch: string;
  year: string;
  experience: string;
  resumeFileName: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: applicants = [], isLoading, error } = useQuery<Applicant[]>({
    queryKey: ['/api/applications'],
  });
  
  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };
  
  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-star-white">Admin Dashboard</h2>
        <Button 
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="applicants" className="mb-10">
        <TabsList className="grid w-full grid-cols-2 bg-deep-blue">
          <TabsTrigger value="applicants" className="text-lg">Applicants</TabsTrigger>
          <TabsTrigger value="about" className="text-lg">About Us Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applicants" className="mt-6">
          <div className="bg-deep-blue bg-opacity-70 rounded-xl backdrop-filter backdrop-blur-lg border border-satellite-blue border-opacity-50 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-space-black bg-opacity-70">
                <tr>
                  <th className="px-6 py-4 text-star-white">Name</th>
                  <th className="px-6 py-4 text-star-white">Department</th>
                  <th className="px-6 py-4 text-star-white">Year</th>
                  <th className="px-6 py-4 text-star-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <i className="fas fa-spinner fa-spin text-4xl mb-3 block"></i>
                      Loading applicants...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-red-400">
                      <i className="fas fa-exclamation-circle text-4xl mb-3 block"></i>
                      Error loading applicants
                    </td>
                  </tr>
                ) : applicants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <i className="fas fa-user-astronaut text-4xl mb-3 block"></i>
                      No applicants have joined the team yet.
                    </td>
                  </tr>
                ) : (
                  applicants.map((applicant) => (
                    <tr 
                      key={applicant.id}
                      className="border-t border-satellite-blue border-opacity-30 hover:bg-deep-blue hover:bg-opacity-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-star-white">{applicant.name}</td>
                      <td className="px-6 py-4 text-gray-300">{applicant.department}</td>
                      <td className="px-6 py-4 text-gray-300">{getYearDisplayText(applicant.year)}</td>
                      <td className="px-6 py-4">
                        <button 
                          className="text-satellite-blue hover:text-stellar-yellow transition-colors"
                          onClick={() => handleViewDetails(applicant)}
                        >
                          <i className="fas fa-external-link-alt mr-1"></i> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="about" className="mt-6">
          <div className="bg-deep-blue bg-opacity-70 rounded-xl backdrop-filter backdrop-blur-lg border border-satellite-blue border-opacity-50 p-6">
            <h3 className="text-2xl font-bold text-stellar-yellow mb-4">Edit About Us Content</h3>
            <p className="text-gray-300 mb-6">Update the About Us section that appears on the homepage.</p>
            <AboutUsEditor isAdmin={true} />
          </div>
        </TabsContent>
      </Tabs>
      
      {isModalOpen && selectedApplicant && (
        <ApplicantDetailsModal 
          applicant={selectedApplicant} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
