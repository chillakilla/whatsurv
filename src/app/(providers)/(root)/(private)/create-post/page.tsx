'use client';

import {addPost, uploadImageToStorage} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import React, {useState, useRef, useEffect} from 'react';
import PostForm from './_components/PostForm';
import ToastEditor from './_components/ToastEditor';
import {Editor} from '@toast-ui/react-editor';
import {getAuth} from 'firebase/auth';
import {FormData} from '@/app/api/typeFormData';
import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';

export default function PostPage() {
  const editorRef = useRef<Editor>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    content: '',
    imageUrl: '',
    category: '',
    ageGroup: '',
    sexType: '',
    researchType: '',
    researchTime: '',
    researchLocation: '',
    deadlineDate: null as firebase.firestore.Timestamp | null,
    createdAt: Timestamp.now(),
    rewards: 0,
    email: user?.email,
    nickname: user?.displayName,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const ImgFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0] || null;
    if (imgFile) {
      setSelectedFile(imgFile);

      const reader = new FileReader();
      reader.onload = e => {
        const imageDataUrl = e.target?.result as string;
        setPreviewImage(imageDataUrl);
      };
      reader.readAsDataURL(imgFile);
    }
  };

  const SubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SubmitHandler called');

    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const updatedFormData: Post = {
        id: formData.id,
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        category: formData.category,
        sexType: formData.sexType,
        ageGroup: formData.ageGroup,
        researchType: formData.researchType,
        researchTime: formData.researchTime,
        researchLocation: formData.researchLocation,
        userId: user?.uid,
        email: user?.email ?? null,
        nickname: user?.displayName || undefined,
        deadlineDate: selectedDeadline ? firebase.firestore.Timestamp.fromDate(selectedDeadline) : null,
        rewards: formData.rewards,
        createdAt: Timestamp.now(),
        likes: 0,
        views: 0,
        updatedAt: new Date(),
      };
      await addPost(updatedFormData);

      setSelectedFile(null);
      setPreviewImage(null);

      setFormData({
        id: '',
        title: '',
        content: '',
        imageUrl: '',
        category: '',
        ageGroup: '',
        sexType: '',
        researchType: '',
        researchTime: '',
        researchLocation: '',
        deadlineDate: null,
        createdAt: Timestamp.now(),
        rewards: 0,
      });
      alert('등록되었습니다.');
    } catch (error) {
      console.error('에러', error);
      setIsError('게시글을 등록하는 중에 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const selectedDeadline = new Date(value);
    setFormData(prevData => ({
      ...prevData,
      [name]: selectedDeadline,
    }));
    setSelectedDeadline(selectedDeadline);
  };

  return (
    <div>
      <div>
        <PostForm
          formData={formData}
          onInputChange={e => {
            const {name, value} = e.target;
            setFormData(prevData => ({
              ...prevData,
              [name]: value,
            }));
          }}
          onSubmit={SubmitHandler}
          onDateChange={onDateChange}
          onImgFileChange={ImgFileChangeHandler}
          previewImage={previewImage}
          onCategoryChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const {name, value} = e.target;
            setFormData(prevData => ({
              ...prevData,
              [name]: value,
            }));
          }}
        />
      </div>
    </div>
  );
}
