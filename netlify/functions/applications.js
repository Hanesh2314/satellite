// Netlify Function for handling applications API
const { getApplications, getApplicationById, createApplication } = require('./lib/storage');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Log request details for debugging
  console.log('Applications function received request:', {
    path: event.path,
    httpMethod: event.httpMethod
  });

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // GET /api/applications - Return all applications
    if (event.httpMethod === 'GET' && (event.path === '/.netlify/functions/applications' || event.path === '/api/applications')) {
      // For debugging, return a test response
      const testData = [
        {
          id: 1,
          name: "Test Applicant",
          contactInfo: "test@example.com",
          department: "Engineering",
          branch: "Aerospace",
          year: "3",
          experience: "Sample experience",
          resumeFileName: "resume.pdf"
        }
      ];
      
      console.log("Returning applications data:", testData);
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      };
    }
    
    // GET /api/applications/:id - Return specific application
    if (event.httpMethod === 'GET' && (event.path.match(/\/.netlify\/functions\/applications\/\d+$/) || event.path.match(/\/api\/applications\/\d+$/))) {
      const id = event.path.split('/').pop();
      const application = await getApplicationById(id);
      
      if (!application) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Application not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      };
    }
    
    // POST /api/applications - Create new application
    if (event.httpMethod === 'POST' && (event.path === '/.netlify/functions/applications' || event.path === '/api/applications')) {
      console.log("Received application submission:", event.body);
      
      const data = JSON.parse(event.body);
      
      // Basic validation
      if (!data.name || !data.department) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        };
      }
      
      // For debugging, just acknowledge receipt
      return {
        statusCode: 201,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Math.floor(Math.random() * 1000) + 1,
          ...data,
          createdAt: new Date().toISOString()
        })
      };
    }
    
    // Route not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Error in applications function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
