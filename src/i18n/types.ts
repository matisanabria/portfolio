export interface ProjectData {
  id: string;
  img: string;
  year: string;
  tech: string[];
  repo?: string;
  live?: string;
}

export interface ProjectTranslation {
  id: string;
  name: string;
  type: string;
  desc: string;
}

export type Project = ProjectData & ProjectTranslation;

export interface ExpEntry {
  period: string;
  mode: string;
  role: string;
  company: string;
  location: string;
  desc: string;
  tags: string[];
  active?: boolean;
}
