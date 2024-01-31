import {db} from '@/firebase';
import {collection, doc, getDoc, getDocs, query, where} from 'firebase/firestore';
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

//내가 좋아요한 참여했Surv
export const getLikedPosts = async (userId: string) => {
  const likedPostsQuery = query(collection(db, `users/${userId}/likedPosts`), where('liked', '==', true));
  const querySnapshot = await getDocs(likedPostsQuery);
  const likedPosts = await Promise.all(
    querySnapshot.docs.map(async documentSnapshot => {
      const postId = documentSnapshot.id;
      const postRef = doc(db, 'litesurveyposts', postId); // 'litesurveyposts' 컬렉션을 참조합니다.
      const postSnap = await getDoc(postRef);
      const postData = postSnap.data();

      return {
        id: postId,
        title: postData?.title,
        content: postData?.content,
      };
    }),
  );

  return likedPosts;
};
