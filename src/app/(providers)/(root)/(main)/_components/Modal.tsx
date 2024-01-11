import React from 'react';

const Modal: React.FC<{isOpen: boolean; onClose: () => void}> = ({isOpen, onClose}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg w-1/2">
            <span className="absolute top-0 right-0 m-4 text-2xl cursor-pointer" onClick={onClose}>
              &times;
            </span>
            <div className="p-6">
              <p className="text-xl font-semibold">설문조사</p>
              <p>여기에 설문조사 내용이 들어가야 합니다.</p>
              <p>설문 조사 기간</p>
              <p>선택 목록</p>
              <ol>
                <li>김치찌개</li>
                <li>돼지국밥</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
