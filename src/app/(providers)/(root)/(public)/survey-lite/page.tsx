'use client';

import {useState} from 'react';
import LiteSurveyCreateModal from '../../(main)/_components/LiteSurveyCreateModal';
import Modal from '../../(main)/_components/Modal';

const SurveyLitePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const onClickModalOpen = () => {
    setIsModalOpen(true);
  };

  const onClickCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <button onClick={onClickCreateModalOpen}>게시물 작성</button>
      {isCreateModalOpen && <LiteSurveyCreateModal onCloseModal={() => setIsCreateModalOpen(false)} />}
      <button onClick={onClickModalOpen}>모달창 열기</button>
      {isModalOpen && <Modal onCloseModal={() => setIsModalOpen(false)} />}
    </>
  );
};

export default SurveyLitePage;
