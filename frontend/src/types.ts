export interface Section {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface Course {
  id: string;
  title: string;
  url?: string;
  provider?: string;
  chapters: Chapter[];
}
