// Netlify serverless function for about-us content (Fixed ESM version)

// Default about us content
let aboutUsContent = {
  id: "about-us",
  content: "SpaceTechHub is a cutting-edge aerospace technology company focused on innovation and exploration.",
  updatedAt: new Date().toISOString()
};

// Define the handler function using named export for ESM compatibility
export const handler = async function(event, context) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Test endpoint to check API functionality
  if (event.httpMethod === 'GET' && 
     (event.path === '/.netlify/functions/about-us/test' || 
      event.path === '/api/about-us/test')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'About Us API is working',
        timestamp: new Date().toISOString() 
      })
    };
  }

  // GET About Us content
  if (event.httpMethod === 'GET' && 
     (event.path === '/.netlify/functions/about-us' || 
      event.path === '/api/about-us')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(aboutUsContent)
    };
  }

  // POST Update About Us content
  if (event.httpMethod === 'POST' && 
     (event.path === '/.netlify/functions/about-us' || 
      event.path === '/api/about-us')) {
    try {
      const data = JSON.parse(event.body);
      
      aboutUsContent = {
        id: "about-us",
        content: data.content,
        updatedAt: new Date().toISOString()
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(aboutUsContent)
      };
    } catch (error) {
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
    body: JSON.stringify({ 
      error: 'Not found',
      path: event.path,
      method: event.httpMethod
    })
  };
};
