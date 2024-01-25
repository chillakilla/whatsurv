import {auth, db} from '@/firebase';
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react';
import {sendPasswordResetEmail} from 'firebase/auth';

import {Firestore, collection, getDocs, query, where} from 'firebase/firestore';
import type {PasswordResetModalTypes} from '../_types/typeAuth';
const PasswordResetModal = ({
  isOpen,
  onOpenChange,
  resetEmail,
  setResetEmail,
  emailCheckMessage,
  setEmailCheckMessage,
  setIsResetModalOpen,
  isEmailSent,

  setIsEmailSent,
}: PasswordResetModalTypes) => {
  // 비밀번호 재설정 모달 열기
  const openResetModal = () => setIsResetModalOpen(true);

  // 비밀번호 재설정 모달 닫기
  const closeResetModal = () => setIsResetModalOpen(false);
  // 비밀번호 재설정 로직
  const clickPasswordResetHandler = async () => {
    const emailExists = await checkEmailExists(db, resetEmail);
    if (!emailExists) {
      setEmailCheckMessage('가입되지 않은 이메일입니다.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setIsEmailSent(true);
      setEmailCheckMessage('');
      //alert('비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해 주세요.');
      closeResetModal();
    } catch (error) {
      console.error('비밀번호 재설정 에러:', error);
      setEmailCheckMessage('비밀번호 재설정에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  //비밀번호 재설정에 필요한 이메일 체크
  const checkEmailExists = async (db: Firestore, emailToCheck: string): Promise<boolean> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', emailToCheck));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };
  return (
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
            <ModalHeader className="flex flex-col gap-1 bg-[#E5EEFF]">비밀번호 찾기</ModalHeader>
            <ModalBody>
              {isEmailSent ? (
                <>
                  <p className="text-center">비밀번호 재설정 이메일이 발송되었습니다.</p>
                  <p className="text-center">이메일을 확인해 주세요.</p>
                </>
              ) : (
                <>
                  <label htmlFor="resetEmail">가입 시 등록한 이메일을 입력해주세요.</label>
                  <Input
                    size="lg"
                    placeholder="abcde@gmail.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                  {emailCheckMessage && <p className="text-[#EB271C] text-center">{emailCheckMessage}</p>}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {!isEmailSent && (
                <Button color="primary" className="w-full" onPress={clickPasswordResetHandler}>
                  비밀번호 찾기
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default PasswordResetModal;
