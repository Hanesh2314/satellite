import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { departments, getYearDisplayText } from '@/lib/satelliteUtils';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contactInfo: z.string().min(5, { message: 'Please provide valid contact information' }),
  department: z.string(),
  branch: z.string().min(2, { message: 'Branch must be at least 2 characters' }),
  year: z.string(),
  experience: z.string(),
  resumeFileName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationFormPage() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<{ content: string; type: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactInfo: '',
      department: '',
      branch: '',
      year: '',
      experience: '',
      resumeFileName: '',
    },
  });

  // Handle file selection and convert to base64
  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Update form field with file name
    form.setValue('resumeFileName', file.name);
    
    // Read the file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      // Get the base64 string (remove metadata prefix)
      const base64String = e.target?.result?.toString().split(',')[1] || '';
      
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

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Job Application Form</h1>
      <div className="bg-deep-blue border border-satellite-blue p-8 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} className="bg-black bg-opacity-50 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or phone number" {...field} className="bg-black bg-opacity-50 text-white border-gray-700" />
                  </FormControl>
                  <FormDescription className="text-gray-400">We'll use this to contact you about your application.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black bg-opacity-50 text-white border-gray-700">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-deep-blue text-white border-gray-700">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Branch/Major</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science, Mechanical Engineering" {...field} className="bg-black bg-opacity-50 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Year of Study/Graduation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black bg-opacity-50 text-white border-gray-700">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-deep-blue text-white border-gray-700">
                      {["1st", "2nd", "3rd", "4th", "Graduate"].map((year) => (
                        <SelectItem key={year} value={year}>
                          {getYearDisplayText(year)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Relevant Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your relevant experience, projects, or skills"
                      className="min-h-[120px] bg-black bg-opacity-50 text-white border-gray-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeFileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Resume/CV</FormLabel>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="resume"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-white border-gray-400 hover:bg-satellite-blue"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </Button>
                    {field.value && (
                      <span className="text-sm text-white">
                        {field.value}
                      </span>
                    )}
                  </div>
                  <FormDescription className="text-gray-400">Upload your resume in PDF, DOC, or DOCX format.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-satellite-blue hover:bg-stellar-yellow text-white hover:text-deep-blue" 
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
