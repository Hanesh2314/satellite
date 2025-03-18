import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getYearDisplayText } from '@/lib/satelliteUtils';
import { useToast } from '@/hooks/use-toast';

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

export function ApplicantDetailsModal({
  applicant,
  isOpen,
  onClose
}: ApplicantDetailsModalProps) {
  const { toast } = useToast();

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

  // If there's no applicant data, don't render
  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{applicant.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-lg font-medium mt-1">
            {applicant.department}
            <Badge variant="outline">{getYearDisplayText(applicant.year)}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Contact Information</h3>
            <p className="text-muted-foreground">{applicant.contactInfo}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-1">Branch/Major</h3>
            <p className="text-muted-foreground">{applicant.branch}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-1">Experience</h3>
            <p className="text-muted-foreground whitespace-pre-line">{applicant.experience}</p>
          </div>
          
          {applicant.resumeFileName && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-1">Resume</h3>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleViewResume(applicant.id)}>View Resume</Button>
                  <p className="text-sm text-muted-foreground">{applicant.resumeFileName}</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApplicantDetailsModal;
