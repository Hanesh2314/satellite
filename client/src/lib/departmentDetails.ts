// Department details with detailed information

export interface DepartmentDetail {
  title: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
}

export const departmentDetailsList: Record<string, DepartmentDetail> = {
  "structure": {
    title: "🛠️ 1. Structure (Bus)",
    description: "The Structure team is responsible for designing, analyzing, and fabricating the satellite's mechanical framework. This is the foundation of the satellite that houses and protects all subsystems during launch and while in orbit. The team ensures that the structure can withstand the harsh conditions of space including extreme temperature variations, radiation, and vacuum, as well as the intense vibrations and g-forces during launch.\n\nOur team works closely with all other subsystems to ensure proper integration, thermal management, and mass distribution. We utilize advanced materials and manufacturing techniques to create lightweight yet robust structures that meet stringent space qualification standards.",
    skills: [
      "CAD modeling (SolidWorks, AutoCAD)",
      "Structural analysis (Finite Element Analysis - FEA)",
      "Materials engineering (Aluminum, Carbon Fiber, Titanium)",
      "Understanding CubeSat form factors",
      "3D printing and advanced manufacturing",
      "Vibration analysis and testing"
    ],
    responsibilities: [
      "Design and model satellite structures using CAD software",
      "Perform structural analyses to ensure the satellite can withstand launch and space environments",
      "Fabricate structural components using appropriate materials and methods",
      "Coordinate with other subsystems for proper integration and accommodation",
      "Conduct vibration and thermal testing to validate structural integrity",
      "Document designs, test results, and manufacturing processes"
    ],
    qualifications: [
      "Bachelor's degree in Mechanical Engineering, Aerospace Engineering, or related field",
      "Experience with CAD software and structural analysis tools",
      "Knowledge of materials science and manufacturing processes",
      "Understanding of spacecraft design principles and space environments",
      "Strong problem-solving skills and attention to detail"
    ],
    projects: [
      {
        name: "CubeSat Structure Optimization",
        description: "Developing an ultra-lightweight 3U CubeSat structure that maximizes internal volume while meeting all structural requirements."
      },
      {
        name: "Deployable Solar Panel Mechanism",
        description: "Designing and testing a reliable mechanism for deploying solar panels in orbit with minimal mass and complexity."
      },
      {
        name: "Radiation Shielding Integration",
        description: "Incorporating effective radiation shielding into the satellite structure without significant mass penalties."
      }
    ]
  },
  "power-system": {
    title: "⚡ 2. Power System",
    description: "The Power System team is responsible for designing and implementing all aspects of the satellite's electrical power generation, storage, and distribution systems. We ensure that all subsystems receive the power they need to operate within their specified voltage and current requirements throughout the mission lifecycle.\n\nOur work involves designing solar arrays, selecting and configuring batteries, creating power conditioning circuits, and developing power management software. We must consider various constraints including the harsh space environment, limited mass and volume, and mission profile requirements.",
    skills: [
      "Electrical circuit design & analysis",
      "Solar energy systems & MPPT optimization",
      "Battery technologies & power regulation",
      "Space-grade power distribution systems",
      "Power budgeting and analysis",
      "Radiation-hardened electronics"
    ],
    responsibilities: [
      "Design and analyze solar panel arrays for optimal power generation",
      "Select and configure battery systems for energy storage",
      "Create power conditioning and distribution systems",
      "Develop power management and fault protection algorithms",
      "Conduct power budget analysis for all mission phases",
      "Test and validate power system performance in simulated space environments"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Electrical Engineering or related field",
      "Experience with circuit design and power electronics",
      "Knowledge of solar cell technologies and battery systems",
      "Programming skills for embedded power management systems",
      "Understanding of space environment effects on power systems"
    ],
    projects: [
      {
        name: "High-Efficiency Solar Array",
        description: "Developing a deployable solar array system with improved power-to-mass ratio using triple-junction solar cells."
      },
      {
        name: "Smart Power Distribution Unit",
        description: "Creating an intelligent power management system that dynamically allocates power based on mission priorities and subsystem health."
      },
      {
        name: "Battery Life Extension Research",
        description: "Investigating optimal charge/discharge protocols to maximize battery lifetime in the space environment."
      }
    ]
  },
  "communication-system": {
    title: "📡 3. Communication System",
    description: "The Communication System team is responsible for establishing and maintaining reliable data links between the satellite and ground stations. We design and implement systems that transmit commands to the satellite and download mission data, telemetry, and health information from it.\n\nOur work involves selecting appropriate frequency bands, designing antennas, implementing communication protocols, and ensuring reliable signal processing in challenging space conditions. We must optimize for power efficiency, bandwidth utilization, and error correction while working within regulatory constraints and frequency allocations.",
    skills: [
      "RF communication (UHF, VHF, S-band, X-band)",
      "Antenna design & deployment (monopole, dipole, patch)",
      "Signal modulation & transmission protocols",
      "Handling Doppler shift in space",
      "Software-defined radio (SDR)",
      "Digital signal processing",
      "Error correction coding"
    ],
    responsibilities: [
      "Design and implement satellite communication systems for uplink and downlink",
      "Develop protocols for reliable data transfer and command execution",
      "Analyze link budgets and optimize communication performance",
      "Design and test antenna systems for various mission phases",
      "Implement signal processing algorithms for maximum data throughput",
      "Ensure compliance with frequency regulations and licensing"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Electrical Engineering, Telecommunications, or related field",
      "Experience with RF design and wireless communication systems",
      "Knowledge of digital signal processing and communication protocols",
      "Programming skills for embedded communication systems",
      "Familiarity with software-defined radio and signal analysis tools"
    ],
    projects: [
      {
        name: "High-Speed S-band Transceiver",
        description: "Developing a compact, power-efficient transceiver capable of high data rates for image and science data downlink."
      },
      {
        name: "Deployable Antenna Array",
        description: "Creating a reliable mechanism for deploying high-gain antennas once the satellite reaches orbit."
      },
      {
        name: "Ground Station Network",
        description: "Establishing a distributed network of ground stations to maximize communication windows and data throughput."
      }
    ]
  },
  "onboard-computer": {
    title: "🖥️ 4. Onboard Computer (OBC)",
    description: "The Onboard Computer team develops the central nervous system of the satellite. We design, program, and test the hardware and software that controls all satellite operations, processes commands from Earth, manages data collection, and ensures autonomous operations when the satellite is out of contact with ground stations.\n\nOur work involves selecting appropriate computing hardware, implementing real-time operating systems, developing flight software, and creating fault detection and recovery systems. We focus on reliability and radiation tolerance while operating within the constraints of limited computing resources, power, and thermal management.",
    skills: [
      "Embedded systems (ARM-based processors, FPGA)",
      "Programming (C, Python, Ada)",
      "Real-time operating systems (RTOS)",
      "Space-grade computing & error correction",
      "Flight software architecture",
      "Fault detection, isolation, and recovery (FDIR)",
      "Hardware-in-the-loop testing"
    ],
    responsibilities: [
      "Design and implement the satellite's computing hardware architecture",
      "Develop and test flight software for satellite command and control",
      "Create data handling systems for payload and telemetry information",
      "Implement fault detection and recovery mechanisms",
      "Integrate and coordinate all satellite subsystems",
      "Design and validate autonomous operation modes",
      "Ensure radiation tolerance through hardware and software techniques"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Computer Science, Computer Engineering, or related field",
      "Strong programming skills in C/C++ and embedded systems",
      "Experience with real-time operating systems and embedded hardware",
      "Knowledge of spacecraft systems engineering",
      "Understanding of radiation effects on electronics",
      "Experience with hardware-software integration and testing"
    ],
    projects: [
      {
        name: "Fault-Tolerant Computing Platform",
        description: "Developing a triple-redundant computing system with voting algorithms to ensure reliable operation in the radiation environment of space."
      },
      {
        name: "Autonomous Operations Framework",
        description: "Creating an intelligent system that can autonomously manage satellite operations and science activities when out of ground contact."
      },
      {
        name: "Real-Time Flight Software",
        description: "Implementing a modular, real-time software architecture that efficiently manages all satellite functions while maintaining strict timing requirements."
      }
    ]
  },
  "adcs": {
    title: "🛰️ 5. Attitude Determination & Control System (ADCS)",
    description: "The ADCS team is responsible for accurately determining the satellite's orientation and controlling its position in space. We develop systems that ensure the satellite can point its instruments, antennas, and solar panels precisely where they need to be for optimal mission operations.\n\nOur work involves selecting and integrating attitude sensors, designing control algorithms, and implementing actuators that can adjust the satellite's orientation. We apply principles of orbital mechanics, control theory, and signal processing to create systems that maintain pointing accuracy within fractions of a degree, even under changing environmental conditions.",
    skills: [
      "Orbital mechanics & space physics",
      "Sensor integration (Sun sensors, Star trackers, IMUs)",
      "Control system design (PID, Kalman Filters)",
      "Reaction wheel & magnetorquer implementation",
      "Attitude determination algorithms",
      "Control systems engineering",
      "Spacecraft dynamics and kinematics"
    ],
    responsibilities: [
      "Design attitude determination systems using various sensors",
      "Develop control algorithms for precise satellite pointing",
      "Specify and integrate actuators (reaction wheels, magnetorquers)",
      "Create and validate simulation models for ADCS performance",
      "Design fault-tolerant control systems",
      "Test and calibrate sensors and actuators",
      "Implement power-efficient control strategies"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Aerospace Engineering, Control Systems, or related field",
      "Strong background in control theory and dynamical systems",
      "Experience with sensor integration and signal processing",
      "Programming skills for embedded control systems",
      "Knowledge of orbital mechanics and space environment",
      "Familiarity with simulation tools and MATLAB/Simulink"
    ],
    projects: [
      {
        name: "Precision Pointing Control",
        description: "Developing an advanced control system capable of maintaining sub-arcminute pointing accuracy for high-resolution Earth observation."
      },
      {
        name: "Miniaturized Reaction Wheel Assembly",
        description: "Creating a compact, efficient reaction wheel system for small satellites with optimized momentum storage capacity."
      },
      {
        name: "Multi-Sensor Fusion Algorithm",
        description: "Implementing robust estimation algorithms that combine data from multiple sensors to achieve accurate attitude determination in all orbital conditions."
      }
    ]
  },
  "propulsion": {
    title: "🚀 6. Propulsion System",
    description: "The Propulsion System team designs and develops systems that allow the satellite to change its orbit, maintain its position, and extend its operational lifetime. We work on innovative propulsion solutions that provide the necessary thrust for station-keeping, orbital adjustments, and deorbiting at end-of-life.\n\nOur work involves selecting appropriate propulsion technologies, designing propellant storage and delivery systems, and developing control electronics and software. We balance considerations of performance, reliability, safety, and spacecraft resources including mass, volume, and power constraints.",
    skills: [
      "Propulsion physics (Cold gas, Ion thrusters, Monopropellant)",
      "Fluid dynamics and thermodynamics",
      "Fuel storage & thermal effects in microgravity",
      "Space mission trajectory optimization",
      "Propellant management systems",
      "Microfluidics and valve technology",
      "System integration and testing"
    ],
    responsibilities: [
      "Design and develop satellite propulsion systems",
      "Select and characterize propulsion technologies for specific mission requirements",
      "Create propellant storage, pressurization, and feed systems",
      "Analyze mission requirements and optimize propellant usage",
      "Develop and test thruster control electronics",
      "Conduct performance testing and qualification",
      "Ensure compliance with safety and regulatory requirements"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Aerospace Engineering, Mechanical Engineering, or related field",
      "Knowledge of rocket propulsion fundamentals and space propulsion systems",
      "Experience with fluid systems design and analysis",
      "Understanding of orbital mechanics and mission planning",
      "Familiarity with spacecraft systems engineering",
      "Skills in CFD analysis and thermal modeling"
    ],
    projects: [
      {
        name: "Electric Propulsion System",
        description: "Developing a miniaturized ion thruster system with high specific impulse for small satellite applications."
      },
      {
        name: "Green Propellant Demonstration",
        description: "Testing and qualifying environmentally friendly propellants that offer improved performance and reduced handling hazards."
      },
      {
        name: "Precision Thrust Control",
        description: "Creating a high-precision microvalve system for accurate thrust control in orbital maintenance operations."
      }
    ]
  },
  "payload": {
    title: "🔬 7. Payload (Mission-Specific Instruments)",
    description: "The Payload team designs, develops, and integrates the primary scientific or technological instruments that fulfill the satellite's core mission objectives. Our work represents the primary purpose of the satellite mission, whether it's Earth observation, communications, technology demonstration, or scientific research.\n\nWe develop custom sensors, cameras, and instruments that can operate reliably in the harsh space environment while meeting stringent performance requirements. Our work involves close collaboration with all other subsystem teams to ensure that the payload receives the necessary resources (power, thermal control, data handling, pointing) to achieve mission success.",
    skills: [
      "Payload design (Sensors, Cameras, Science Instruments)",
      "Data acquisition & processing",
      "Radiation shielding & thermal protection",
      "Optical systems design",
      "Signal processing and filtering",
      "Instrument calibration techniques",
      "Space environment effects on instruments"
    ],
    responsibilities: [
      "Design and develop mission-specific scientific instruments",
      "Specify payload requirements and interface definitions",
      "Coordinate with other subsystems for resource allocation",
      "Test and calibrate instruments for space operation",
      "Develop data processing algorithms for payload outputs",
      "Analyze and optimize payload performance",
      "Ensure payload survival in the space environment"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Engineering, Physics, or related technical field",
      "Experience with sensor technologies and instrumentation",
      "Knowledge of signal processing and data analysis",
      "Understanding of space environment effects on instruments",
      "Skills in testing and calibration procedures",
      "Familiarity with systems engineering principles"
    ],
    projects: [
      {
        name: "High-Resolution Earth Imaging System",
        description: "Developing a compact multispectral imaging system capable of sub-meter resolution imagery for Earth observation applications."
      },
      {
        name: "Atmospheric Composition Analyzer",
        description: "Creating a suite of sensors to measure trace gases and particulates in Earth's upper atmosphere for climate research."
      },
      {
        name: "Space Radiation Environment Monitor",
        description: "Building radiation detection instruments to characterize the space radiation environment and its variations over time and location."
      }
    ]
  },
  "thermal-control": {
    title: "🌡️ 8. Thermal Control System",
    description: "The Thermal Control team is responsible for maintaining all satellite components within their optimal temperature ranges throughout the mission lifecycle. We develop systems that protect sensitive electronics and instruments from the extreme temperature swings experienced in the space environment, where direct sunlight can heat surfaces to over 100°C while shadows can cool them below -100°C.\n\nOur work involves thermal modeling, material selection, and designing passive and active thermal control elements. We apply principles of heat transfer, thermodynamics, and materials science to create effective, resource-efficient thermal management solutions for the challenging space environment.",
    skills: [
      "Thermal simulation & analysis",
      "Heat dissipation methods (radiators, heat pipes)",
      "Passive & active thermal regulation techniques",
      "Multi-layer insulation design",
      "Thermal interface materials",
      "Spacecraft thermal modeling",
      "Conduction, radiation, and convection analysis"
    ],
    responsibilities: [
      "Develop thermal control systems for satellite subsystems",
      "Create detailed thermal models and simulations",
      "Specify thermal interface materials and surface coatings",
      "Design radiators, heat pipes, and heater systems",
      "Conduct thermal vacuum testing and verification",
      "Analyze thermal performance across all mission phases",
      "Coordinate thermal requirements with other subsystems"
    ],
    qualifications: [
      "Bachelor's or Master's degree in Mechanical Engineering, Aerospace Engineering, or related field",
      "Experience with thermal analysis and simulation tools",
      "Knowledge of heat transfer principles and spacecraft thermal control",
      "Skills in CAD and thermal modeling software",
      "Understanding of materials properties in space environment",
      "Familiarity with thermal testing methods and procedures"
    ],
    projects: [
      {
        name: "Advanced Multi-Layer Insulation",
        description: "Developing lightweight, high-performance insulation blankets with improved thermal isolation properties."
      },
      {
        name: "Miniaturized Loop Heat Pipe",
        description: "Creating a compact, two-phase heat transfer system for efficient thermal management of high-power components."
      },
      {
        name: "Thermal Control Algorithm",
        description: "Implementing intelligent software that dynamically adjusts heater operations based on orbit conditions and component usage."
      }
    ]
  }
};

export type DepartmentId = keyof typeof departmentDetailsList;

export const getDepartmentDetails = (id: string) => {
  return departmentDetailsList[id as DepartmentId] || null;
};