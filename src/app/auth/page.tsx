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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">이메일</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일 입력" />
      <label htmlFor="password">비밀번호</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 입력" />
      <button type="submit">로그인</button>
    </form>
  );
};

export default AuthPage;
