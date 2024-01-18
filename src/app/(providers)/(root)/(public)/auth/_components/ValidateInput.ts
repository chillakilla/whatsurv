import type {ValidateInputTypes} from '../_types/typeAuth';
// 정규표현식 이메일과 비밀번호 유효성검사
export default function ValidateInput({email, setEmailCheck, password, setPasswordCheck}: ValidateInputTypes): boolean {
  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  let isValid = true;
  setEmailCheck('');
  setPasswordCheck('');

  // 이메일 유효성 검사
  if (!email) {
    setEmailCheck('이메일을 입력해주세요.');
    isValid = false;
  } else if (!emailValidation.test(email)) {
    setEmailCheck('유효한 이메일 형식이 아닙니다');
    isValid = false;
  }

  // 비밀번호 유효성 검사
  if (!password) {
    setPasswordCheck('비밀번호를 입력해주세요.');
    isValid = false;
  } else if (!passwordValidation.test(password)) {
    setPasswordCheck('비밀번호는 8자 이상, 숫자 및 특수문자를 포함해야 합니다.');
    isValid = false;
  }

  return isValid;
}
