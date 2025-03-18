// Netlify Function for handling about-us API
const { getAboutUs, updateAboutUs } = require('./lib/storage');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Log request details for debugging
  console.log('About-us function received request:', {
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
    // GET /api/about-us - Return about us content
    if (event.httpMethod === 'GET' && (event.path === '/.netlify/functions/about-us' || event.path === '/api/about-us')) {
      // Return test data for debugging
      const aboutData = {
        id: "about-us",
        content: "Welcome to SpaceTechHub, a center for space technology innovation and research. Our mission is to advance humanity's presence in space through cutting-edge engineering, scientific research, and international collaboration.",
        updatedAt: new Date().toISOString()
      };
      
      console.log("Returning about-us data:", aboutData);
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      };
    }
    
    // POST /api/about-us - Update about us content
    if (event.httpMethod === 'POST' && (event.path === '/.netlify/functions/about-us' || event.path === '/api/about-us')) {
      console.log("Received about-us update:", event.body);
      
      const data = JSON.parse(event.body);
      
      // Basic validation
      if (!data.content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing content field' })
        };
      }
      
      // For debugging, just acknowledge the update
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: "about-us",
          content: data.content,
          updatedAt: new Date().toISOString()
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
    console.error('Error in about-us function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
