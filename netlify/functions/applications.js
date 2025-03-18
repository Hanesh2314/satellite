// applications.js - Serverless function for handling application data

// In-memory storage for applications
let applications = [];

exports.handler = async function(event, context) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET: Retrieve all applications
  if (event.httpMethod === 'GET' && event.path === '/.netlify/functions/applications') {
    // Return applications without the resume file content to reduce response size
    const applicationsWithoutResumes = applications.map(app => {
      const { resumeFileContent, ...appWithoutResume } = app;
      return appWithoutResume;
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applicationsWithoutResumes)
    };
  }
  
  // GET: Retrieve a specific application by ID
  if (event.httpMethod === 'GET' && event.path.match(/\/.netlify\/functions\/applications\/\d+$/)) {
    const id = parseInt(event.path.split('/').pop());
    const application = applications.find(app => app.id === id);
    
    if (!application) {
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
      body: JSON.stringify(applicationWithoutResume)
    };
  }
  
  // GET: Retrieve a specific application's resume by ID
  if (event.httpMethod === 'GET' && event.path.match(/\/.netlify\/functions\/applications\/\d+\/resume$/)) {
    const id = parseInt(event.path.split('/').slice(-2, -1)[0]);
    const application = applications.find(app => app.id === id);
    
    // Check if application exists and has resume content
    if (!application || !application.resumeFileContent) {
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
  if (event.httpMethod === 'POST' && event.path === '/.netlify/functions/applications') {
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
        experience: data.experience,
        resumeFileName: data.resumeFileName || null,
        resumeFileContent: data.resumeFileContent || null,
        resumeFileType: data.resumeFileType || null,
        createdAt: new Date().toISOString()
      };
      
      // Add to our in-memory applications array
      applications.push(newApplication);
      
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
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  };
};
