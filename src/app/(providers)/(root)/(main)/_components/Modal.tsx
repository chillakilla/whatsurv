'use client';

import React, {useState} from 'react';

interface ModalProps {
  onCloseModal: () => void;
}

const Modal: React.FC<ModalProps> = ({onCloseModal}) => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [optionCounts, setOptionCounts] = useState<number[]>(Array.from({length: 2}, () => 0));
  const options = ['김치찌개', '돼지국밥'];

  // 새로운 상태 변수 추가
  const [isOpen, setIsOpen] = useState(true);

  const onCloseModalHandler = () => {
    onCloseModal();
  };

  const onClickResultButton = () => {
    setIsResultModalOpen(true);
    // 결과보기 모달이 열리면 다른 모달도 닫음
    setIsOpen(false);
  };

  const onCloseResultModal = () => {
    setIsResultModalOpen(false);
    // 결과보기 모달이 닫히면 다른 모달 다시 열림
    setIsOpen(true);
  };

  const onChangeOptionHandler = (index: number) => {
    setSelectedOptionIndex(index);
  };

  const surveySubmitHandler = () => {
    if (selectedOptionIndex !== null) {
      const updatedCounts = [...optionCounts];
      updatedCounts[selectedOptionIndex] += 1;
      setOptionCounts(updatedCounts);
      console.log('선택된 옵션:', options[selectedOptionIndex]);
    }

    onCloseModalHandler();
  };

  return (
    <>
      {/* Survey Modal */}
      <div
        className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center ${
          isResultModalOpen || !isOpen ? 'hidden' : ''
        }`}
      >
        <div className="relative bg-white rounded-lg w-1/2">
          <span className="absolute top-0 right-0 m-4 text-2xl cursor-pointer" onClick={onCloseModalHandler}>
            &times;
          </span>
          <div className="p-6">
            <p className="text-xl font-semibold">설문조사</p>
            <p>여기에 설문조사 내용이 들어가야 합니다.</p>
            <p>선택 목록</p>
            <ul>
              {options.map((option, index) => (
                <li key={option}>
                  <label>
                    <input
                      type="radio"
                      checked={selectedOptionIndex === index}
                      onChange={() => onChangeOptionHandler(index)}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={surveySubmitHandler}>제출</button>
            <button onClick={onClickResultButton}>결과보기</button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {isResultModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg w-1/2">
            <span className="absolute top-0 right-0 m-4 text-2xl cursor-pointer" onClick={onCloseResultModal}>
              &times;
            </span>
            <div className="p-6">
              <p className="text-xl font-semibold">결과 보기</p>
              <ul>
                {options.map((option, index) => (
                  <li key={option}>
                    {option} - {optionCounts[index]} 회
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
