import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Rocket, 
  BookOpen, 
  Award, 
  Briefcase,
  CheckCircle
} from "lucide-react";

export interface DepartmentDetailsProps {
  id: string;
  title: string;
  color: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  qualifications: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({
  id,
  title,
  color,
  description,
  responsibilities,
  skills,
  qualifications,
  projects
}) => {
  return (
    <div className="bg-deep-blue bg-opacity-80 p-8 rounded-xl border border-satellite-blue text-white">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stellar-yellow mb-4 flex items-center">
          <span className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
            <Rocket size={24} />
          </span>
          {title}
        </h1>
        <div className="text-lg text-star-white mb-6 whitespace-pre-line">
          {description}
        </div>
      </div>
      
      <Tabs defaultValue="responsibilities" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="responsibilities" className="text-center flex items-center justify-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Responsibilities</span>
            <span className="md:hidden">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-center flex items-center justify-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="qualifications" className="text-center flex items-center justify-center">
            <Award className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Qualifications</span>
            <span className="md:hidden">Requirements</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-center flex items-center justify-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="responsibilities">
          <Card className="bg-space-black border-satellite-blue">
            <CardHeader>
              <CardTitle className="text-stellar-yellow">Responsibilities</CardTitle>
              <CardDescription className="text-gray-300">
                Key duties and responsibilities in this department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex">
                    <span className="text-satellite-blue mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card className="bg-space-black border-satellite-blue">
            <CardHeader>
              <CardTitle className="text-stellar-yellow">Required Skills</CardTitle>
              <CardDescription className="text-gray-300">
                Technical and soft skills needed for success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {skills.map((skill, index) => (
                  <li key={index} className="flex">
                    <span className="text-satellite-blue mr-2">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qualifications">
          <Card className="bg-space-black border-satellite-blue">
            <CardHeader>
              <CardTitle className="text-stellar-yellow">Qualifications</CardTitle>
              <CardDescription className="text-gray-300">
                Educational background and experience requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {qualifications.map((qual, index) => (
                  <li key={index} className="flex">
                    <span className="text-satellite-blue mr-2">•</span>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card className="bg-space-black border-satellite-blue">
            <CardHeader>
              <CardTitle className="text-stellar-yellow">Current Projects</CardTitle>
              <CardDescription className="text-gray-300">
                Active research and development initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                    <p className="text-gray-300">{project.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDetails;