import {Post} from '@/app/api/typePost';
import React, {ChangeEvent} from 'react';

interface PostFormProps {
  formData: Omit<Post, 'views' | 'id' | 'createdAt' | 'updatedAt'> & {
    deadlineDate: Date;
    participationDate: Date;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onImgFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}

export default function PostForm({
  formData,
  onInputChange,
  onDateChange,
  onCategoryChange,
  onImgFileChange,
  onSubmit,
  previewImage,
}: PostFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <label>제목: </label>
      <input
        className="w-[1094px] h-[72px] bg-slate-300 "
        type="text"
        name="title"
        value={formData.title}
        onChange={onInputChange}
        required
        placeholder="제목을 입력해주세요."
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
      <select
        className="border-solid border-2  border-#ccc"
        name="category"
        value={formData.category}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e)}
        required
      >
        <option value="">카테고리</option>
        <option value="IT">IT</option>
        <option value="Medi">메디컬</option>
        <option value="Beauty">뷰티</option>
      </select>
      <label>자격요건: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="text"
        name="requirements"
        value={formData.requirements}
        onChange={onInputChange}
      />
      <label htmlFor="deadlineDate">신청마감일: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="date"
        name="deadlineDate"
        value={formData.deadlineDate instanceof Date ? formData.deadlineDate.toISOString().split('T')[0] : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e)}
      />
      <label htmlFor="participationDate">참여일: </label>
      <input
        className="border-solid border-2  border-#ccc"
        type="date"
        name="participationDate"
        value={formData.participationDate instanceof Date ? formData.participationDate.toISOString().split('T')[0] : ''}
        onChange={onDateChange}
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
