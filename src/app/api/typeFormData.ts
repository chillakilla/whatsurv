import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';
import {Question} from './typePost';
import {Post} from './typePost';

export type FormData = Omit<Post, 'views' | 'userId' | 'updatedAt' | 'email'> & {
  id: string;

  title: string;
  content: string;
  category: string;

  sexType: string;
  ageGroup: string;
  researchType: string;
  researchLocation: string;
  researchTime: string;

  email: string | null;
  nickname: string | null;
  createdAt: Timestamp;
  deadline?: string;

  surveyData: Question[];

  views: number;
  userId: string | undefined;
  updatedAt: Timestamp;
};
