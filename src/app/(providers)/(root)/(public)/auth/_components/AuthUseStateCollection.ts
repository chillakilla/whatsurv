'use client';
import {useState} from 'react';

export default function AuthUseStateCollection() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  //로그인 관련 유효성 검사할때 필요한 상태
  const [emailCheck, setEmailCheck] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  // 로그인 에러 메시지 상태
  const [loginError, setLoginError] = useState<string>('');
  // 비밀번호 모달 상태
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // 비밀번호 눈 모양 표시 상태
  const [isShowPassword, setIsShowPassword] = useState(false);
  //비밀번호 찾기 완료 후에 메세지 렌더링 관련 상태
  const [isEmailSent, setIsEmailSent] = useState(false);
  //비밀번호 찾기 할때 가입한 이메일이 아닌 경우 렌더링 관련 상태
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    emailCheck,
    setEmailCheck,
    passwordCheck,
    setPasswordCheck,
    loginError,
    setLoginError,
    isResetModalOpen,
    setIsResetModalOpen,
    resetEmail,
    setResetEmail,
    isShowPassword,
    setIsShowPassword,
    isEmailSent,
    setIsEmailSent,
    emailCheckMessage,
    setEmailCheckMessage,
  };
}
