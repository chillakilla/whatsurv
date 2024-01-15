import {Timestamp} from 'firebase/firestore';

export type Post = {
  likes: number;
  views: number;
  rewards: number;

  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  requirements: string;

  createdAt: Date;
  updatedAt: Date;
  deadlineDate: Date;
  participationDate: Date;
};
