import {Post} from '@/app/api/typePost';
import {Timestamp} from 'firebase/firestore';
import React from 'react';

interface PostFormProps {
  formData: Omit<Post, 'views' | 'id' | 'createdAt' | 'updatedAt'> & {
    deadlineDate: Date;
    participationDate: Date;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImgFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  previewImage: string | null;
}

export default function PostForm({formData, onInputChange, onImgFileChange, onSubmit, previewImage}: PostFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    const formDataWithDate: Post = {
      ...formData,
      deadlineDate: new Date(formData.deadlineDate),
      participationDate: new Date(formData.participationDate),
    };
    onSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <label>제목: </label>
      <input
        className="border-solid border-2 border-#ccc"
        type="text"
        name="title"
        value={formData.title}
        onChange={onInputChange}
        required
        placeholder="제목 입력창"
      />
      <label>내용: </label>
      <textarea
        className="border-solid border-2 border-#ccc resize-none"
        name="content"
        value={formData.content}
        onChange={onInputChange}
        required
      />
      <label>이미지 Url: </label>
      <input
        className="border-solid border-2 border-#ccc"
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={onInputChange}
      />
      <input
        className="mt-[10px] border-solid border-2 border-#ccc"
        type="file"
        accept="image/*"
        onChange={onImgFileChange}
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
        onChange={onInputChange}
      />
      <label>자격요건: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="text"
        name="requirements"
        value={formData.requirements}
        onChange={onInputChange}
      />
      <label>신청마감일: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="date"
        name="deadlineDate"
        value={formData.deadlineDate.toISOString().split('T')[0]}
        onChange={onInputChange}
      />
      <label>참여일: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="date"
        name="participationDate"
        value={formData.participationDate.toISOString().split('T')[0]}
        onChange={onInputChange}
      />
      <label>보상: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="number"
        name="rewards"
        value={formData.rewards}
        onChange={onInputChange}
      />
      <button type="submit" className="w-[50px] h-[50px] mt-[10px] border-solid border-2  border-black">
        Add
      </button>
    </form>
  );
}
