export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  thumbnail: string;
  live_url: string;
  repo_url: string;
  featured: boolean;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface ExperienceItem {
  role: string;
  period: string;
  location: string;
  description: string;
}
