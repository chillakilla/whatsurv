import {Timestamp} from 'firebase/firestore';
import {Post, Question} from './typePost';

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
  createdAt: Date;
  deadline?: string;

  surveyData: Question[];

  views: number;
  userId: string | undefined;
  updatedAt: Timestamp;
};
