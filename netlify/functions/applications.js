// applications.js - Serverless function for handling application data

// In-memory storage for applications (for demonstration purposes)
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applications)
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
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(application)
    };
  }
  
  // GET: Retrieve a specific application's resume by ID
  if (event.httpMethod === 'GET' && event.path.match(/\/.netlify\/functions\/applications\/\d+\/resume$/)) {
    const id = parseInt(event.path.split('/').slice(-2, -1)[0]);
    const application = applications.find(app => app.id === id);
    
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
    
    // Return the resume file as base64-encoded data
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': application.resumeFileType || 'application/octet-stream',
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
      
      // Generate a unique ID (in a real app, this would be handled by the database)
      const id = applications.length > 0 
        ? Math.max(...applications.map(app => app.id)) + 1 
        : 1;
      
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
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newApplication)
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
