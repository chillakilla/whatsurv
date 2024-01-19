import firebase from 'firebase/compat/app';
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

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  // createdAt: Date,
  createdAt: firebase.firestore.Timestamp;
  updatedAt: Date;
  deadlineDate: Date | null;
};

export type litePost = {
  counts: number[];

  id: string;
  title: string;
  contents: string[];
  images: string[];
  createdAt: Date;
};
