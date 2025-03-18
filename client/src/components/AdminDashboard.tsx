import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicantDetailsModal from "@/components/ApplicantDetailsModal";
import AboutUsEditor from "@/components/AboutUsEditor";

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
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching applications...");
        
        // Direct fetch to debug issues
        const response = await fetch('/api/applications');
        console.log("API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Applications data:", data);
        
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to load applications. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={onLogout} variant="ghost">Logout</Button>
      </div>

      <Tabs defaultValue="applicants">
        <TabsList className="mb-4">
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="about">About Us Content</TabsTrigger>
        </TabsList>

        <TabsContent value="applicants">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Applicants</h2>
            
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                <p>{error}</p>
                <Button 
                  className="mt-2" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Debug information:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Check if your Netlify Functions are deployed correctly</li>
                    <li>Verify the API endpoint redirects in netlify.toml</li>
                    <li>Check the browser console for any error messages</li>
                    <li>Review the Netlify Functions logs in the Netlify dashboard</li>
                  </ul>
                </div>
              </div>
            )}
            
            {!isLoading && !error && applications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No applications have been submitted yet.</p>
              </div>
            )}
            
            {!isLoading && !error && applications.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.name}</TableCell>
                      <TableCell>{applicant.department}</TableCell>
                      <TableCell>{applicant.year}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleViewDetails(applicant)} 
                          variant="ghost" 
                          size="sm"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About Us Content</h2>
            <AboutUsEditor isAdmin={true} />
          </div>
        </TabsContent>
      </Tabs>

      {selectedApplicant && (
        <ApplicantDetailsModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
