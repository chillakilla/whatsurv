'use client';
import {queryClient} from '@/app/(providers)/queryClient';
import {auth} from '@/firebase';
import {User} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
interface AuthWrapperProps {
  children: React.ReactNode;
}
const AuthWrapper: React.FC<AuthWrapperProps> = ({children}) => {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //인증 상태 감지
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        // 로그인 상태이면 메인 페이지로 리다이렉트
        router.replace('/');
      } else {
        // 로그인 상태가 아니면 인증 초기화 상태를 true로 설정
        setIsAuthInitialized(true);
      }
      queryClient.setQueryData(['auth'], user);
    });

    return () => unsubscribe();
  }, [router]);

  if (!isAuthInitialized) {
    return null;
  }
  console.log('isAuth', isAuthInitialized);
  return <>{children}</>;
};

export default AuthWrapper;
