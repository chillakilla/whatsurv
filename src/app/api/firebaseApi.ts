import {db} from '@/firebase';
import {getAuth} from 'firebase/auth';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {Post} from './typePost';

// 게시글 목록 불러오기 fetchPosts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const posts: Post[] = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        liked: data?.likes || 0,
        likes: data?.likes || 0,
        counts: data?.counts || 0,
        views: data?.views || 0,
        rewards: data?.rewards || 0,
        title: data?.title || '',
        content: data?.content || '',
        contents: data?.contents || '',
        imageUrl: data?.imageUrl || '',
        images: data?.images || '',
        category: data?.category || '',
        userId: data?.userId || '',
        nickname: data?.nickname || '',
        email: data?.email || '',
        ageGroup: data?.ageGroup || '',
        sexType: data?.sexType || '',
        researchLocation: data?.researchLocation || '',
        researchType: data?.researchType || '',
        researchTime: data?.researchTime || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        deadline: data?.deadline,
        surveyData: data?.questions || [],
      };
    });

    return posts;
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// 단일 게시글 정보 불러오기 fetchPostById
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot: DocumentSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      return postSnapshot.data() as Post;
    } else {
      console.error(`Post with ID ${postId} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error('Failed to fetch post data.');
  }
};

// 게시글 추가하기 addPost
export const addPost = async (newPost: Post): Promise<DocumentReference> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('로그인이 필요한 유저입니다.');
    }

    const createdAt = new Date();
    const docRef = await addDoc(collection(db, 'posts'), {
      ...newPost,
      createdAt,
      views: 0,
      userId: user.uid,
      email: user.email,
      nickname: user.displayName || '',
    });

    // TODO: 유저 콜렉션 > 단일 유저 문서 내부 > 서브콜렉션에 문서추가
    const userPostsRef = collection(db, 'users', user.uid, 'userPosts');
    await addDoc(userPostsRef, {
      postId: docRef.id,
      createdAt,
    });

    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('게시글을 추가하는 것에 실패했습니다.');
  }
};

// 게시글 조회수 증가 (광희님 코드 참고)
export const updateViewsCount = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentViews = postSnapshot.data().views || 0;
      await updateDoc(postRef, {
        views: currentViews + 1, // 'views' 카운트 증가
      });
    } else {
      console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
    }
  } catch (error) {
    console.error('Views 카운트 업데이트 중 오류:', error);
  }
};

// 게시글 좋아요 증가 (광희님 코드 참고)
// TODO: 좋아요 감소 추가,  optimistic update 적용 필요
export const updateLikesCount = async (
  postId: string,
  userId: string,
  itPageLikedPosts: {[postId: string]: boolean},
): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentLikeds = postSnapshot.data().liked || 0;
      const updatedLikeds = itPageLikedPosts[postId] ? currentLikeds - 1 : currentLikeds + 1;
      await updateDoc(postRef, {
        liked: updatedLikeds,
      });
    } else {
      console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
    }
  } catch (error) {
    console.error('Likes 카운트 업데이트 중 오류:', error);
  }
};

// 변경된 닉네임으로 해당 유저가 작성한 문서 검색
// 그 문서들에 변경된 닉네임 업데이트
export const updateNicknameInDocs = async (userId: string, newNickName: string) => {
  try {
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async doc => {
      const docRef = doc.ref;
      await updateDoc(docRef, {nickname: newNickName});
    });

    console.log('변경된 닉네임이 문서에 반영됨');
  } catch (error) {
    console.error('닉네임 업데이트 중 오류', error);
  }
};

// 유저 데이터 get
export const getUserData = async (userId?: string): Promise<UserData | null> => {
  try {
    const usersCollection = collection(db, 'users');

    const userDoc = doc(usersCollection, userId);

    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserData;
    } else {
      console.error('User document does not exist.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// 게시글 수정하기 updatePost
export const updatePost = async (postId: string, updatedPost: Partial<Post>): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, updatedPost);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error('게시글을 수정하는 것에 실패했습니다.');
  }
};

// 게시글 삭제하기 deletePost
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw new Error('게시글을 삭제하는 것에 실패했습니다.');
  }
};

// postId 에 맞는 게시글 삭제하기
export const deletePostById = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    console.log(`Post with ID ${postId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw new Error('Failed to delete post.');
  }
};

// 업로드한 이미지 storage에 저장
export const uploadImageToStorage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
};

// 게시글+사용자(작성자) 정보 불러오기 fetchPostWithUser
//TODO: 유저 정보 불러오는 로직 작성
//TODO: 해당 로직은 미완성.
// export const fetchPostsWithUser = async (): Promise<PostWithUser[]> => {
//   try {
//     const postsQuery = query(collection(db, 'posts'));
//     const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
//     const postsWithUser: PostWithUser[] = [];

//     for (const doc of snapshot.docs) {
//       const postData: Post = { id: doc.id, ...(doc.data() as any) } as Post;
//       const user = await fetchUserById(postData.userId); // Implement fetchUserById

//       if (user) {
//         const postWithUser: PostWithUser = { ...postData, user };
//         postsWithUser.push(postWithUser);
//       }
//     }

//     return postsWithUser;
//   } catch (error) {
//     console.error('에러', error);
//     throw new Error('게시글을 불러오는 것에 실패했습니다.');
//   }
// };

//프로필 페이지의 작성자가 작성한 IT 게시글
export const getUserPostsIT = async (userId: string) => {
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(postsQuery);

  const posts = querySnapshot.docs.map(doc => {
    const docData = doc.data();
    const deadlineDate = docData.deadlineDate ? docData.deadlineDate.toDate() : null;
    console.log(doc);
    console.log(doc.data);
    return {
      id: doc.id,
      title: docData.title,
      content: docData.content,
      deadlineDate: deadlineDate,
    };
  });

  return posts;
};

// 좋아하는 게시물을 유저컬렉션의 likedPosts 서브컬렉션으로 저장하기
export const updateItPageLikedPostsSubcollection = async (userId: string, postId: string, isLiked: boolean) => {
  try {
    const userRef = doc(db, 'users', userId);
    const likedPostsRef = collection(userRef, 'itSurveyLikedPosts'); // likedPosts 서브컬렉션에 대한 참조

    // 사용자가 게시물을 좋아하거나 좋아요를 취소할 때 해당 게시물을 likedPosts 서브컬렉션에 추가 또는 제거
    if (isLiked) {
      await setDoc(doc(likedPostsRef, postId), {liked: true}); // 게시물을 좋아하는 경우
    } else {
      await deleteDoc(doc(likedPostsRef, postId)); // 좋아요를 취소하는 경우
    }
  } catch (error) {
    console.error('좋아하는 게시물 서브컬렉션 업데이트 중 오류:', error);
  }
};
