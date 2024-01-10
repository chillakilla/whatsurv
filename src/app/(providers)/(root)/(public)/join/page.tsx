'use client';
import {auth, db} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {createUserWithEmailAndPassword} from 'firebase/auth/cordova';
import {collection, doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
const JoinPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nickname, setNickname] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const router = useRouter();
  // 이메일 유효성 검사를 위한 정규 표현식
  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // 비밀번호 유효성 검사를 위한 정규 표현식 (예: 최소 8자, 하나 이상의 숫자와 특수문자 포함)
  const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  // 이메일 중복 확인 함수
  const clickEmailCheckHandler = async () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert('현재 입력하신 이메일은 사용 중입니다.다른 이메일을 입력해주세요.');
        setIsEmailAvailable(false);
      } else {
        alert('사용 가능한 이메일입니다.');
        setIsEmailAvailable(true);
      }
    } catch (error) {
      console.error('이메일 중복 확인 중 오류 발생:', error);
    }
  };
  // 닉네임 중복 확인 함수
  const checkNicknameCheckHandler = async () => {
    // 닉네임이 빈칸인 경우
    if (nickname.trim() === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      const q = query(collection(db, 'users'), where('nickname', '==', nickname));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert('현재 입력하신 닉네임은 사용중입니다. 다른 닉네임을 입력해주세요.');
        setIsNicknameAvailable(false);
      } else {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 중 오류 발생:', error);
    }
  };

  // 회원가입 함수
  const clickJoinHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    // 이메일 유효성 검사
    if (!emailValidation.test(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (!passwordValidation.test(password)) {
      alert('비밀번호는 8자 이상이어야 하며, 숫자와 특수문자를 포함해야 합니다.');
      return;
    }
    // 각각 입력 했는지 확인
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!confirmPassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    //비밀번호 일치 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!birthDate.trim()) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    //이메일 중복 확인 필수
    if (!isEmailAvailable) {
      alert('이메일 중복 확인이 필요합니다.');
      return;
    }
    //닉네임 중복 확인 필수
    if (!isNicknameAvailable) {
      alert('닉네임 중복 확인이 필요합니다.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 추가 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email,
        birthdate: birthDate,
        nickname,
      });

      alert('가입완료');
      router.replace('auth');
    } catch (error) {
      setNickname('');
      console.error(error);
      alert(error);
    }
  };

  return (
    <form onSubmit={clickJoinHandler} className="w-2/3 flex flex-wrap  justify-center m-auto">
      <div className="flex w-full items-center">
        <Input
          type="email"
          label="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요."
        />
        <Button onClick={clickEmailCheckHandler} type="button">
          이메일 중복 확인
        </Button>
      </div>
      <Input
        type="password"
        label="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="비밀번호를 입력해주세요."
      />
      <Input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="다시 한번 비밀번호를 입력해주세요."
        label="비밀번호 확인"
      />
      <Input
        type="date"
        label="생년월일"
        value={birthDate}
        onChange={e => setBirthDate(e.target.value)}
        placeholder="생년월일"
      />
      <div className="flex w-full items-center">
        <Input
          type="text"
          label="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요. "
          maxLength={10}
        />{' '}
        <Button onClick={checkNicknameCheckHandler} type="button">
          닉네임 중복 확인
        </Button>
      </div>
      <Button color="primary" type="submit" className="w-3/4">
        회원가입
      </Button>
    </form>
  );
};

export default JoinPage;
