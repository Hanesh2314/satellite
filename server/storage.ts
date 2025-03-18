import { users, type User, type InsertUser, applications, type Application, type InsertApplication } from "@shared/schema";

// Define the AboutUs type
export interface AboutUs {
  id: string;
  content: string;
  updatedAt: string;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  
  // About Us methods
  getAboutUs(): Promise<AboutUs | undefined>;
  updateAboutUs(content: string): Promise<AboutUs>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private aboutUs: AboutUs | undefined;
  private userCurrentId: number;
  private applicationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.aboutUs = {
      id: "about-us",
      content: "We are a team of passionate scientists, engineers, and space enthusiasts dedicated to advancing satellite technology. Our mission is to design, build, and operate cutting-edge satellite systems that contribute to scientific discovery, Earth observation, and space exploration.",
      updatedAt: new Date().toISOString()
    };
    this.userCurrentId = 1;
    this.applicationCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationCurrentId++;
    const createdAt = new Date().toISOString();
    const application: Application = { 
      ...insertApplication, 
      id, 
      createdAt,
      // Ensure null values instead of undefined for these optional fields
      experience: insertApplication.experience ?? null,
      resumeFileName: insertApplication.resumeFileName ?? null
    };
    this.applications.set(id, application);
    return application;
  }
  
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }
  
  async getApplicationById(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async getAboutUs(): Promise<AboutUs | undefined> {
    return this.aboutUs;
  }
  
  async updateAboutUs(content: string): Promise<AboutUs> {
    if (!this.aboutUs) {
      this.aboutUs = {
        id: "about-us",
        content,
        updatedAt: new Date().toISOString()
      };
    } else {
      this.aboutUs = {
        ...this.aboutUs,
        content,
        updatedAt: new Date().toISOString()
      };
    }
    return this.aboutUs;
  }
}

export const storage = new MemStorage();
