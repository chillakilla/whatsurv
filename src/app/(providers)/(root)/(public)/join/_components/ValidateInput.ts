import {emailValidation, passwordValidation} from './validationUtils';

import type {ValidateInputTypes} from '../_types/typeJoin';

export default function ValidateInput({
  email,
  setEmailCheck,
  password,
  setPasswordCheck,
  confirmPassword,
  setEmailValidationClass,
  setNicknameValidationClass,
  setConfirmPasswordCheck,
  birthDate,
  setBirthDateCheck,
  nickname,
  setIsPasswordMatch,
  setNicknameCheck,
  isEmailAvailable,
  isNicknameAvailable,
  step,
}: ValidateInputTypes) {
  //빈칸에 대한 유효성 검사
  const validate = (): boolean => {
    // isVaild는 각 단계에서 입력값의 유효성을 나타낼때 사용함
    let isValid = true;

    //* !email은 email이 빈 문자열이거나 undefined일 경우 true가 됨

    if (step === 2) {
      if (!email) {
        setEmailCheck('이메일을 입력해주세요');
        setEmailValidationClass('text-red-500');
        isValid = false;
      } else if (!emailValidation.test(email)) {
        setEmailCheck('유효한 이메일 형식이 아닙니다');
        setEmailValidationClass('text-red-500');
        isValid = false;
      } else if (!isEmailAvailable) {
        setEmailCheck('이메일 중복 확인이 필요합니다');
        setEmailValidationClass('text-red-500');
        isValid = false;
      } else {
        setEmailCheck('');
        setEmailValidationClass('');
      }
    }

    if (step === 3) {
      if (!password) {
        setPasswordCheck('비밀번호를 입력해주세요');
        isValid = false;
      } else if (!passwordValidation.test(password)) {
        setPasswordCheck('비밀번호는 숫자, 특수문자 포함 8자 이상이어야 합니다.');
        isValid = false;
      } else {
        setPasswordCheck('');
      }

      if (!confirmPassword) {
        setConfirmPasswordCheck('비밀번호 확인을 입력해주세요');
        isValid = false;
      } else {
        setConfirmPasswordCheck('');
      }

      if (password !== confirmPassword) {
        setIsPasswordMatch(false);
        setConfirmPasswordCheck('비밀번호가 일치하지 않습니다');
        isValid = false;
      } else {
        setIsPasswordMatch(true);
      }
    }

    if (step === 4 && !birthDate) {
      setBirthDateCheck('생년월일을 입력해주세요');
      isValid = false;
    } else {
      setBirthDateCheck('');
    }

    if (step === 5) {
      if (!nickname) {
        setNicknameCheck('닉네임을 입력해주세요');
        setNicknameValidationClass('text-red-500');
        isValid = false;
      } else if (!isNicknameAvailable) {
        setNicknameCheck('닉네임 중복 확인이 필요합니다');
        setNicknameValidationClass('text-red-500');
        isValid = false;
      } else {
        setNicknameCheck('');
        setEmailValidationClass('');
      }
    }
    return isValid;
  };
  return {validate};
}
