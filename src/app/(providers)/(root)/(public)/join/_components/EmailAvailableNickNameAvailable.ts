import {db} from '@/firebase';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {emailValidation} from './validationUtils';

import type {EmailAvailableNickNameAvailableTypes} from '../_types/typeJoin';

export default function EmailAvailableNickNameAvailable({
  email,
  setEmailCheck,
  setEmailValidationClass,
  setIsEmailAvailable,
  nickname,
  setNicknameCheck,
  setNicknameValidationClass,
  setIsNicknameAvailable,
}: EmailAvailableNickNameAvailableTypes) {
  //이메일 중복확인 함수
  const clickEmailCheckHandler = async () => {
    // 이메일이 비어 있는 경우 확인
    if (!email) {
      setEmailCheck('이메일을 입력해주세요');
      setEmailValidationClass('text-[#EB271C]'); // 에러 색상 설정
      return; // 함수 종료
    }

    // 이메일 형식이 유효하지 않은 경우 확인
    if (!emailValidation.test(email)) {
      setEmailCheck('유효한 이메일 형식이 아닙니다');
      setEmailValidationClass('text-[#EB271C]'); // 에러 색상 설정
      return; // 함수 종료
    }
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setIsEmailAvailable(true);
        setEmailValidationClass('text-green-500');
        setEmailCheck('사용 가능한 이메일입니다');
        // 초록색 텍스트
      } else {
        setIsEmailAvailable(false);
        setEmailValidationClass('text-[#EB271C]');
        setEmailCheck('이미 사용 중인 이메일입니다');
        // 빨간색 텍스트
      }
    } catch (error) {
      console.error('이메일 중복확인 중 오류: ', error);
    }
  };

  // 닉네임 중복확인 함수
  const clickNicknameCheckHandler = async (): Promise<void> => {
    if (!nickname) {
      setNicknameCheck('닉네임을 입력해주세요');
      setNicknameValidationClass('text-[#EB271C]'); // 에러 색상 설정
      return; // 함수 종료
    }
    try {
      const querySnapshot = await getDocs(query(collection(db, 'users'), where('nickname', '==', nickname)));
      if (querySnapshot.empty) {
        setIsNicknameAvailable(true);
        setNicknameValidationClass('text-green-500');
        setNicknameCheck('사용 가능한 닉네임입니다');
      } else {
        setIsNicknameAvailable(false);
        setNicknameCheck('이미 사용 중인 닉네임입니다');
        setNicknameValidationClass('text-[#EB271C]');
      }
    } catch (error) {
      console.error('Error checking nickname availability: ', error);
    }
  };
  return {clickEmailCheckHandler, clickNicknameCheckHandler};
}
