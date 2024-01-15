import React from 'react';

export default function SortingPost() {
  const filteredOption = () => {};

  return (
    <div className="flex gap-4 mb-4">
      <select className="border-1 border-[#818490] w-[80px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>정렬</option>
        <option>인기순</option>
        <option>최신순</option>
      </select>
      <select className="border-1 border-[#818490] w-[80px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>성별</option>
        <option>여성</option>
        <option>남성</option>
      </select>
      <select className="border-1 border-[#818490] w-[80px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>연령</option>
        <option>10대</option>
        <option>20대</option>
        <option>30대</option>
        <option>40대</option>
        <option>50대</option>
        <option>60대</option>
        <option>70대</option>
      </select>
      <select className="border-1 border-[#818490] w-[80px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>관심사</option>
      </select>
      <select className="border-1 border-[#818490] w-[80px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>종류</option>
      </select>
      <select className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[##545760] font-semibold px-2 rounded-full">
        <option>진행방식</option>
        <option>온라인</option>
        <option>오프라인</option>
      </select>
    </div>
  );
}
