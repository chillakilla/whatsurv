import {db} from '@/firebase';
import {doc, getDoc} from 'firebase/firestore';

export async function getUserProfile(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const userProfileData = userDoc.data();

    return userDoc.data();
  } else {
    throw new Error('유저를 찾을 수 없습니다');
  }
}
