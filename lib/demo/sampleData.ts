export interface DemoProof {
  id: number;
  title: string;
  documentType: string;
  summary: string;
  owner: string;
  fileHash: string;
  timestamp: number;
  txHash: string;
  isDemo: true;
}

export const DEMO_PROOFS: DemoProof[] = [
  {
    id: 1,
    title: 'Frontend Development Certificate',
    documentType: 'Certificate',
    summary: 'Certificate confirming completion of advanced frontend development course covering React, TypeScript, and modern web technologies.',
    owner: '0x82a1B4c93F2C8D56e91A47f3C1E0b9dF12345678',
    fileHash: '8af31c4e2b5f6a8d9c0e1f3b4a5d6e7f8c9b0a1d2e3f4a5b6c7d8e9f0a1b2c3d',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
    txHash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
    isDemo: true,
  },
  {
    id: 2,
    title: 'E-Commerce React Application',
    documentType: 'Source Code',
    summary: 'Full-stack e-commerce application built with React, Node.js, and Firebase. Features include authentication, cart management, and payment processing.',
    owner: '0x82a1B4c93F2C8D56e91A47f3C1E0b9dF12345678',
    fileHash: '1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 7,
    txHash: '0xdef456abc789012345678901234567890abcdef1234567890abcdef456789012',
    isDemo: true,
  },
  {
    id: 3,
    title: 'Professional Resume - Software Engineer',
    documentType: 'CV / Resume',
    summary: 'Professional CV for a software engineer with 3 years of experience in full-stack development, specializing in React and TypeScript.',
    owner: '0x82a1B4c93F2C8D56e91A47f3C1E0b9dF12345678',
    fileHash: '4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 14,
    txHash: '0x789012345678901234567890abcdef1234567890abcdef1234567890abcdef12',
    isDemo: true,
  },
  {
    id: 4,
    title: 'UI/UX Design Portfolio',
    documentType: 'Portfolio',
    summary: 'Comprehensive design portfolio showcasing mobile app designs, web interfaces, and brand identity projects created over 2 years.',
    owner: '0x82a1B4c93F2C8D56e91A47f3C1E0b9dF12345678',
    fileHash: '7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 21,
    txHash: '0x345678901234567890abcdef1234567890abcdef1234567890abcdef12345678',
    isDemo: true,
  },
];

export const DEMO_CV_DATA = {
  name: 'Alex Johnson',
  title: 'Frontend Developer',
  location: 'San Francisco, CA',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  summary: 'Passionate frontend developer with 3+ years of experience building responsive, accessible web applications. Specialized in React, TypeScript, and modern CSS. Strong focus on performance optimization and user experience.',
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      year: '2020 - 2024',
    },
  ],
  experience: [
    {
      company: 'TechStartup Inc.',
      role: 'Frontend Developer',
      period: 'Jun 2024 - Present',
      description: 'Building and maintaining React applications serving 50K+ users. Implemented component library reducing development time by 40%.',
    },
  ],
  skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Git', 'Firebase'],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce app with React, Firebase Auth, Stripe integration.',
      tech: 'React, Firebase, Stripe',
    },
  ],
};
