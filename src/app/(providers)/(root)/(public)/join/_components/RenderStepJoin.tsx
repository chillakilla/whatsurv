import {auth, db} from '@/firebase';
import {Button, Checkbox, Input} from '@nextui-org/react';
import confetti from 'canvas-confetti';
import {createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React from 'react';
import {IoIosCheckmarkCircle} from 'react-icons/io';
import {SyncLoader} from 'react-spinners';
import Swal from 'sweetalert2';
import type {RenderStepJoinTypes} from '../_types/typeJoin';
import TermsModal from './TermsModal';

export default function RenderStepJoin({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  birthDate,
  setBirthDate,
  nickname,
  setNickname,
  step,
  setStep,
  progress,
  setProgress,
  isJoining,
  setIsJoining,
  isAgreedToTerms,
  setIsAgreedToTerms,
  validate,
  clickEmailCheckHandler,
  clickNicknameCheckHandler,
  emailCheck,
  termsCheck,
  emailValidationClass,
  passwordCheck,
  confirmPasswordCheck,
  birthDateCheck,
  nicknameCheck,
  nicknameValidationClass,
}: RenderStepJoinTypes) {
  const router = useRouter();

  // 다음 단계로 이동하는 함수
  const moveToNextStep = () => {
    const newStep = step + 1;
    setStep(newStep);

    // 진행률 갱신
    setProgress((newStep / 6) * 100);
  };

  //가입축하 폭죽
  const triggerConfetti = () => {
    confetti({
      angle: 90,
      spread: 180,
      particleCount: 100,
      origin: {y: 0.6},
    });
  };

  // 회원가입 함수
  const clickJoinHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    // 빈칸에 대한 유효성 검사 수행
    if (!validate()) {
      return; // 유효성 검사 실패 시, 함수 종료
    }

    // if (step !== 4) {
    //   alert('모든 단계를 완료해야 회원가입이 가능합니다.');
    //   return;
    // }

    setIsJoining(true); // 회원가입 시작

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 추가 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email,
        birthdate: birthDate,
        nickname,

        sexType: '--미설정--',
      });

      // 회원가입 성공 후 즉시 로그아웃
      await signOut(auth);

      // 회원가입 성공 메시지 표시
      Swal.fire({
        title: '회원가입 성공!',
        icon: 'success',
        confirmButtonText: '확인',
        confirmButtonColor: '#0051FF',
      });
      setStep(6);
      // 프로그래스 바 완료 상태로 설정
      setProgress(100);
    } catch (error) {
      setNickname('');
      console.error(error);
      alert(error);
    } finally {
      setIsJoining(false); // 회원가입 종료
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="mt-[20px] w-[400px]">
            {/* 체크박스 */}
            <div>
              <TermsModal />
              <label className="flex items-center pt-[8px]">
                <Checkbox checked={isAgreedToTerms} size="lg" onChange={e => setIsAgreedToTerms(e.target.checked)} />
                <span className="text-lg">약관에 동의합니다.</span>
              </label>
            </div>
            {termsCheck && <p className="text-[#EB271C] mt-[25px] text-center">{termsCheck}</p>}
            <Button
              className="mt-[20px] w-full bg-[#0051FF] text-white"
              size="lg"
              onClick={() => {
                if (validate()) moveToNextStep();
              }}
              type="button"
            >
              다음
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="mt-[20px] w-[400px]">
            <div className="flex items-center ">
              <Input
                type="email"
                className="mt-[20px]   bg-[#fff] rounded-xl"
                label="이메일을 입력해주세요"
                variant="bordered"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                onClick={clickEmailCheckHandler}
                size="lg"
                className="bg-[#0051FF] ml-[5px] text-white translate-y-[11px]"
              >
                중복 확인
              </Button>
            </div>
            {emailCheck && <p className={`${emailValidationClass}  mt-[15px] text-center mt-2`}>{emailCheck}</p>}

            <Button
              className="mt-[20px] w-full bg-[#0051FF] text-white"
              size="lg"
              onClick={() => {
                if (validate()) moveToNextStep();
              }}
              type="button"
            >
              다음
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="mt-[20px] w-[400px]">
            <Input
              type="password"
              className="mt-[20px] mb-[20px] bg-[#fff] rounded-xl"
              label="비밀번호를 입력해주세요"
              value={password}
              variant="bordered"
              onChange={e => setPassword(e.target.value)}
            />
            {passwordCheck && <p className="text-[#EB271C] mb-[20px] text-center mt-2">{passwordCheck}</p>}
            <Input
              type="password"
              value={confirmPassword}
              variant="bordered"
              className="bg-[#fff] mb-[20px] rounded-xl"
              onChange={e => setConfirmPassword(e.target.value)}
              label="다시 한번 비밀번호를 입력해주세요"
            />
            {confirmPasswordCheck && <p className="text-[#EB271C] text-center mt-2">{confirmPasswordCheck}</p>}
            <Button
              className="mt-[20px]  w-full bg-[#0051FF] text-white"
              size="lg"
              onClick={() => {
                if (validate()) moveToNextStep();
              }}
              type="button"
            >
              다음
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="mt-[20px] w-[400px]">
            <Input
              type="date"
              className="mt-[20px]  bg-[#fff] rounded-xl"
              label="생년월일을 입력해주세요."
              placeholder="생년월일을 입력해주세요."
              value={birthDate}
              variant="bordered"
              maxLength={6}
              onChange={e => setBirthDate(e.target.value)}
            />
            {birthDateCheck && <p className="text-[#EB271C] text-center mt-2">{birthDateCheck}</p>}
            <Button
              size="lg"
              onClick={() => {
                if (validate()) moveToNextStep();
              }}
              type="button"
              className="mt-[20px]  w-full bg-[#0051FF] text-white"
            >
              다음
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="mt-[20px] w-[400px]">
            {!isJoining && (
              <>
                <div className="flex items-center">
                  <Input
                    type="text"
                    className="mt-[20px]  bg-[#fff] rounded-xl"
                    variant="bordered"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    label="닉네임을 입력해주세요."
                    maxLength={10}
                  />
                  <Button
                    size="lg"
                    onClick={clickNicknameCheckHandler}
                    className="bg-[#0051FF] ml-[5px] text-white translate-y-[11px]"
                  >
                    중복 확인
                  </Button>
                </div>
                {nicknameCheck && <p className={`${nicknameValidationClass} text-center mt-2`}>{nicknameCheck}</p>}
                <Button
                  size="lg"
                  onClick={clickJoinHandler}
                  className="mt-[20px]  w-full bg-[#0051FF] text-white"
                  type="button"
                >
                  회원가입
                </Button>
              </>
            )}
            {isJoining && (
              <div className="mt-[20px]">
                <SyncLoader color="#0051FF" loading={isJoining} size={15} className="text-center" />
                <p className="text-center mt-[30px] text-[#0051FF]">회원가입이 진행중입니다. 잠시만 기다려주세요...</p>
              </div>
            )}
          </div>
        );
      case 6:
        triggerConfetti();
        return (
          <div className="mt-[20px] w-[400px] ">
            <div className="flex  flex-wrap justify-center">
              <p className=" w-full text-center">WhatSurv?에 오신 것을 환영합니다!</p>

              <IoIosCheckmarkCircle className="text-8xl my-[40px] mx-auto text-[#0051FF]" />
              <p className="w-full text-center">회원가입이 완료되었습니다.</p>
            </div>
            <Button
              className="mt-[20px]  w-full bg-[#0051FF] text-white"
              type="button"
              size="lg"
              onClick={() => router.replace('auth')}
            >
              로그인하러가기
            </Button>
          </div>
        );

      default:
        return null;
    }
  };
  return {renderStep, clickJoinHandler};
}
