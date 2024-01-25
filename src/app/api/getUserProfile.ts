import {db} from '@/firebase';
import {doc, getDoc} from 'firebase/firestore';

export async function getUserProfile(userId: string) {
  //! 원인찾기 3. 함수 문제 있나 확인하기
  console.log(`getUserProfile 호출됨, userId: ${userId}`);
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const userProfileData = userDoc.data();
    console.log(`반환되는 데이터:`, userProfileData);
    return userDoc.data();
  } else {
    throw new Error('유저를 찾을 수 없습니다');
  }
}
