export interface ProjectData {
  img: string;
  year: string;
  col: "col-7" | "col-5" | "col-12";
  repo?: string;
  live?: string;
}

export interface ProjectTranslation {
  name: string;
  tech: string;
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
