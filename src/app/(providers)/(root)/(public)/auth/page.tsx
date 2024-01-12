'use client';
import {auth} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {signInWithEmailAndPassword} from 'firebase/auth/cordova';
import Link from 'next/link';
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
    <div className="flex flex-wrap justify-center">
      <h3 className="text-center w-full text-2xl mt-[20px] mb-[20px] font-bold">로그인</h3>
      <form onSubmit={clickLoginHandler} className="w-2/4 ">
        <label htmlFor="email">이메일</label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mb-[20px]" />
        <label htmlFor="password">비밀번호</label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
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
