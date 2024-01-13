'use client';
import {auth} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {User, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import Link from 'next/link';
import React, {FormEvent, useEffect, useState} from 'react';

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

  useEffect(() => {
    // 사용자의 인증 상태가 확인되면 로딩 상태를 종료합니다.
    if (!isFetching) {
      setIsLoading(false);
    }
  }, [isFetching]);

  // 로그인 버튼 클릭 시 실행되는 함수
  const clickLoginHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
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

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 인디케이터 표시
  }

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
        <Input type="password" label="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
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
