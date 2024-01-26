import {db} from '@/firebase';
import {getAuth} from 'firebase/auth';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {Post, litePost} from './typePost';

// 게시글 목록 불러오기 fetchPosts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const posts: Post[] = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
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
        // TODO: firebase 에서 지원하는 건 displayName 이었던 것으로 기억.
        nickname: data?.nickname || '',
        email: data?.email || '',
        ageGroup: data?.ageGroup || '',
        sexType: data?.sexType || '',
        researchLocation: data?.researchLocation || '',
        researchType: data?.researchType || '',
        researchTime: data?.researchTime || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        deadlineDate: data?.deadlineDate instanceof Timestamp ? data.deadlineDate : data?.deadlineDate || null,

        // TODO: 바뀐 작성 페이지에 들어갈 문항과 문항에 대한 옵션
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
export const updateLikesCount = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentLikes = postSnapshot.data().likes || 0;
      await updateDoc(postRef, {
        likes: currentLikes + 1, // 'likes' 카운트 증가
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
export const updatePost = async (postId: string, updatedPost: Omit<Post, 'id' | 'createdAt'>): Promise<void> => {
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

//LiteSurvey데이터 불러오기
export const getLiteSurveyPosts = async (): Promise<litePost[]> => {
  try {
    const postsQuery = query(collection(db, 'litesurveyposts'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const liteposts: litePost[] = snapshot.docs.map((doc: DocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        counts: data?.counts || 0,
        likes: data?.likes || 0,
        views: data?.views || 0,
        title: data?.title || '',
        contents: data?.contents || '',
        images: data?.images || '',
        createdAt: data?.createdAt?.toDate() || new Date(),
        deadlineDate: data?.deadlineDate instanceof Timestamp ? data.deadlineDate : data?.deadlineDate || null,
        user: {id: '', displayName: '', email: ''},
        nickname: data?.nickname || '',
        userId: data?.userId || '',
      };
    });

    return liteposts;
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// firebase에 데이터 보내기
export const saveDataToFirebase = async (
  title: string,
  contents: string[],
  images: File[],
  userNickname: string,
  userId: string,
) => {
  try {
    const liteSurveyPostsCollection = collection(db, 'litesurveyposts');
    const createdAt = serverTimestamp();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('로그인이 필요한 유저입니다.');
      return;
    }

    // 이미지 업로드하고 다운로드 URL 얻기
    const imageUrls = await Promise.all(
      images.map(async image => {
        return await uploadImageToStorage(image);
      }),
    );

    const counts = contents.map(() => 0);

    // Firestore에 데이터 저장
    const docRef = await addDoc(liteSurveyPostsCollection, {
      title,
      contents,
      images: imageUrls,
      createdAt,
      counts,
      nickname: userNickname,
      userId: user.uid,
    });

    console.log('ID가 포함된 문서 작성 성공: ', docRef.id);

    // TODO: 유저 콜렉션 > 단일 유저 문서 내부 > 서브콜렉션에 문서추가
    const userPostsRef = collection(db, 'users', user.uid, 'userPosts');
    await addDoc(userPostsRef, {
      postId: docRef.id,
      createdAt,
    });
  } catch (error) {
    console.error('문서 추가 중 오류 발생: ', error);
    throw new Error('게시글을 추가하는 것에 실패했습니다.');
  }
};

// litesurvey 닉네임 변경 적용
export const updateNicknameInLite = async (userId: string, newNickName: string) => {
  try {
    const q = query(collection(db, 'litesurveyposts'), where('userId', '==', userId));
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

// litesurvey 게시물 삭제
export const deleteliteSurveyPostById = async (postId: string) => {
  try {
    const postRef = doc(db, 'litesurveyposts', postId);
    await deleteDoc(postRef);

    console.log(`게시물 ${postId} 삭제 완료`);
  } catch (error) {
    console.error(`게시물 삭제 중 오류 발생 ${postId}:`, error);
    throw new Error('게시물 삭제 오류');
  }
};

// litesurvey 게시물 수정
export const updateLiteSurveyPost = async (
  postId: string,
  updatedLitePost: {
    title: string;
    contents: string[];
    images: string[];
    views?: number;
    likes?: number;
    userId?: string;
    nickname?: string;
  },
): Promise<void> => {
  try {
    const postRef = doc(db, 'litesurveyposts', postId);
    await updateDoc(postRef, updatedLitePost);
  } catch (error) {
    console.error('Error updating liteSurvey post: ', error);
    throw new Error('litesurvey 게시글을 수정하는 것에 실패했습니다.');
  }
};

// // TO DO: Nickname을 dispalyName으로 해야하는가? 알아보기
// // 현재 로그인한 사용자 정보 가져오기
// export const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(
//       auth,
//       user => {
//         if (user) {
//           // 사용자가 로그인한 상태
//           resolve(user);
//         } else {
//           // 사용자가 로그인하지 않은 상태
//           resolve(null);
//         }
//       },
//       error => {
//         reject(error);
//       },
//     );
//   });
// };

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
