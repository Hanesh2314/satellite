// PostgreSQL storage implementation for Netlify Functions
const { Pool } = require('pg');

// Create pool connection to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Get all applications
 */
async function getApplications() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM applications ORDER BY created_at DESC'
      );
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        contactInfo: row.contact_info,
        department: row.department,
        branch: row.branch,
        year: row.year,
        experience: row.experience,
        resumeFileName: row.resume_file_name,
        createdAt: row.created_at
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting applications from PostgreSQL:', error);
    return [];
  }
}

/**
 * Get application by ID
 */
async function getApplicationById(id) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM applications WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        contactInfo: row.contact_info,
        department: row.department,
        branch: row.branch,
        year: row.year,
        experience: row.experience,
        resumeFileName: row.resume_file_name,
        createdAt: row.created_at
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Error getting application ${id} from PostgreSQL:`, error);
    return null;
  }
}

/**
 * Create a new application
 */
async function createApplication(application) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO applications 
          (name, contact_info, department, branch, year, experience, resume_file_name) 
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          application.name,
          application.contactInfo,
          application.department,
          application.branch,
          application.year,
          application.experience || '',
          application.resumeFileName || ''
        ]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        contactInfo: row.contact_info,
        department: row.department,
        branch: row.branch,
        year: row.year,
        experience: row.experience,
        resumeFileName: row.resume_file_name,
        createdAt: row.created_at
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating application in PostgreSQL:', error);
    throw new Error('Failed to create application: ' + error.message);
  }
}

/**
 * Get About Us content
 */
async function getAboutUs() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM about_us WHERE id = 'about-us'"
      );
      
      if (result.rows.length === 0) {
        // Create default about us content if it doesn't exist
        return createDefaultAboutUs();
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        content: row.content,
        updatedAt: row.updated_at
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error getting about us from PostgreSQL:', error);
    return null;
  }
}

/**
 * Create default About Us content
 */
async function createDefaultAboutUs() {
  try {
    const client = await pool.connect();
    try {
      const content = 'Welcome to SpaceTechHub, a center for space technology innovation and research.';
      const result = await client.query(
        `INSERT INTO about_us (id, content) 
         VALUES ('about-us', $1) 
         RETURNING *`,
        [content]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        content: row.content,
        updatedAt: row.updated_at
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating default about us in PostgreSQL:', error);
    return {
      id: 'about-us',
      content: 'Welcome to SpaceTechHub.',
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Update About Us content
 */
async function updateAboutUs(content) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE about_us 
         SET content = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = 'about-us' 
         RETURNING *`,
        [content]
      );
      
      if (result.rows.length === 0) {
        // If no rows were updated, insert new about us content
        return createDefaultAboutUs();
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        content: row.content,
        updatedAt: row.updated_at
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating about us in PostgreSQL:', error);
    throw new Error('Failed to update about us content: ' + error.message);
  }
}

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  getAboutUs,
  updateAboutUs
};
