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
      const aboutUs = await getAboutUs();
      
      if (!aboutUs) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'About us content not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutUs)
      };
    }
    
    // POST /api/about-us - Update about us content
    if (event.httpMethod === 'POST' && (event.path === '/.netlify/functions/about-us' || event.path === '/api/about-us')) {
      console.log("Received about-us update");
      
      const data = JSON.parse(event.body);
      
      // Basic validation
      if (!data.content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing content field' })
        };
      }
      
      const updatedAboutUs = await updateAboutUs(data.content);
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAboutUs)
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
