// Netlify serverless function for applications (Fixed ESM version)

// In-memory storage for applications
const applications = [];

// Define the handler function using named export for ESM compatibility
export const handler = async function(event, context) {
  // Log all incoming requests for debugging
  console.log('Function called with path:', event.path);
  console.log('HTTP method:', event.httpMethod);
  
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Add a test endpoint that always works
  if (event.httpMethod === 'GET' && 
      (event.path === '/.netlify/functions/applications/test' || 
       event.path === '/api/applications/test')) {
    console.log('Test endpoint called');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Applications API is working',
        timestamp: new Date().toISOString(),
        applicationsCount: applications.length
      })
    };
  }

  // GET: Retrieve all applications
  if (event.httpMethod === 'GET' && 
      (event.path === '/.netlify/functions/applications' || 
       event.path === '/api/applications')) {
    console.log('GET all applications, current count:', applications.length);
    
    // Return applications without the resume file content to reduce response size
    const applicationsWithoutResumes = applications.map(app => {
      const { resumeFileContent, ...appWithoutResume } = app;
      return {
        ...appWithoutResume,
        hasResume: !!app.resumeFileContent
      };
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applicationsWithoutResumes)
    };
  }
  
  // GET: Retrieve a specific application by ID
  if (event.httpMethod === 'GET' && 
      (event.path.match(//.netlify/functions/applications/\d+$/) || 
       event.path.match(//api/applications/\d+$/))) {
    
    // Extract ID from path
    const pathParts = event.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    console.log('GET application by ID:', id);
    
    const application = applications.find(app => app.id === id);
    
    if (!application) {
      console.log('Application not found with ID:', id);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Application not found' })
      };
    }
    
    // Return the application without the resume file content to reduce response size
    const { resumeFileContent, ...applicationWithoutResume } = application;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...applicationWithoutResume,
        hasResume: !!application.resumeFileContent
      })
    };
  }
  
  // GET: Retrieve a specific application's resume by ID
  if (event.httpMethod === 'GET' && 
      (event.path.match(//.netlify/functions/applications/\d+/resume$/) || 
       event.path.match(//api/applications/\d+/resume$/))) {
    
    // Extract ID from path
    const pathParts = event.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 2]);
    
    console.log('GET resume for application ID:', id);
    
    const application = applications.find(app => app.id === id);
    
    // Check if application exists and has resume content
    if (!application || !application.resumeFileContent) {
      console.log('Resume not found for application ID:', id);
      return {
        statusCode: 404,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Resume not found' })
      };
    }
    
    console.log('Serving resume for application:', id);
    console.log('Resume file name:', application.resumeFileName);
    console.log('Resume file type:', application.resumeFileType);
    
    // Return the resume file as base64-encoded data
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': application.resumeFileType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${application.resumeFileName}"`
      },
      body: application.resumeFileContent,
      isBase64Encoded: true
    };
  }
  
  // POST: Create a new application
  if (event.httpMethod === 'POST' && 
      (event.path === '/.netlify/functions/applications' || 
       event.path === '/api/applications')) {
    
    console.log('POST new application');
    
    try {
      const data = JSON.parse(event.body);
      
      // Generate a unique ID
      const id = applications.length > 0 
        ? Math.max(...applications.map(app => app.id)) + 1 
        : 1;
      
      // Log the resume file info for debugging
      if (data.resumeFileName) {
        console.log('Resume file received:', data.resumeFileName);
        console.log('Resume file type:', data.resumeFileType);
        console.log('Resume content length:', data.resumeFileContent?.length || 0);
      }
      
      // Create the new application with current timestamp
      const newApplication = {
        id,
        name: data.name,
        contactInfo: data.contactInfo || '',
        department: data.department,
        branch: data.branch,
        year: data.year,
        experience: data.experience || '',
        resumeFileName: data.resumeFileName || null,
        resumeFileContent: data.resumeFileContent || null,
        resumeFileType: data.resumeFileType || null,
        createdAt: new Date().toISOString()
      };
      
      // Add to our in-memory applications array
      applications.push(newApplication);
      console.log('Application created with ID:', id);
      
      // Return the application without the resumeFileContent to reduce response size
      const { resumeFileContent, ...applicationWithoutResume } = newApplication;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(applicationWithoutResume)
      };
    } catch (error) {
      console.error('Error creating application:', error);
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request data',
          details: error.message
        })
      };
    }
  }
  
  // Fallback for unhandled routes
  console.log('Unhandled route:', event.path);
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ 
      error: 'Not found',
      path: event.path,
      method: event.httpMethod
    })
  };
};
