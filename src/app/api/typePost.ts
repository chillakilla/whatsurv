import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';
import {User} from './typeUser';

export type Post = {
  id: string;
  likes: number;
  views: number;
  rewards: number;

  title: string;
  content: string;
  imageUrl: string;
  category: string;

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  userId: string | undefined;
  email: string | null;
  nickname?: string | undefined;
  createdAt: Timestamp;
  updatedAt: Date;
  deadlineDate: firebase.firestore.Timestamp | null;
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
  deadlineDate: firebase.firestore.Timestamp | null;
  user: User;
};
