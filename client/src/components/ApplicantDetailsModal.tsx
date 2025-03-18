// Add this function to view/download resumes
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

// Update your resume button click handler
<Button onClick={() => handleViewResume(applicant.id)}>
  View Resume
</Button>
