import {Timestamp} from 'firebase/firestore';

export type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  likes: number;
  category: string;
  createdAt: Timestamp;
  // userId: string;
};
