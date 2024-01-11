'use client';
import {auth, db} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {createUserWithEmailAndPassword} from 'firebase/auth/cordova';
import {doc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

const JoinPage = () => {
  const [step, setStep] = useState<number>(1); // 회원가입 진행 단계
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(20);
  // 비밀번호 일치 여부를 저장할 상태 추가
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const router = useRouter();
  const progressBarStyle = {
    width: `${progress}%`,
    // 진행률이 변경될 때 부드럽게 애니메이션 적용
    transition: 'width 0.3s ease-in-out',
  };

  // 다음 단계로 이동하는 함수
  const moveToNextStep = () => {
    setStep(step + 1);
    // 진행률 갱신
    setProgress((step + 1) * 20);
  };

  // 회원가입 함수
  const clickJoinHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (step !== 4) {
      alert('모든 단계를 완료해야 회원가입이 가능합니다.');
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

      // 회원가입 성공 메시지 표시
      alert('회원가입 성공!');
      setStep(5);
      // 프로그래스 바 완료 상태로 설정
      setProgress(100);
    } catch (error) {
      setNickname('');
      console.error(error);
      alert(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <Input
              type="email"
              label="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요."
            />
            <Button onClick={moveToNextStep} type="button">
              다음
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
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
            <Button onClick={moveToNextStep} type="button">
              다음
            </Button>
          </div>
        );
      case 3:
        return (
          <div>
            <Input
              type="date"
              label="생년월일"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              placeholder="생년월일"
            />
            <Button onClick={moveToNextStep} type="button">
              다음
            </Button>
          </div>
        );
      case 4:
        return (
          <div>
            <Input
              type="text"
              label="닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요. "
              maxLength={10}
            />
            <Button onClick={clickJoinHandler} type="button">
              회원가입
            </Button>
          </div>
        );
      case 5:
        return (
          <div>
            <p>회원가입 완료</p>
            <Button color="primary" type="button" onClick={() => router.replace('auth')}>
              로그인하러가기
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* 프로그래스 바 */}
      <div className="progress-bar">
        <div className="bg-gray-200 w-full h-4">
          <div className="bg-blue-500 h-4" style={progressBarStyle}></div>
        </div>
      </div>
      <form onSubmit={clickJoinHandler} className="w-2/3 flex flex-wrap justify-center m-auto">
        {renderStep()}
      </form>
    </div>
  );
};

export default JoinPage;
