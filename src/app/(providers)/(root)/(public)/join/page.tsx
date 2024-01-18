'use client';
import EmailAvailableNickNameAvailable from './_components/EmailAvailableNickNameAvailable';
import JoinUseStateCollection from './_components/JoinUseStateCollection';
import ProgressBar from './_components/ProgressBar';
import RenderStepJoin from './_components/RenderStepJoin';
import ValidateInput from './_components/ValidateInput';
const JoinPage = () => {
  const {
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
    isEmailAvailable,
    setIsEmailAvailable,
    isNicknameAvailable,
    setIsNicknameAvailable,
    step,
    setStep,
    progress,
    setProgress,
    isPasswordMatch,
    setIsPasswordMatch,
    isJoining,
    setIsJoining,
    emailCheck,
    setEmailCheck,
    passwordCheck,
    setPasswordCheck,
    confirmPasswordCheck,
    setConfirmPasswordCheck,
    birthDateCheck,
    setBirthDateCheck,
    nicknameCheck,
    setNicknameCheck,
    emailValidationClass,
    setEmailValidationClass,
    nicknameValidationClass,
    setNicknameValidationClass,
  } = JoinUseStateCollection();

  // 유효성 검사 가져오기
  const {validate} = ValidateInput({
    email,
    setEmailCheck,
    password,
    setPasswordCheck,
    confirmPassword,
    setConfirmPasswordCheck,
    birthDate,
    setBirthDateCheck,
    nickname,
    setNicknameCheck,
    isEmailAvailable,
    isNicknameAvailable,
    setIsPasswordMatch,
    step,
    setEmailValidationClass,
    setNicknameValidationClass,
  });

  const {clickEmailCheckHandler, clickNicknameCheckHandler} = EmailAvailableNickNameAvailable({
    email,
    setEmailCheck,
    setEmailValidationClass,
    setIsEmailAvailable,
    nickname,
    setNicknameCheck,
    setNicknameValidationClass,
    setIsNicknameAvailable,
  });
  const {renderStep, clickJoinHandler} = RenderStepJoin({
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
    emailCheck,
    passwordCheck,
    confirmPasswordCheck,
    birthDateCheck,
    nicknameCheck,
    emailValidationClass,
    nicknameValidationClass,
    validate,
    clickEmailCheckHandler,
    clickNicknameCheckHandler,
  });

  return (
    <div>
      <h3 className="w-[400px] mx-auto text-2xl mt-[50px] font-bold">회원가입</h3>
      {/* 프로그래스 바 */}
      <ProgressBar progress={progress} />
      {/* 입력 폼 */}
      <form onSubmit={clickJoinHandler} className="w-2/3 flex flex-wrap justify-center m-auto">
        {renderStep()}
      </form>
    </div>
  );
};

export default JoinPage;
