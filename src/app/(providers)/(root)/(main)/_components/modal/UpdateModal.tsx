'use client';

import {getLiteSurveyPosts, updateLiteSurveyPost, uploadImageToStorage} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [defaultImage, setDefaultImage] = useState(true);

  const {
    data: liteSurveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<litePost[]>({
    queryKey: ['surveyData'],
    queryFn: getLiteSurveyPosts,
  });

  useEffect(() => {
    setTitle(selectedPost.title);
    setContents(selectedPost.contents);
    setImages(selectedPost.images);
  }, [selectedPost]);

  const onClickLiteSurveyUpdateHandler = async () => {
    if (title.trim() === '' && contents.some(content => content.trim() === '')) {
      Swal.fire({
        icon: 'warning',
        title: '미입력',
        text: '제목과 내용을 입력해 주세요.',
      });
      return;
    }
    if (title.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: '미입력',
        text: '제목을 입력해 주세요.',
      });
      return;
    }

    if (contents.some(content => content.trim() === '')) {
      Swal.fire({
        icon: 'warning',
        title: '미입력',
        text: '내용을 입력해 주세요.',
      });
      return;
    }

    try {
      // 이미지 업로드하고 다운로드 URL 얻기
      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async image => {
          return await uploadImageToStorage(image);
        }),
      );

      // 기존 이미지와 새로 업로드한 이미지 합치기
      const updatedLitePost = {
        title,
        contents,
        images: [...images, ...uploadedImageUrls],
      };

      // Firebase에 업데이트된 데이터 전송
      await updateLiteSurveyPost(selectedPost.id, updatedLitePost);

      Swal.fire({
        icon: 'success',
        title: '수정 완료',
        text: '게시물이 수정이 완료되었습니다.',
        confirmButtonColor: '#0051FF',
      });
      // 모달 닫기
      onClose();
      refetch();
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      window.alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // 이미지 추가하기
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImages(prevImages => [...prevImages, ...Array.from(files)]);
      setDefaultImage(false);
    }
  };

  const removeImage = (index: number) => {
    if (index < images.length) {
      // 기존 이미지를 삭제하는 경우
      setImages(prevImages => prevImages.filter((_, i) => i !== index));
    } else {
      // 새롭게 추가된 이미지를 삭제하는 경우
      setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index - images.length));
    }

    if (selectedImages.length + images.length === 1) {
      // 이미지가 하나만 남은 경우 (기존 + 새롭게 추가된 이미지 합산)
      setDefaultImage(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-[39rem] p-8 flex flex-col">
        <div className="modal-content flex flex-col">
          <div className="text-3xl flex items-center justify-center text-blue-500 font-bold mb-5">게시물 수정</div>
          <div className="mb-4 flex justify-center items-center">
            {/* 이미지가 하나도 없으면서 기본 이미지가 설정되어 있을 때 */}
            {images.length === 0 && defaultImage && (
              <div className="mx-auto my-auto">
                <img src="/image/default.jpg" alt="기본 이미지" className="w-[10rem] h-[11.5rem] object-cover pb-1" />
              </div>
            )}

            {/* 선택된 게시물의 이미지 표시 */}
            {images.map((image, index) => (
              <div key={index} className="mx-auto my-auto">
                <img src={image} alt={`Image${index}`} className="w-[10rem] h-[10rem] object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="ml-10 bg-white px-[1rem] rounded-xl hover:bg-[#0051FF] hover:text-white"
                >
                  삭제
                </button>
              </div>
            ))}

            {/* 로컬에 추가된 이미지 표시 */}
            {selectedImages.map((image, index) => (
              <div key={index} className="mx-auto my-auto">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`SelectedImage${index}`}
                  className="w-[10rem] h-[10rem] object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="ml-10 bg-white px-[1rem] rounded-xl
        hover:bg-[#0051FF]
        hover:text-white"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          <label className="mb-4 flex items-center">
            <input type="file" accept="image/*" onChange={onImageChange} className="p-2 ml-2 w-[24.0625rem]" />
          </label>
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
              onClick={onClickLiteSurveyUpdateHandler}
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
