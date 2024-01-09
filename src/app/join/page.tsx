'use client';
import {auth, db} from '@/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth/cordova';
import {doc, setDoc} from 'firebase/firestore';
import React, {useState} from 'react';

import {useRouter} from 'next/navigation';

const JoinPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    //비밀번호 일치 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 추가 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        birthdate,
        nickname,
      });

      alert('가입완료');
      router.replace('auth');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="비밀번호 확인"
      />
      <input type="text" value={birthdate} onChange={e => setBirthdate(e.target.value)} placeholder="생년월일" />
      <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="닉네임" />
      <button type="submit">회원가입</button>
    </form>
  );
};

export default JoinPage;
