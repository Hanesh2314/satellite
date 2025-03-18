// At the top of your file, add these imports
import { useState, useRef } from 'react';

// In your component, add these state variables
const [resumeFile, setResumeFile] = useState<{ content: string; type: string } | null>(null);
const [isUploading, setIsUploading] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

// Replace your file handling function with this:
const handleFileSelect = (file: File) => {
  if (!file) return;
  
  setIsUploading(true);
  
  // Update form field with file name
  form.setValue('resumeFileName', file.name);
  
  // Read the file as base64
  const reader = new FileReader();
  reader.onload = (e) => {
    // Get the base64 string (remove metadata prefix)
    const base64String = e.target.result?.toString().split(',')[1] || '';
    
    // Store the file content and type
    setResumeFile({
      content: base64String,
      type: file.type
    });
    
    setIsUploading(false);
  };
  
  reader.onerror = () => {
    console.error('Error reading file');
    setIsUploading(false);
    toast({
      title: 'Error',
      description: 'Failed to process the resume file',
      variant: 'destructive'
    });
  };
  
  // Read the file as data URL (base64)
  reader.readAsDataURL(file);
};

// Replace your form submission function with this:
const onSubmit = async (data: FormValues) => {
  try {
    setIsSubmitting(true);
    
    // Prepare the application data with file content if available
    const applicationData = {
      ...data,
      resumeFileContent: resumeFile?.content || null,
      resumeFileType: resumeFile?.type || null
    };
    
    // Submit the application
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit application');
    }
    
    const result = await response.json();
    
    toast({
      title: 'Success',
      description: 'Your application has been submitted successfully!'
    });
    
    // Navigate to confirmation page with the application ID
    navigate(`/confirmation/${result.id}`);
  } catch (error) {
    console.error('Error submitting application:', error);
    toast({
      title: 'Error',
      description: 'There was a problem submitting your application',
      variant: 'destructive'
    });
  } finally {
    setIsSubmitting(false);
  }
};
