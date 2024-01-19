'use client';

import {PostInput, addPost, getPosts, uploadImageToStorage} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useState, useRef} from 'react';
import PostForm from './_components/PostForm';
import ToastEditor from './_components/ToastEditor';
import {Editor} from '@toast-ui/react-editor';
import firebase from 'firebase/compat/app';
import {Timestamp} from 'firebase/firestore';

export default function PostPage() {
  const editorRef = useRef<Editor>(null);
  // const {
  //   data: posts,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useQuery<Post[]>({
  //   queryKey: ['posts'],
  //   queryFn: getPosts,
  // });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likes: 0,
    category: '',
    ageGroup: '',
    sexType: '',
    researchType: '',
    researchTime: '',
    researchLocation: '',
    deadlineDate: new Date(),
    rewards: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<Date | null>(null);

  // if (isLoading) {
  //   return <div>로딩 중...</div>;
  // }

  // if (isError) {
  //   return <div>로딩 중에 오류가 발생했습니다.</div>;
  // }

  // if (!posts) {
  //   return <div>불러올 수 있는 게시글이 없습니다.</div>;
  // }

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

      const updatedFormData: PostInput & {views: number} = {
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        likes: formData.likes,
        category: formData.category,
        sexType: formData.sexType,
        ageGroup: formData.ageGroup,
        researchType: formData.researchType,
        researchTime: formData.researchTime,
        researchLocation: formData.researchLocation,
        deadlineDate: formData.deadlineDate,
        rewards: formData.rewards,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        views: 0,
      };
      await addPost(updatedFormData);

      setSelectedFile(null);
      setPreviewImage(null);

      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        likes: 0,
        category: '',
        ageGroup: '',
        sexType: '',
        researchType: '',
        researchTime: '',
        researchLocation: '',
        deadlineDate: new Date(),
        rewards: 0,
      });
      alert('등록되었습니다.');
      // refetch();
    } catch (error) {
      console.error('에러', error);
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
