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
  const [contents, setContents] = useState<string[]>([]); // Changed to an array
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImages(prevImages => [...prevImages, ...Array.from(files)]);
    }
  };

  const addContent = () => {
    setContents(prevContents => [...prevContents, '']);
  };

  const updateContent = (index: number, value: string) => {
    setContents(prevContents => {
      const updatedContents = [...prevContents];
      updatedContents[index] = value;
      return updatedContents;
    });
  };

  const removeContent = (index: number) => {
    setContents(prevContents => prevContents.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-1/2 p-8 flex flex-col">
        <div className="modal-content flex flex-col">
          <div className="mb-4 flex items-center">
            {selectedImages.map((image, index) => (
              <div key={index}>
                <img src={URL.createObjectURL(image)} alt={`Image${index}`} className="w-16 h-16 object-cover mr-2" />
                <button onClick={() => removeImage(index)} className="bg-red-500 text-white px-2 rounded">
                  삭제
                </button>
              </div>
            ))}
          </div>
          <label className="mb-4 flex items-center">
            Image:
            <input type="file" accept="image/*" onChange={onImageChange} className="border p-2 ml-2" />
          </label>
          <label className="mb-4">
            Title:
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="border p-2" />
          </label>
          {contents.map((contentsEntry, index) => (
            <div key={index} className="mb-4 flex">
              <input
                value={contentsEntry}
                onChange={e => updateContent(index, e.target.value)}
                className="border p-2 flex-grow"
              />
              <button onClick={() => removeContent(index)} className="ml-2 bg-red-500 text-white px-2 rounded">
                삭제
              </button>
            </div>
          ))}
          <button onClick={addContent} className="mb-4 bg-blue-500 text-white px-2 rounded w-[250px]">
            내용추가
          </button>
          {/* Submit Button */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={onSubmitHandler} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit
            </button>
            <span
              className="close self-end bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700"
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
