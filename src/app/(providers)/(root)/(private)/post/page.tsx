'use client';

import {addPost, getPosts, uploadImageToStorage} from '@/app/api/firebaseApi';
import {addPostMutation} from '@/app/api/mutationApi';
import {Post} from '@/app/api/typePost';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {DocumentData, DocumentReference, Timestamp, doc} from 'firebase/firestore';
import React, {useState} from 'react';

export default function PostPage() {
  const queryClient = useQueryClient();
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

  const addPostMutation = useMutation(addPostMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const SubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const updatedFormData = {
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        likes: formData.likes,
        category: formData.category,
        requirements: formData.requirements,
        deadlineDate: new Date(formData.deadlineDate),
        participationDate: new Date(formData.participationDate),
        rewards: formData.rewards,
        createdAt: Timestamp.now(),
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
        <form onSubmit={SubmitHandler} className="flex flex-col items-center">
          <label>제목: </label>
          <input
            className="border-solid border-2   border-#ccc"
            type="text"
            name="title"
            value={formData.title}
            onChange={InputChangeHandler}
            required
            placeholder="제목 입력창"
          />
          <label>내용: </label>
          <textarea
            className="border-solid border-2   border-#ccc"
            name="content"
            value={formData.content}
            onChange={InputChangeHandler}
            required
          />
          <label>이미지 Url: </label>
          <input
            className="border-solid border-2   border-#ccc"
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={InputChangeHandler}
          />
          <input
            className="mt-[10px] border-solid border-2  border-#ccc"
            type="file"
            accept="image/*"
            onChange={ImgFileChangeHandler}
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
            onChange={InputChangeHandler}
          />
          <label>자격요건: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={InputChangeHandler}
          />
          <label>신청마감일: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={InputChangeHandler}
          />
          <label>참여일: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="date"
            name="participationDate"
            value={formData.participationDate}
            onChange={InputChangeHandler}
          />
          <label>보상: </label>
          <input
            className="border-solid border-2  border-#ccc"
            type="number"
            name="rewards"
            value={formData.rewards}
            onChange={InputChangeHandler}
          />
          <button type="submit" className="w-[50px] h-[50px] mt-[10px] border-solid border-2  border-black">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
