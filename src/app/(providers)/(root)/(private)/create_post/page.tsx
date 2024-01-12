'use client';

import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {fetchPosts, addPost} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';

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
  console.log(posts);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likes: 0,
    category: '',
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
      await addPost(formData);

      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        likes: 0,
        category: '',
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
          <label>Title: </label>
          <input
            className="border-solid border-2   border-#ccc"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="제목 입력창"
          />
          <label>Content: </label>
          <textarea
            className="border-solid border-2   border-#ccc"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
          <label>ImageUrl: </label>
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
          <label>category: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="text"
            name="category"
            value={formData.category}
            required
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
