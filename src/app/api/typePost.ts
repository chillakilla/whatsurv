import firebase from 'firebase/compat/app';

export type Post = {
  id: string;
  liked: number;
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
  createdAt: Date;
  updatedAt: Date;
  deadline?: string;

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
  userPhotoURL?: string;
};

export type feedBack = {
  feedback: string;
};

export type RenderPostProps = {
  post: Post;
  clickPostHandler: (post: Post) => void;
  clickLikedButtonHandler: (postId: string) => void;
  likedPosts: {[postId: string]: boolean};
};
