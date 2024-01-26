import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';

export type Post = {
  id: string;
  likes: boolean;
  views: number;

  title: string;
  content: string;
  category: string;

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  userId: string | undefined;
  email: string | null;
  nickname: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deadlineDate: firebase.firestore.Timestamp | null;

  surveyData: Question[];
};

export type Question = {
  question: string;
  options: string[];
  selectedOption?: string | null;
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
  nickname: string;
  userId: string | undefined;
};

export type feedBack = {
  feedback: string;
};
