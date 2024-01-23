'use client';
import {useState} from 'react';
export default function JoinUseStateCollection() {
  //가입시 필요한 상태
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  // 회원가입 진행 단계
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(15);

  //빈칸에 대한 유효성검사 관련 상태
  const [emailCheck, setEmailCheck] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [confirmPasswordCheck, setConfirmPasswordCheck] = useState<string>('');
  const [birthDateCheck, setBirthDateCheck] = useState<string>('');
  const [nicknameCheck, setNicknameCheck] = useState<string>('');

  //이메일과 닉네임 중복 확인 상태
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(false);

  // 비밀번호 일치 여부 상태
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);

  //회원가입 진행중 상태
  const [isJoining, setIsJoining] = useState<boolean>(false);

  //이메일과 닉네임 중복확인 할 경우에 컬러 관련 필요한 상태
  const [emailValidationClass, setEmailValidationClass] = useState<string>('');
  const [nicknameValidationClass, setNicknameValidationClass] = useState<string>('');

  //회원가입 약관 동의
  const [isAgreedToTerms, setIsAgreedToTerms] = useState<boolean>(false);

  //회원가입 약관 동의 상태
  const [termsCheck, setTermsCheck] = useState('');

  return {
    email,
    setEmail,
    termsCheck,
    setTermsCheck,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isAgreedToTerms,
    setIsAgreedToTerms,
    birthDate,
    setBirthDate,
    nickname,
    setNickname,
    isEmailAvailable,
    setIsEmailAvailable,
    isNicknameAvailable,
    setIsNicknameAvailable,
    step,
    setStep,
    progress,
    setProgress,
    isPasswordMatch,
    setIsPasswordMatch,
    isJoining,
    setIsJoining,
    emailCheck,
    setEmailCheck,
    passwordCheck,
    setPasswordCheck,
    confirmPasswordCheck,
    setConfirmPasswordCheck,
    birthDateCheck,
    setBirthDateCheck,
    nicknameCheck,
    setNicknameCheck,
    emailValidationClass,
    setEmailValidationClass,
    nicknameValidationClass,
    setNicknameValidationClass,
  };
}
