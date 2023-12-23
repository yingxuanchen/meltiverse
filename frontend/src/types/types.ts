export interface MaterialSummary {
  id: number;
  postedDate: string;
  author: string;
  title: string;
  url: string;
  topic: string;
  reviewed: boolean;
}

export interface Material extends MaterialSummary {}

export interface TagTimestamp {
  id: number;
  tag: Tag;
  timestamp: number;
  createdBy: number;
}

export interface Tag {
  id: number;
  label: string;
}

export interface MaterialTimestamps {
  material: Material;
  timestamps: number[];
}
