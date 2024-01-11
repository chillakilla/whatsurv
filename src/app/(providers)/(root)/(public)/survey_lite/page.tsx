'use client';

import {useState} from 'react';
import Modal from '../../(main)/_components/Modal'; // Modal 컴포넌트 임포트

const SurveyLitePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickModalOpen = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={onClickModalOpen}>참여하기</button>
      <Modal isOpen={isModalOpen} onClose={onCloseModal} /> {/* 모달 컴포넌트 렌더링 */}
      <button>결과보기</button>
    </>
  );
};

export default SurveyLitePage;
