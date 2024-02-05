import {db} from '@/firebase';
import {DocumentData} from '@firebase/firestore-types';
import {getAuth} from 'firebase/auth';
import {
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {uploadImageToStorage} from './firebaseApi';
import {litePost} from './typePost';

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
        userPhotoURL: data?.userPhotoURL || '',
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
  userPhotoURL: string,
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
      userPhotoURL: userPhotoURL,
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

    //console.log('변경된 닉네임이 문서에 반영됨');
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

// 게시물 조회수
export const updateViewsCount = async (postId: string) => {
  try {
    const postRef = doc(db, 'litesurveyposts', postId);
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

// 좋아요 수 카운트 함수
export const updateLikesCount = async (postId: string, userId: string, likedPosts: {[postId: string]: boolean}) => {
  try {
    const postRef = doc(db, 'litesurveyposts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const currentLikes = postSnapshot.data()?.likes || 0;
      const updatedLikes = likedPosts[postId] ? currentLikes - 1 : currentLikes + 1;

      // 좋아요 수 업데이트
      await updateDoc(postRef, {likes: updatedLikes});
    } else {
      console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
    }
  } catch (error) {
    console.error('좋아요 수 업데이트 중 오류:', error);
  }
};

// 좋아하는 게시물을 유저컬렉션의 likedPosts 서브컬렉션으로 저장하기
export const updateLikedPostsSubcollection = async (userId: string, postId: string, isLiked: boolean) => {
  try {
    const userRef = doc(db, 'users', userId);
    const likedPostsRef = collection(userRef, 'liteSurveyLikedPosts'); // likedPosts 서브컬렉션에 대한 참조

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

// Lite설문조사 작성할때 users 컬렉션의 userPosts 서브컬렉션에도 데이터 삭제하기
export const deleteLiteSurveyPostOfUsers = async (postId: string, userId: any) => {
  try {
    // 사용자의 게시물 목록에서 해당 게시물의 ID를 찾아 제거
    const userPostsQuery = query(collection(db, 'users', userId, 'userPosts'), where('postId', '==', postId));
    const userPostsSnapshot = await getDocs(userPostsQuery);

    userPostsSnapshot.forEach(async doc => {
      await deleteDoc(doc.ref);
    });
    console.log(`userPosts의 게시물 ${postId} 삭제 완료`);
  } catch (error) {
    console.error(`게시물 삭제 중 오류 발생 ${postId}:`, error);
    throw new Error('게시물 삭제 오류');
  }
};
