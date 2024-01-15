'use client';
import {auth} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AuthError, User, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import Link from 'next/link';
import React, {FormEvent, useEffect, useState} from 'react';
//TODo 유효성 검사 하나도 안되어 있으니 해야함
// 사용자 인증 상태 관리 Hook
const useAuthStatus = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      queryClient.setQueryData(['auth'], user); // React Query 캐시 업데이트
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery<User | null>({
    queryKey: ['auth'],
    initialData: null,
  });
};

// 로그인 컴포넌트
const AuthPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const {data: user, isFetching} = useAuthStatus();
  //로그인 관련 유효성 검사할때 필요한 상태
  const [emailCheck, setEmailCheck] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  // 정규표현식 이메일과 비밀번호 유효성검사
  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  // 로그인 에러 메시지 상태
  const [loginError, setLoginError] = useState<string>('');
  useEffect(() => {
    // 사용자의 인증 상태가 -확인되면 로딩 상태를 종료합니다.
    if (!isFetching) {
      setIsLoading(false);
    }
  }, [isFetching]);

  const validateInput = () => {
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
  };

  // 로그인 버튼 클릭 시 실행되는 함수
  const clickLoginHandler = async (event: FormEvent) => {
    event.preventDefault();
    // 로그인 에러 초기화
    setLoginError('');
    if (!validateInput()) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
    } catch (error) {
      console.error(error);
      // 로그인 실패 시 에러 처리
      const authError = error as AuthError;
      // 로그인 실패 시 에러 처리
      switch (authError.code) {
        case 'auth/invalid-credential':
          setLoginError('이메일 혹은 비밀번호가 틀렸습니다.');
          break;
        case 'auth/too-many-requests':
          setLoginError('비밀번호 실패가 너무 많아 계정이 잠겼습니다. 나중에 다시 시도해주세요.');
          break;
        default:
          setLoginError('로그인 실패: ' + authError.message);
          break;
      }
    }
  };

  // 로그아웃 버튼 클릭시 실행되는 함수
  const clickLogoutHandler = async () => {
    try {
      await signOut(auth); // Firebase에서 로그아웃 요청
    } catch (error) {
      console.error(error);
    }
  };

  // if (isLoading) {
  //   return <div>로딩 중...</div>; // 로딩 인디케이터 표시
  // }

  if (user) {
    return (
      <div>
        로그인 상태입니다! 사용자 이메일: {user.email} &nbsp;
        <Button onClick={clickLogoutHandler}>로그아웃</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center">
      <h3 className="text-center w-full text-2xl mt-[20px] mb-[20px] font-bold">로그인</h3>
      <form onSubmit={clickLoginHandler}>
        <Input
          type="email"
          className="mb-[20px]"
          label="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {emailCheck && <p className="text-red-500">{emailCheck}</p>}
        <Input type="password" label="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
        {passwordCheck && <p className="text-red-500">{passwordCheck}</p>}
        {loginError && <p className="text-red-500">{loginError}</p>}
        <Button className="mr-[20px] mt-[20px]">비밀번호 재설정</Button>
        <Button>
          <Link href="/join">회원가입</Link>
        </Button>
        <Button type="submit" className="mt-[20px] w-full">
          로그인
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;
