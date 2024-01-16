'use client';

import {Post} from '@/app/api/typePost';
import React from 'react';

interface LiteSurveyModalProps {
  post: Post;
  contents: string[];
  onClose: () => void;
}

const LiteSurveyModal: React.FC<LiteSurveyModalProps> = ({post, contents, onClose}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-1/2 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <div className="mb-4">
          {contents.map((item, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {item}
            </p>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            onClick={() => {
              /* 참여하기 버튼 클릭 시의 동작 추가 */
            }}
          >
            참여하기
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500"
            onClick={() => {
              /* 결과보기 버튼 클릭 시의 동작 추가 */
            }}
          >
            결과보기
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiteSurveyModal;
