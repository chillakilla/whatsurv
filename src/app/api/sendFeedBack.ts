import {collection} from 'firebase/firestore';
import {db} from '@/firebase';
import {addDoc} from 'firebase/firestore';

// firebase에 데이터 보내기
export const sendData = async (feedback: string) => {
  try {
    const feedbackCollection = collection(db, 'feedbacks');

    // Firestore에 데이터 저장
    const docRef = await addDoc(feedbackCollection, {
      feedback,
    });

    console.log('전송 성공', feedback);
  } catch (error) {
    console.error('전송 중 오류 발생: ', error);
    throw new Error('전송에 실패했습니다.');
  }
};
