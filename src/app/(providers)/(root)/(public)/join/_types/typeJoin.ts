export interface ValidateInputTypes {
  email: string;
  setEmailCheck: (value: string) => void;
  password: string;
  setPasswordCheck: (value: string) => void;
  confirmPassword: string;
  setConfirmPasswordCheck: (value: string) => void;
  birthDate: string;
  setBirthDateCheck: (value: string) => void;
  nickname: string;
  setNicknameCheck: (value: string) => void;
  isEmailAvailable: boolean;
  isNicknameAvailable: boolean;
  setIsPasswordMatch: (value: boolean) => void;
  step: number;
  setEmailValidationClass: (value: string) => void;
  setNicknameValidationClass: (value: string) => void;
  isAgreedToTerms: boolean;
  termsCheck: string;
  setTermsCheck: React.Dispatch<React.SetStateAction<string>>;
}

export interface RenderStepJoinTypes {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  step: number;
  setStep: (value: number) => void;
  progress: number;
  setProgress: (value: number) => void;
  isJoining: boolean;
  setIsJoining: (value: boolean) => void;
  validate: () => boolean;
  termsCheck: string;
  clickEmailCheckHandler: () => void;
  clickNicknameCheckHandler: () => void;
  emailCheck: string;
  emailValidationClass: string;
  passwordCheck: string;
  confirmPasswordCheck: string;
  birthDateCheck: string;
  nicknameCheck: string;
  nicknameValidationClass: string;
  isAgreedToTerms: boolean;
  setIsAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProgressBarTypes {
  progress: number;
}

export interface EmailAvailableNickNameAvailableTypes {
  email: string;
  setEmailCheck: (message: string) => void;
  setEmailValidationClass: (className: string) => void;
  setIsEmailAvailable: (isAvailable: boolean) => void;

  nickname: string;
  setNicknameCheck: (message: string) => void;
  setNicknameValidationClass: (className: string) => void;
  setIsNicknameAvailable: (isAvailable: boolean) => void;
}
