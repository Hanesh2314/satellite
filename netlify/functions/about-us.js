// about-us.js - Serverless function for handling about-us content

// In-memory storage for about-us content (for demonstration purposes)
let aboutUsContent = {
  id: "about-us",
  content: "SpaceTechHub is a cutting-edge space technology innovation hub dedicated to pushing the boundaries of space exploration and technology. Our mission is to develop innovative solutions for space exploration, satellite technology, and planetary science.",
  updatedAt: new Date().toISOString()
};

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

  // GET: Retrieve about-us content
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(aboutUsContent)
    };
  }
  
  // POST: Update about-us content
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      if (!data.content || typeof data.content !== 'string') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Content is required and must be a string' })
        };
      }
      
      // Update the about-us content
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
      console.error('Error updating about-us content:', error);
      
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
