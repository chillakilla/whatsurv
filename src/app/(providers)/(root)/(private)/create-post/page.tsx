'use client';

import {PostInput, addPost, getPosts, uploadImageToStorage} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import PostForm from './_components/PostForm';

export default function PostPage() {
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likes: 0,
    category: '',
    requirements: '',
    deadlineDate: new Date(),
    participationDate: new Date(),
    rewards: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  const InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        requirements: formData.requirements,
        deadlineDate: formData.deadlineDate,
        participationDate: formData.participationDate,
        rewards: formData.rewards,
        createdAt: new Date(),
        views: 0,
      };

      await addPost(updatedFormData);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        likes: 0,
        category: '',
        requirements: '',
        deadlineDate: new Date(),
        participationDate: new Date(),
        rewards: 0,
      });
      refetch();
    } catch (error) {
      console.error('에러', error);
    }
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
          onImgFileChange={ImgFileChangeHandler}
          onSubmit={SubmitHandler}
          previewImage={previewImage}
        />
      </div>
    </div>
  );
}
