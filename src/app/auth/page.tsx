'use client';
import {auth} from '@/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth/cordova';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  //로그인 버튼 함수
  const clickLoginHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Firebase의 signInWithEmailAndPassword 함수를 사용하여 이메일과 비밀번호로 로그인 시도
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      alert('로그인완료');
      router.replace('main');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  console.log(isLoggedIn);
  return (
    <form onSubmit={clickLoginHandler}>
      <label htmlFor="email">이메일</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일 입력" />
      <label htmlFor="password">비밀번호</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 입력" />
      <button type="submit">로그인</button>
    </form>
  );
};

export default AuthPage;
