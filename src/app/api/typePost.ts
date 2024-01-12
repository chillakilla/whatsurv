import {Timestamp} from 'firebase/firestore';

export type Post = {
  id: number;
  likes: number;
  views: number;
  rewards: number;

  title: string;
  content: string;
  imageUrl: string;
  category: string;
  userId: string;
  userNickname: string;
  requirements: string;

  createdAt: Timestamp;
  deadlineDate: Date;
  participationDate: Date;
};
