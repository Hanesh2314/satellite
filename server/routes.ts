import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Schema for About Us content
const aboutUsSchema = z.object({
  content: z.string().min(1, { message: "Content cannot be empty" })
});

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api
  
  // Get all applications
  app.get("/api/applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  
  // Get application by ID
  app.get("/api/applications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  
  // Create new application
  app.post("/api/applications", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const validatedData = insertApplicationSchema.parse(req.body);
      
      // Create application in storage
      const newApplication = await storage.createApplication(validatedData);
      
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating application:", error);
      
      if (error instanceof ZodError) {
        // Convert Zod error to more readable format
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  
  // Handle application resume download (in a real app, this would serve the file)
  app.get("/api/applications/:id/resume", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // In a real implementation, we would serve the actual file
      // For this demo, we'll just return a placeholder message
      res.send(`This would serve the resume file: ${application.resumeFileName || "No resume uploaded"}`);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Get About Us content
  app.get("/api/about-us", async (req: Request, res: Response) => {
    try {
      const aboutUs = await storage.getAboutUs();
      if (!aboutUs) {
        return res.status(404).json({ message: "About Us content not found" });
      }
      res.json(aboutUs);
    } catch (error) {
      console.error("Error fetching About Us content:", error);
      res.status(500).json({ message: "Failed to fetch About Us content" });
    }
  });

  // Update About Us content
  app.post("/api/about-us", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = aboutUsSchema.parse(req.body);
      
      // Update About Us content
      const updatedAboutUs = await storage.updateAboutUs(validatedData.content);
      
      res.json(updatedAboutUs);
    } catch (error) {
      console.error("Error updating About Us content:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      res.status(500).json({ message: "Failed to update About Us content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
