import React from 'react';

export default function SearchBar() {
  return (
    <form className="flex justify-center items-center my-[80px]">
      <input
        type="text"
        className="w-[800px] h-12 bg-white rounded-xl text-[#666] p-4"
        placeholder="검색어를 입력해주세요"
      />
    </form>
  );
}
