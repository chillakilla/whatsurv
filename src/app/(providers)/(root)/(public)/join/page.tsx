'use client';
import {auth, db} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {createUserWithEmailAndPassword} from 'firebase/auth/cordova';
import {collection, doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
const JoinPage = () => {
  const [step, setStep] = useState<number>(1); // 회원가입 진행 단계
  //가입시 필요한 상태
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');

  //정규표현식 유효성상태
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(20);

  // 비밀번호 일치 여부 상태
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);

  //빈칸에 대한 유효성검사 관련 상태
  const [emailCheck, setEmailCheck] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [confirmPasswordCheck, setConfirmPasswordCheck] = useState<string>('');
  const [birthDateCheck, setBirthDateCheck] = useState<string>('');
  const [nicknameCheck, setNicknameCheck] = useState<string>('');
  const router = useRouter();

  //이메일 중복확인 할 경우에 컬러 관련 필요한 상태
  const [emailCheckClass, setEmailCheckClass] = useState<string>('');

  // 정규표현식 이메일과 비밀번호 유효성검사
  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  //빈칸에 대한 유효성 검사
  const validateInput = (): boolean => {
    // isVaild는 각 단계에서 입력값의 유효성을 나타낼때 사용함
    let isValid = true;

    //* !email은 email이 빈 문자열이거나 undefined일 경우 true가 됨
    if (step === 1) {
      if (!email) {
        setEmailCheck('이메일을 입력해주세요');
        isValid = false;
      } else if (!emailValidation.test(email)) {
        setEmailCheck('유효한 이메일 형식이 아닙니다');
        isValid = false;
      } else if (!isEmailAvailable) {
        setEmailCheck('이메일 중복 확인이 필요합니다');
        isValid = false;
      } else {
        setEmailCheck('');
      }
    }

    if (step === 2) {
      if (!password) {
        setPasswordCheck('비밀번호를 입력해주세요');
        isValid = false;
      } else if (!passwordValidation.test(password)) {
        setPasswordCheck('비밀번호는 8자 이상, 숫자 및 특수문자를 포함해야 합니다');
        isValid = false;
      } else {
        setPasswordCheck('');
      }

      if (!confirmPassword) {
        setConfirmPasswordCheck('비밀번호 확인을 입력해주세요');
        isValid = false;
      } else {
        setConfirmPasswordCheck('');
      }

      if (password !== confirmPassword) {
        setIsPasswordMatch(false);
        setConfirmPasswordCheck('비밀번호가 일치하지 않습니다');
        isValid = false;
      } else {
        setIsPasswordMatch(true);
      }
    }

    if (step === 3 && !birthDate) {
      setBirthDateCheck('생년월일을 입력해주세요');
      isValid = false;
    } else {
      setBirthDateCheck('');
    }

    if (step === 4 && !nickname) {
      setNicknameCheck('닉네임을 입력해주세요');
      isValid = false;
    } else {
      setNicknameCheck('');
    }
    return isValid;
  };

  const checkEmailAvailability = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setIsEmailAvailable(true);
        setEmailCheck('사용 가능한 이메일입니다');
        setEmailCheckClass('text-green-500'); // 초록색 텍스트
      } else {
        setIsEmailAvailable(false);
        setEmailCheck('이미 사용 중인 이메일입니다');
        setEmailCheckClass('text-red-500'); // 빨간색 텍스트
      }
    } catch (error) {
      console.error('이메일 중복확인 중 오류: ', error);
    }
  };

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
    // 빈칸에 대한 유효성 검사 수행
    if (!validateInput()) {
      return; // 유효성 검사 실패 시, 함수 종료
    }

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
              className="mt-[20px]"
              label="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요."
            />
            <Button onClick={checkEmailAvailability}>이메일 중복 확인</Button>
            {emailCheck && <p className={`${emailCheckClass} text-red-500 text-center mt-2`}>{emailCheck}</p>}

            <Button
              className="mt-[20px]"
              onClick={() => {
                if (validateInput()) moveToNextStep();
              }}
              type="button"
            >
              다음
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <Input
              type="password"
              className="mt-[20px]"
              label="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요."
            />
            {passwordCheck && <p className="text-red-500 text-center mt-2">{passwordCheck}</p>}
            <Input
              type="password"
              value={confirmPassword}
              className="mt-[20px]"
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="다시 한번 비밀번호를 입력해주세요."
              label="비밀번호 확인"
            />
            {confirmPasswordCheck && <p className="text-red-500 text-center mt-2">{confirmPasswordCheck}</p>}
            <Button
              className="mt-[20px]"
              onClick={() => {
                if (validateInput()) moveToNextStep();
              }}
              type="button"
            >
              다음
            </Button>
          </div>
        );
      case 3:
        return (
          <div>
            <Input
              type="date"
              className="mt-[20px]"
              label="생년월일"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              placeholder="생년월일"
            />
            {birthDateCheck && <p className="text-red-500 text-center mt-2">{birthDateCheck}</p>}
            <Button
              onClick={() => {
                if (validateInput()) moveToNextStep();
              }}
              type="button"
              className="mt-[20px]"
            >
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
              className="mt-[20px]"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요. "
              maxLength={10}
            />
            {nicknameCheck && <p className="text-red-500 text-center mt-2">{nicknameCheck}</p>}
            <Button onClick={clickJoinHandler} className="mt-[20px]" type="button">
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
