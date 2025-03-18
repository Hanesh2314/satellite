// Department data structure
export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Available departments
export const departments: Department[] = [
  {
    id: "power-system",
    name: "Power System",
    icon: "bolt",
    description: "Manage solar panels and batteries that power the satellite's operations.",
    color: "bg-satellite-blue"
  },
  {
    id: "onboard-computer",
    name: "On-Board Computer",
    icon: "microchip",
    description: "Develop software and hardware for the satellite's central processing unit.",
    color: "bg-cosmic-purple"
  },
  {
    id: "communication-system",
    name: "Communication System",
    icon: "satellite-dish",
    description: "Design antennas and protocols for satellite-to-ground communication.",
    color: "bg-satellite-blue"
  },
  {
    id: "adcs",
    name: "Altitude Determination & Control",
    icon: "compass",
    description: "Maintain the satellite's orientation and position in orbit.",
    color: "bg-cosmic-purple"
  },
  {
    id: "thermal-control",
    name: "Thermal Control System",
    icon: "temperature-high",
    description: "Regulate the satellite's temperature in the extreme conditions of space.",
    color: "bg-satellite-blue"
  }
];

// Get department by ID
export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

// Map numerical year value to display text
export const getYearDisplayText = (year: string): string => {
  const yearMap: Record<string, string> = {
    "1": "First Year",
    "2": "Second Year",
    "3": "Third Year",
    "4": "Fourth Year",
    "graduate": "Graduate"
  };
  
  return yearMap[year] || year;
};
