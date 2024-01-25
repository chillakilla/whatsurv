import {db} from '@/firebase';
import {collection, getDocs, query, where} from 'firebase/firestore';

// getUserLiteSurveyPosts 함수
export const getUserPostLite = async (userId: string) => {
  const postsQuery = query(collection(db, 'litesurveyposts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(postsQuery);
  const posts = querySnapshot.docs.map(doc => {
    const docData = doc.data();
    return {
      id: doc.id,
      title: docData.title,
      content: docData.content,
    };
  });

  return posts;
};

//프로필 페이지의 작성자가 작성한 IT 게시글
export const getUserPostsIT = async (userId: string) => {
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(postsQuery);

  const posts = querySnapshot.docs.map(doc => {
    const docData = doc.data();
    const deadlineDate = docData.deadlineDate ? docData.deadlineDate.toDate() : null;

    return {
      id: doc.id,
      title: docData.title,
      content: docData.content,
      deadlineDate: deadlineDate,
    };
  });

  return posts;
};
