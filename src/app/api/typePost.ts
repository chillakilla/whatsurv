import firebase from 'firebase/compat/app';
import {User} from './typeUser';

export type Post = {
  likes: number;
  views: number;
  rewards: number;

  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  createdAt: firebase.firestore.Timestamp;
  updatedAt: Date;
  deadlineDate: Date | null;
};

export type litePost = {
  counts: number[];
  likes: number;
  views: number;

  id: string;
  title: string;
  contents: string[];
  images: string[];
  createdAt: Date;
  deadlineDate: Date;
  displayName: string;
  user: User;
};
