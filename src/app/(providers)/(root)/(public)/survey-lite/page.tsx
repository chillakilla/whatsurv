'use client';

import {useState} from 'react';
import Modal from '../../(main)/_components/Modal';

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
      <Modal isOpen={isModalOpen} onClose={onCloseModal} />
      <button onClick={onClickModalOpen}>결과보기</button>
    </>
  );
};

export default SurveyLitePage;
