export type Post = {
  likes: number;
  views: number;
  rewards: number;
  counts: number[];

  id: string;
  title: string;
  content: string;
  contents: string[];
  imageUrl: string;
  images: string[];
  category: string;

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  createdAt: Date;
  updatedAt: Date;
  deadlineDate: Date;
};
