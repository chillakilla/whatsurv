import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '@/firebase';
import {ageGroup, sexType} from '../../../(private)/create-post/_components/categories';

// 성별에 대한 데이터 통계
export const getSexTypeData = async (postId: string) => {
  const q = query(collection(db, 'submitedposts'), where('postID', '==', postId));
  const querySnapshot = await getDocs(q);
  const totalResponse = querySnapshot.size;

  const sexTypeData = sexType.map(({value, label}) => {
    const count = querySnapshot.docs.filter(doc => doc.data().sexType === value).length;
    const percentage = (count / totalResponse) * 100;

    return {label, count, percentage};
  });
  return sexTypeData;
};

// 연령에 대한 데이터 통계
export const getAgeTypeData = async (postId: string) => {
  const q = query(collection(db, 'submitedposts'), where('postID', '==', postId));
  const querySnapshot = await getDocs(q);
  const totalResponse = querySnapshot.size;

  const ageTypeData = ageGroup.map(({value, label}) => {
    const count = querySnapshot.docs.filter(doc => doc.data().ageGroup === value).length;
    const percentage = (count / totalResponse) * 100;

    return {label, count, percentage};
  });
  return ageTypeData;
};

// 설문 응답에 대한 데이터 통계를 가져오는 함수
export const getAnswerStatistics = async (postId: string) => {
  try {
    const q = query(collection(db, 'submitedposts'), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);

    // 각 질문에 대한 통계를 저장할 객체
    const questionStatistics: Record<string, Record<string, number>> = {};

    querySnapshot.forEach(doc => {
      const answers = doc.data().answers;

      // 각 질문에 대한 통계 계산
      answers.forEach((answer: string, index: number) => {
        if (!questionStatistics[`question${index + 1}`]) {
          questionStatistics[`question${index + 1}`] = {};
        }

        if (!questionStatistics[`question${index + 1}`][answer]) {
          questionStatistics[`question${index + 1}`][answer] = 1;
        } else {
          questionStatistics[`question${index + 1}`][answer]++;
        }
      });
    });

    return questionStatistics;
  } catch (error) {
    console.error('Error fetching answer statistics:', error);
    return null;
  }
};
