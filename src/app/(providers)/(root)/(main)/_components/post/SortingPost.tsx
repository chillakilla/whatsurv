import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPosts} from '@/app/api/firebaseApi';
import {useRouter} from 'next/navigation';

type Message = {
  condition: boolean;
  text: string;
};
type Category = {
  categories: string[];
  selectCategory: string | null;
  onCategorySelect: (category: string) => void;
};

export default function SortingPost({categories, onCategorySelect, selectCategory}: Category) {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  const messages: Message[] = [
    {condition: isLoading, text: '로딩 중...'},
    {condition: isError, text: '로딩 중에 오류가 발생했습니다.'},
    {condition: !posts, text: '불러올 수 있는 게시글이 없습니다.'},
  ];

  return (
    <>
      <div className="flex mb-10 justify-between border-b-2 border-[#eee]">
        <div className="category  flex gap-8">
          {categories.map(item => {
            return (
              <button
                key={item}
                onClick={() => onCategorySelect(item)}
                className={`${selectCategory === item ? 'border-b-2 border-[#0051FF] text-[#0051FF]' : ''}`}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="sort-post">
          <select>
            <option>최신순</option>
            <option>인기순</option>
            <option>마감임박 순</option>
          </select>
        </div>
      </div>
    </>
  );
}
