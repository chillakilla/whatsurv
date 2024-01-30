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
  getDocs,
  query,
  serverTimestamp,
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
