'use client';

import {updateLiteSurveyPost} from '@/app/api/firebaseApi';
import React, {useEffect, useState} from 'react';

interface UpdateModalProps {
  selectedPost: {
    id: string;
    title: string;
    images: string[];
    contents: string[];
  };
  onClose: () => void;
  onUpdate: (updatedData: {title: string; images: string[]; contents: string[]}) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({selectedPost, onClose, onUpdate}) => {
  const [title, setTitle] = useState<string>(selectedPost.title);
  const [contents, setContents] = useState<string[]>(selectedPost.contents);
  const [images, setImages] = useState<string[]>(selectedPost.images);

  useEffect(() => {
    setTitle(selectedPost.title);
    setContents(selectedPost.contents);
    setImages(selectedPost.images);
  }, [selectedPost]);

  const handleUpdate = () => {
    if (title.trim() === '') {
      window.alert('제목을 입력하세요.');
      return;
    }

    if (contents.some(content => content.trim() === '')) {
      window.alert('내용을 입력하세요.');
      return;
    }

    const updatedLitePost = {
      title,
      contents,
      images,
    };

    updateLiteSurveyPost(selectedPost.id, updatedLitePost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-[39rem] p-8 flex flex-col">
        <div className="modal-content flex flex-col">
          <div className="text-3xl flex items-center justify-center text-blue-500 font-bold mb-5">게시물 수정</div>

          <label className="mb-4 pb-1 text-2xl border-b border-black">
            제 목 :&nbsp;
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-2xl p-2 w-[25rem] h-[2rem]"
              placeholder="제목을 입력해주세요"
            />
          </label>

          <div className="mb-4 flex items-center">
            {images.map((image, index) => (
              <div key={index} className="mx-auto my-auto">
                <input
                  type="text"
                  value={image}
                  onChange={e => {
                    const updatedImages = [...images];
                    updatedImages[index] = e.target.value;
                    setImages(updatedImages);
                  }}
                />
              </div>
            ))}
            <button onClick={() => setImages(prev => [...prev, ''])}>이미지 추가</button>
          </div>

          {contents.map((contentsEntry, index) => (
            <div key={index} className="mb-4 pb-1 text-l border-b border-blue-300">
              내 용 :&nbsp;
              <input
                value={contentsEntry}
                onChange={e => {
                  const updatedContents = [...contents];
                  updatedContents[index] = e.target.value;
                  setContents(updatedContents);
                }}
                className="text-xl p-2 w-[29.6rem] h-[1.4rem]"
              />
            </div>
          ))}
          <button
            onClick={() => setContents(prev => [...prev, ''])}
            className="bg-[#4D85FF] justify-end text-white rounded-md w-[8rem] hover:bg-blue-700 ml-auto"
          >
            내용 추가
          </button>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleUpdate}
              className="bg-[#4D85FF] text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              수정
            </button>
            <span
              className="close self-end bg-[#ef5c55] text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-[#EB271C]"
              onClick={onClose}
            >
              닫기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
