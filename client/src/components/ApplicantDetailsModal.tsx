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
  if (!isOpen) return null;
  
  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
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
            <h4 className="text-lg font-bold text-gray-300">Branch & Department</h4>
            <p className="text-xl text-star-white">{applicant.branch}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Year</h4>
            <p className="text-xl text-star-white">{getYearDisplayText(applicant.year)}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-gray-300">Work Experience</h4>
            <p className="text-xl text-star-white">{applicant.experience || "No experience provided"}</p>
          </div>
          
          {applicant.resumeFileName && (
            <div>
              <h4 className="text-lg font-bold text-gray-300">Resume</h4>
              <a 
                href={`/api/applications/${applicant.id}/resume`} 
                className="text-satellite-blue hover:text-stellar-yellow underline flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-file-pdf mr-2"></i> Download Resume ({applicant.resumeFileName})
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
