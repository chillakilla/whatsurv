'use client';

import {addPost, fetchPosts, uploadImageToStorage} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';

export default function PostPage() {
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likes: 0,
    category: '',
    requirements: '',
    deadlineDate: '',
    participationDate: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const updatedFormData = {...formData, imageUrl};

      await addPost(updatedFormData);

      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        likes: 0,
        category: '',
        requirements: '',
        deadlineDate: '',
        participationDate: '',
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
        <button></button>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label>제목: </label>
          <input
            className="border-solid border-2   border-#ccc"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="제목 입력창"
          />
          <label>내용: </label>
          <textarea
            className="border-solid border-2   border-#ccc"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
          <label>이미지 Url: </label>
          <input
            className="border-solid border-2   border-#ccc"
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <input
            className="mt-[10px] border-solid border-2  border-#ccc"
            type="file"
            accept="image/*"
            onChange={handleImgFileChange}
          />
          {previewImage && (
            <div>
              <h3>미리보기</h3>
              <img src={previewImage} alt="Image Preview" />
            </div>
          )}
          <label>카테고리: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="text"
            name="category"
            value={formData.category}
            required
            onChange={handleInputChange}
          />
          <label>자격요건: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
          />
          <label>신청마감일: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={handleInputChange}
          />
          <label>참여일: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="date"
            name="participationDate"
            value={formData.participationDate}
            onChange={handleInputChange}
          />
          <label>보상: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="number"
            name="rewards"
            value={formData.rewards}
            onChange={handleInputChange}
          />
          <button type="submit" className="w-[50px] h-[50px] mt-[10px] border-solid border-2  border-black">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
