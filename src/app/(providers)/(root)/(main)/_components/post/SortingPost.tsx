import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPosts} from '@/app/api/firebaseApi';

export default function SortingPost() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  return (
    <div className="flex gap-4 my-2">
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] gap-2  font-semibold px-2 rounded-full">
        <option>정렬</option>
        <option>인기순</option>
        <option>최신순</option>
        <option>직종순</option>
      </select>
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>성별</option>
        <option>여성</option>
        <option>남성</option>
        <option>무관</option>
      </select>
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>연령</option>
        <option>10대</option>
        <option>20대</option>
        <option>30대</option>
        <option>40대</option>
        <option>50대</option>
        <option>60대</option>
        <option>70대</option>
        <option>80대 이상</option>
      </select>
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>종류</option>
        <option>전체</option>
        <option>설문조사</option>
        <option>인터뷰</option>
        <option>임상시험</option>
        <option>유저테스트</option>
      </select>
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>진행방식</option>
        <option>전체</option>
        <option>온라인</option>
        <option>오프라인</option>
      </select>
    </div>
  );
}
