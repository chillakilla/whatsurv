'use client';

import {db} from '@/firebase';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import React, {useState} from 'react';

interface LiteSurveyCreateModalProps {
  onCloseModal: () => void;
}

const LiteSurveyCreateModal: React.FC<LiteSurveyCreateModalProps> = ({onCloseModal}) => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState<string[]>([]); // Changed to an array
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const onSubmitHandler = () => {
    saveDataToFirebase(title, contents);
    onCloseModal();
  };

  const saveDataToFirebase = async (title: string, contents: string[]) => {
    try {
      const liteSurveyPostsCollection = collection(db, 'litesurveyposts');

      const timestamp = serverTimestamp();

      const docRef = await addDoc(liteSurveyPostsCollection, {
        title,
        contents,
        timestamp,
      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
      throw new Error('게시글을 추가하는 것에 실패했습니다.');
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
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

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-1/2 p-8 flex flex-col">
        <span className="close self-end" onClick={onCloseModal}>
          &times;
        </span>
        <div className="modal-content flex flex-col">
          <label className="mb-4">
            Title:
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="border p-2" />
          </label>

          {contents.map((contentEntry, index) => (
            <div key={index} className="mb-4 flex">
              <input
                value={contentEntry}
                onChange={e => updateContent(index, e.target.value)}
                className="border p-2 flex-grow"
              />
              <button onClick={() => removeContent(index)} className="ml-2 bg-red-500 text-white px-2 rounded">
                삭제
              </button>
            </div>
          ))}

          <button onClick={addContent} className="mb-4 bg-green-500 text-white px-2 rounded">
            내용추가
          </button>

          <label className="mb-4">
            Image:
            <input type="file" accept="image/*" onChange={onImageChange} className="border p-2" />
          </label>

          {/* Submit Button */}
          <button onClick={onSubmitHandler} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiteSurveyCreateModal;
