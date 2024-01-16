import {Post} from '@/app/api/typePost';
import React, {ChangeEvent, useState} from 'react';
import {majorCategories, minorCategories} from './categories';
import {Spacer} from '@nextui-org/react';

interface PostFormProps {
  formData: Omit<Post, 'views' | 'id' | 'createdAt' | 'updatedAt'> & {
    deadlineDate: Date;
    participationDate: Date;
    minorCategory: string;
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
  const [selectMajorCategory, setSelectMajorCategory] = useState<string>('');

  const majorCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectMajorCategory(e.target.value);
    onCategoryChange(e);
  };

  return (
    <div>
      <div className="w-6 h-6 flex flex-col justify-center items-center ">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
              d="M2.8284 7.0007L7.7782 11.9504L6.364 13.3646L0 7.0007L6.364 0.636719L7.7782 2.05093L2.8284 7.0007Z"
              fill="#09121F"
            />
          </svg>
        </button>
      </div>
      <Spacer y={6} />
      <div>
        <div>
          <p>제목을 입력해주세요.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col mt-[0.5rem]">
          <div className="w-[64.625rem] p-[0.625rem] flex items-center self-stretch border border-sky-500 rounded-xl gap-[0.5rem]">
            <input
              className="w-[59.8125rem] h-[1.625rem] text-base font-semibold"
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              maxLength={70}
              required
              placeholder="제목은 최대 70자까지 입력할 수 있습니다."
            />
            <p className="text-[#818490]">{formData.title.length}/70</p>
          </div>
          <Spacer y={6} />
          <div className="flex items-start self-stretch w-[64.625rem]">
            <div className="flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M13.9999 2.33301C20.4432 2.33301 25.6666 7.55635 25.6666 13.9997C25.6666 20.4429 20.4432 25.6663 13.9999 25.6663C7.55659 25.6663 2.33325 20.4429 2.33325 13.9997C2.33325 7.55635 7.55659 2.33301 13.9999 2.33301ZM14.1862 18.6663C11.8116 18.6663 9.67371 19.6798 8.18147 21.2979C9.77704 22.5716 11.7996 23.333 13.9999 23.333C16.2977 23.333 18.4014 22.5027 20.0276 21.1258C18.5448 19.6083 16.4755 18.6663 14.1862 18.6663ZM13.9999 4.66634C8.84526 4.66634 4.66659 8.84501 4.66659 13.9997C4.66659 16.112 5.36834 18.0605 6.55142 19.6246C8.46571 17.5978 11.1783 16.333 14.1862 16.333C17.0847 16.333 19.7088 17.5074 21.6087 19.4062C22.6946 17.8808 23.3333 16.0149 23.3333 13.9997C23.3333 8.84501 19.1546 4.66634 13.9999 4.66634ZM13.9999 5.83301C16.5772 5.83301 18.6666 7.92234 18.6666 10.4997C18.6666 13.077 16.5772 15.1663 13.9999 15.1663C11.4226 15.1663 9.33325 13.077 9.33325 10.4997C9.33325 7.92234 11.4226 5.83301 13.9999 5.83301ZM13.9999 8.16634C12.7112 8.16634 11.6666 9.21101 11.6666 10.4997C11.6666 11.7884 12.7112 12.833 13.9999 12.833C15.2886 12.833 16.3333 11.7884 16.3333 10.4997C16.3333 9.21101 15.2886 8.16634 13.9999 8.16634Z"
                  fill="#80A8FF"
                />
              </svg>
              <div className="ml-[0.625rem]">
                <p className="text-sm font-medium">여기 작성자 닉네임</p>
              </div>
            </div>
          </div>
          <Spacer y={8} />
          <label>대분류 : </label>
          <select
            className="border-solid border-2  border-#ccc"
            name="category"
            value={formData.category}
            onChange={majorCategoryHandler}
            required
          >
            {majorCategories.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {selectMajorCategory && minorCategories[selectMajorCategory] && (
            <>
              <label>소분류: </label>
              <select
                className="border-solid border-2  border-#ccc"
                name="minorCategory"
                value={formData.minorCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e)}
                required
              >
                {minorCategories[selectMajorCategory].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

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
            value={
              formData.participationDate instanceof Date ? formData.participationDate.toISOString().split('T')[0] : ''
            }
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
          <label>내용: </label>
          <textarea
            className="border-solid border-2 border-#ccc resize-none"
            name="content"
            value={formData.content}
            onChange={onInputChange}
            required
          />
        </form>
        <div className="flex justify-end items-start self-stretch gap-6">
          <button className="w-[15.625rem] h-[3rem] mt-[10px] border-[1.4px] bg-white border-sky-500 rounded-[25rem]">
            취소
          </button>
          <button
            type="submit"
            className="w-[15.625rem] h-[3rem] mt-[10px] border-[1.4px] bg-[#0051FF] rounded-[25rem] text-white"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
