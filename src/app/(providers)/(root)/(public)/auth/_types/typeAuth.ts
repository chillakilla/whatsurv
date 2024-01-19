export interface PasswordResetModalTypes {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resetEmail: string;
  setResetEmail: React.Dispatch<React.SetStateAction<string>>;
  emailCheckMessage: string;
  setEmailCheckMessage: React.Dispatch<React.SetStateAction<string>>;
  isEmailSent: boolean;
  setIsResetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEmailSent: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ValidateInputTypes {
  email: string;
  setEmailCheck: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPasswordCheck: React.Dispatch<React.SetStateAction<string>>;
}
