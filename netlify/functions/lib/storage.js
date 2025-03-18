// Serverless storage implementation for Netlify Functions
// Uses Netlify's Key-Value Store for persistence
// https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/kv-store/

// Import the KV store for Netlify (uncomment when using actual Netlify KV)
// const { getStore } = require('@netlify/blobs');

// In-memory storage for testing/development when not in Netlify environment
let memoryApplications = [];
let memoryAboutUs = {
  id: "about-us",
  content: "Welcome to SpaceTechHub, a center for space technology innovation.",
  updatedAt: new Date().toISOString()
};
let applicationCounter = 1;

/**
 * Get all applications
 */
async function getApplications() {
  try {
    // When using actual Netlify KV store:
    // const store = getStore('applications');
    // return JSON.parse(await store.get('all-applications') || '[]');
    
    return memoryApplications;
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
    const newId = applicationCounter++;
    
    // Create new application with generated ID
    const newApplication = {
      ...application,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    // Add to list
    memoryApplications = [...applications, newApplication];
    
    // When using actual Netlify KV store:
    // const store = getStore('applications');
    // await store.set('all-applications', JSON.stringify(memoryApplications));
    
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
    // When using actual Netlify KV store:
    // const store = getStore('content');
    // return JSON.parse(await store.get('about-us') || 'null');
    
    return memoryAboutUs;
  } catch (error) {
    console.error('Error getting about us:', error);
    return null;
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
    
    // When using actual Netlify KV store:
    // const store = getStore('content');
    // await store.set('about-us', JSON.stringify(updatedAboutUs));
    
    memoryAboutUs = updatedAboutUs;
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
