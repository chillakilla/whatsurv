'use client';
import {auth, db} from '@/firebase';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
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
  //로그인 관련 유효성 검사할때 필요한 상태
  const [emailCheck, setEmailCheck] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  // 정규표현식 이메일과 비밀번호 유효성검사
  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordValidation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  // 로그인 에러 메시지 상태
  const [loginError, setLoginError] = useState<string>('');
  // 비밀번호 모달 상태
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // 비밀번호 눈 모양 표시 상태
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 표시 토글 함수
  const clickTogglePasswordhandler = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // 사용자의 인증 상태가 -확인되면 로딩 상태를 종료합니다.
    if (!isFetching) {
      setIsLoading(false);
    }
  }, [isFetching]);

  // 비밀번호 재설정 모달 열기
  const openResetModal = () => setIsResetModalOpen(true);

  // 비밀번호 재설정 모달 닫기
  const closeResetModal = () => setIsResetModalOpen(false);

  // 비밀번호 재설정 로직
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해 주세요.');
      closeResetModal();
    } catch (error) {
      console.error('비밀번호 재설정 에러:', error);
      alert('비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // Google 로그인 함수

  const googleLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // 세션 지속성 설정
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore에 저장할 사용자 정보
      const userData = {
        nickname: user.displayName || '기본닉네임',
        email: user.email,
        // 구글API에서 생년월일은 미지원으로 생년월일은 초기에 빈 값으로 설정
        birthdate: '',
      };

      // 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

      alert('Google 로그인 성공!');
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  };

  // GitHub 로그인 함수
  const githubLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // 세션 지속성 설정
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 이메일이 없는 경우, 대체할 값을 사용
      const replaceEmail = user.email || `${user.uid}@no-email.com`;

      // Firestore에 저장할 사용자 정보
      const userData = {
        nickname: user.displayName || email.split('@')[0], // GitHub username 또는 이메일을 사용
        email: replaceEmail,
        //생년월일은 초기에 빈 값으로 설정
        birthdate: '',
      };

      // 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

      alert('GitHub 로그인 성공!');
    } catch (error) {
      console.error('GitHub 로그인 실패:', error);
    }
  };

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
    setLoginError('');
    if (!validateInput()) return;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then(() => {
        alert('로그인 성공!');
      })
      .catch(error => {
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
      });
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
    <div style={{backgroundColor: '#F2F3F7'}} className="flex flex-wrap justify-center">
      <h3 className="text-center w-full text-2xl mt-[20px] mb-[20px] font-bold">로그인</h3>
      <form onSubmit={clickLoginHandler} className="relative">
        <Input
          type="email"
          label="이메일을 입력해주세요."
          value={email}
          placeholder="abcde@gmail.com"
          variant="bordered"
          labelPlacement="outside"
          className="mb-[20px] bg-[#fff] rounded-xl"
          onChange={e => setEmail(e.target.value)}
        />
        {emailCheck && <p className="text-red-500">{emailCheck}</p>}{' '}
        <Button
          onPress={onOpen}
          className=" Class
Properties
translate-x-[13px] float-right bg-transparent text-xs text-[#0051FF]"
        >
          비밀번호를 잊으셨나요?
        </Button>
        <Input
          type={showPassword ? 'text' : 'password'}
          label="비밀번호를 입력해주세요."
          variant="bordered"
          labelPlacement="outside"
          placeholder="숫자 및 특수문자 포함 8자"
          value={password}
          className="bg-[#fff] rounded-xl"
          onChange={e => setPassword(e.target.value)}
        />
        <span
          onClick={clickTogglePasswordhandler}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
        >
          {showPassword ? <img src="/eye_off.svg" /> : <img src="/eye_on.svg" />}
        </span>
        {passwordCheck && <p className="text-red-500">{passwordCheck}</p>}
        {loginError && <p className="text-red-500">{loginError}</p>}
        <Button type="submit" className="mt-[20px] w-full bg-[#0051FF] font-bold text-white">
          로그인
        </Button>
        <div className="text-center font-bold mt-[30px]">
          <p>간편 로그인</p>
          <Button onClick={googleLogin} className="h-[50px] mt-[20px] bg-transparent	">
            <img src="/google_icon.svg" />
          </Button>
          <Button onClick={githubLogin} className="h-[50px] mt-[20px] bg-transparent	">
            <img src="/github_icon.svg" />
          </Button>
        </div>
      </form>

      {/* 비밀번호 재설정 모달 */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{base: 'border-[#6697FF] bg-[#E5EEFF]'}}
        size="md"
        backdrop="opaque"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">비밀번호 찾기</ModalHeader>
              <ModalBody>
                <label htmlFor="resetEmail">가입 시 등록한 이메일을 입력해주세요.</label>
                <Input
                  size="lg"
                  placeholder="abcde@gmail.com"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" className="w-full" onPress={handlePasswordReset}>
                  비밀번호 찾기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AuthPage;
