import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';

export type FormData = {
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

  email?: string | null;
  nickname?: string | null;
  createdAt: Timestamp;
  deadlineDate: firebase.firestore.Timestamp | null;
};
