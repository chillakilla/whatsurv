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

  // 게시물 등록하기
  const onSubmitHandler = () => {
    saveDataToFirebase(title, contents, selectedImages);
    onCloseCreateModal();
  };

  const saveDataToFirebase = async (title: string, contents: string[], images: File[]) => {
    try {
      const liteSurveyPostsCollection = collection(db, 'litesurveyposts');
      const timestamp = serverTimestamp();

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
        timestamp,
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
    }
  };

  // 이미지 삭제하기
  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
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
      <div className="relative bg-white rounded-lg w-[600px] p-8 flex flex-col">
        <div className="modal-content flex flex-col">
          <div className="mb-4 flex items-center">
            {selectedImages.map((image, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Image${index}`}
                  className="w-[150px] h-[150px] object-cover mr-2"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="ml-2 border-sky-500 bg-white px-[50px] rounded-xl
                hover:bg-[#0051FF]
                hover:text-white"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          <label className="mb-4 flex items-center">
            이미지 :
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="border border-sky-500 rounded-xl p-2 ml-2 w-[385px]"
            />
          </label>
          <label className="mb-4">
            제 목 :&nbsp;
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border border-sky-500 rounded-xl p-2 w-[400px]"
            />
          </label>
          {contents.map((contentsEntry, index) => (
            <div key={index} className="mb-4">
              내 용 :&nbsp;
              <input
                value={contentsEntry}
                onChange={e => updateContent(index, e.target.value)}
                className="border border-sky-500 rounded-xl p-2 flex-grow w-[400px]"
              />
              <button
                onClick={() => removeContent(index)}
                className="ml-2 border-sky-500 bg-white px-2 rounded-xl
                hover:bg-[#0051FF]
                hover:text-white"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            onClick={addContent}
            className="mb-7 mx-10 bg-blue-400 text-white rounded-lg w-[200px] hover:bg-blue-700"
          >
            내용을 추가해 주세요.
          </button>
          {/* 게시물 등록 하기*/}
          <div className="flex items-center justify-center gap-3">
            <button onClick={onSubmitHandler} className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
              등록
            </button>
            <span
              className="close self-end bg-white text-black px-4 py-2 rounded hover:bg-blue-700 hover:text-white"
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
