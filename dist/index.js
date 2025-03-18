// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  applications;
  aboutUs;
  userCurrentId;
  applicationCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.applications = /* @__PURE__ */ new Map();
    this.aboutUs = {
      id: "about-us",
      content: "We are a team of passionate scientists, engineers, and space enthusiasts dedicated to advancing satellite technology. Our mission is to design, build, and operate cutting-edge satellite systems that contribute to scientific discovery, Earth observation, and space exploration.",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.userCurrentId = 1;
    this.applicationCurrentId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createApplication(insertApplication) {
    const id = this.applicationCurrentId++;
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const application = {
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
  async getApplications() {
    return Array.from(this.applications.values());
  }
  async getApplicationById(id) {
    return this.applications.get(id);
  }
  async getAboutUs() {
    return this.aboutUs;
  }
  async updateAboutUs(content) {
    if (!this.aboutUs) {
      this.aboutUs = {
        id: "about-us",
        content,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      this.aboutUs = {
        ...this.aboutUs,
        content,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return this.aboutUs;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  department: text("department").notNull(),
  branch: text("branch").notNull(),
  year: text("year").notNull(),
  experience: text("experience"),
  resumeFileName: text("resume_file_name"),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
var aboutUsSchema = z.object({
  content: z.string().min(1, { message: "Content cannot be empty" })
});
async function registerRoutes(app2) {
  app2.get("/api/applications", async (req, res) => {
    try {
      const applications2 = await storage.getApplications();
      res.json(applications2);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.get("/api/applications/:id", async (req, res) => {
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
  app2.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const newApplication = await storage.createApplication(validatedData);
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating application:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          errors: validationError.details
        });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  app2.get("/api/applications/:id/resume", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.send(`This would serve the resume file: ${application.resumeFileName || "No resume uploaded"}`);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });
  app2.get("/api/about-us", async (req, res) => {
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
  app2.post("/api/about-us", async (req, res) => {
    try {
      const validatedData = aboutUsSchema.parse(req.body);
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
