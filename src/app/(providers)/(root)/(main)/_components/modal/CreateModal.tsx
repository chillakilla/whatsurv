'use client';

import {uploadImageToStorage} from '@/app/api/firebaseApi';
import {db} from '@/firebase';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import React, {useState} from 'react';

interface LiteSurveyCreateModalProps {
  onCloseCreateModal: () => void;
}

const LiteSurveyCreateModal: React.FC<LiteSurveyCreateModalProps> = ({onCloseCreateModal}) => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState<string[]>(['']);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [defaultImage, setDefaultImage] = useState(true);

  // 게시물 등록하기
  const onSubmitHandler = () => {
    const isTitleEmpty = title.trim() === '';
    const areContentsEmpty = contents.some(content => content.trim() === '');
    // 로그인 한 유저인지 확인
    if (isTitleEmpty && areContentsEmpty) {
      window.alert('제목과 내용을 입력하세요.');
    } else if (isTitleEmpty) {
      window.alert('제목을 입력하세요.');
    } else if (areContentsEmpty) {
      window.alert('내용을 입력하세요.');
    } else {
      saveDataToFirebase(title, contents, selectedImages);
      onCloseCreateModal();
    }
  };

  const saveDataToFirebase = async (title: string, contents: string[], images: File[]) => {
    try {
      const liteSurveyPostsCollection = collection(db, 'litesurveyposts');
      const createdAt = serverTimestamp();

      // 이미지 업로드하고 다운로드 URL 얻기
      const imageUrls = await Promise.all(
        images.map(async image => {
          return await uploadImageToStorage(image);
        }),
      );

      const counts = contents.map(() => 0);

      // Firestore에 데이터 저장
      const docRef = await addDoc(liteSurveyPostsCollection, {
        title,
        contents,
        images: imageUrls,
        createdAt,
        counts,
      });

      console.log('ID가 포함된 문서 작성 성공: ', docRef.id);
    } catch (error) {
      console.error('문서 추가 중 오류 발생: ', error);
      throw new Error('게시글을 추가하는 것에 실패했습니다.');
    }
  };

  // 이미지 추가하기
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImages(prevImages => [...prevImages, ...Array.from(files)]);
      setDefaultImage(false); // 기본 이미지 감추기
    }
  };

  // 이미지 삭제하기
  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    if (setSelectedImages.length === 1) {
      return setDefaultImage(true);
    }
  };

  // 내용 입력하기
  const addContent = () => {
    setContents(prevContents => [...prevContents, '']);
  };

  // 내용 추가하기
  const updateContent = (index: number, value: string) => {
    setContents(prevContents => {
      const updatedContents = [...prevContents];
      updatedContents[index] = value;
      return updatedContents;
    });
  };

  // 내용 삭제하기
  const removeContent = (index: number) => {
    setContents(prevContents => prevContents.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-[39rem] p-8 flex flex-col">
        <div className="modal-content flex flex-col">
          <div className="text-3xl flex items-center justify-center text-blue-500 font-bold mb-5">What Surv?</div>
          <div className="mb-4 flex items-center">
            {selectedImages.length === 0 && defaultImage && (
              <div className="mx-auto my-auto">
                <img src="/image/default.jpg" alt="기본 이미지" className="w-[10rem] h-[11.5rem] object-cover pb-1" />
              </div>
            )}
            {selectedImages.map((image, index) => (
              <div key={index} className="mx-auto my-auto">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Image${index}`}
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
                onChange={e => updateContent(index, e.target.value)}
                className="text-xl p-2 w-[29.6rem] h-[1.4rem]"
              />
              <button
                onClick={() => removeContent(index)}
                className="bg-white px-2 rounded-xl
                hover:bg-black
                hover:text-white"
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={addContent}
            className="bg-[#4D85FF] justify-end text-white rounded-md w-[8rem] hover:bg-blue-700 ml-auto"
          >
            내용 추가
          </button>
          <div className="flex justify-end mt-4">
            <button
              onClick={onSubmitHandler}
              className="bg-[#4D85FF] text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              등록
            </button>
            <span
              className="close self-end bg-[#ef5c55] text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-[#EB271C]"
              onClick={onCloseCreateModal}
            >
              닫기
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiteSurveyCreateModal;
