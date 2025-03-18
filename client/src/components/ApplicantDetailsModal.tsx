import { getYearDisplayText } from "@/lib/satelliteUtils";
import { useToast } from "@/hooks/use-toast";

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

interface ApplicantDetailsModalProps {
  applicant: Applicant;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicantDetailsModal = ({ 
  applicant, 
  isOpen, 
  onClose 
}: ApplicantDetailsModalProps) => {
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
    }
  };
  
  const handleViewResume = async (applicantId: number) => {
    try {
      // First check if the resume exists
      const checkResponse = await fetch(`/api/applications/${applicantId}`);
      if (!checkResponse.ok) {
        throw new Error('Failed to retrieve application details');
      }
      const appData = await checkResponse.json();
      
      if (!appData.resumeFileName) {
        toast({
          title: 'No Resume',
          description: 'This applicant did not upload a resume.',
          variant: 'destructive'
        });
        return;
      }
      
      // Open the resume in a new tab/window
      window.open(`/api/applications/${applicantId}/resume`, '_blank');
      
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast({
        title: 'Error',
        description: 'Unable to retrieve the resume file.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div 
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-deep-blue bg-opacity-90 p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-filter backdrop-blur-lg border border-satellite-blue">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-star-white">Applicant Details</h3>
          <button 
            className="text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-gray-300">Name</h4>
            <p className="text-xl text-star-white">{applicant.name}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Contact Information</h4>
            <p className="text-xl text-star-white">{applicant.contactInfo}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Department</h4>
            <p className="text-xl text-star-white">{applicant.department}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Branch</h4>
            <p className="text-xl text-star-white">{applicant.branch}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Year</h4>
            <p className="text-xl text-star-white">{getYearDisplayText(applicant.year)}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Work Experience</h4>
            <p className="text-xl text-star-white whitespace-pre-line">{applicant.experience || "No experience provided"}</p>
          </div>
          
          {applicant.resumeFileName && (
            <div>
              <h4 className="text-lg font-bold text-gray-300">Resume</h4>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleViewResume(applicant.id)}
                  className="bg-satellite-blue hover:bg-stellar-yellow text-white hover:text-deep-blue font-bold py-2 px-4 rounded transition-colors flex items-center"
                >
                  <i className="fas fa-file-pdf mr-2"></i> View Resume
                </button>
                <span className="text-star-white">({applicant.resumeFileName})</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
