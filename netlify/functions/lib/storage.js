// Serverless storage implementation for Netlify Functions using Netlify KV Store
const { getStore } = require('@netlify/blobs');

// Fallback in-memory storage for local development
let memoryApplications = [];
let memoryAboutUs = {
  id: "about-us",
  content: "Welcome to SpaceTechHub, a center for space technology innovation.",
  updatedAt: new Date().toISOString()
};
let applicationCounter = 1;

// Helper function to determine if we're in Netlify environment
function isNetlifyEnvironment() {
  return !!process.env.NETLIFY;
}

/**
 * Get all applications
 */
async function getApplications() {
  try {
    if (isNetlifyEnvironment()) {
      console.log("Getting applications from Netlify KV Store");
      const store = getStore('applications');
      const data = await store.get('all-applications');
      return data ? JSON.parse(data) : [];
    } else {
      console.log("Getting applications from memory storage");
      return memoryApplications;
    }
  } catch (error) {
    console.error('Error getting applications:', error);
    return [];
  }
}

/**
 * Get application by ID
 */
async function getApplicationById(id) {
  try {
    const applications = await getApplications();
    return applications.find(app => app.id === parseInt(id));
  } catch (error) {
    console.error(`Error getting application ${id}:`, error);
    return null;
  }
}

/**
 * Create a new application
 */
async function createApplication(application) {
  try {
    const applications = await getApplications();
    
    // Generate new ID
    const newId = applications.length > 0 
      ? Math.max(...applications.map(app => app.id)) + 1 
      : 1;
    
    // Create new application with generated ID
    const newApplication = {
      ...application,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    // Add to the list of applications
    const updatedApplications = [...applications, newApplication];
    
    if (isNetlifyEnvironment()) {
      console.log("Storing application in Netlify KV Store");
      const store = getStore('applications');
      await store.set('all-applications', JSON.stringify(updatedApplications));
    } else {
      console.log("Storing application in memory storage");
      memoryApplications = updatedApplications;
    }
    
    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw new Error('Failed to create application');
  }
}

/**
 * Get About Us content
 */
async function getAboutUs() {
  try {
    if (isNetlifyEnvironment()) {
      console.log("Getting about-us from Netlify KV Store");
      const store = getStore('content');
      const data = await store.get('about-us');
      return data ? JSON.parse(data) : memoryAboutUs;
    } else {
      console.log("Getting about-us from memory storage");
      return memoryAboutUs;
    }
  } catch (error) {
    console.error('Error getting about us:', error);
    return memoryAboutUs;
  }
}

/**
 * Update About Us content
 */
async function updateAboutUs(content) {
  try {
    const updatedAboutUs = {
      id: "about-us",
      content: content,
      updatedAt: new Date().toISOString()
    };
    
    if (isNetlifyEnvironment()) {
      console.log("Storing about-us in Netlify KV Store");
      const store = getStore('content');
      await store.set('about-us', JSON.stringify(updatedAboutUs));
    } else {
      console.log("Storing about-us in memory storage");
      memoryAboutUs = updatedAboutUs;
    }
    
    return updatedAboutUs;
  } catch (error) {
    console.error('Error updating about us:', error);
    throw new Error('Failed to update about us content');
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  getAboutUs,
  updateAboutUs
};
