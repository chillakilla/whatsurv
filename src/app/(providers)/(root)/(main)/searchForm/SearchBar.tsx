import {Post} from '@/app/api/typePost';
import React, {useState} from 'react';
import Swal from 'sweetalert2';

interface SearchProps {
  posts: Post[];
  setSearchResults: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function SearchBar({posts, setSearchResults}: SearchProps) {
  const [searchValue, setSearchValue] = useState<string>('');

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const searchInputValue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 검색어
    const searchTerm = searchValue.trim().toLowerCase();

    // 검색창이 비어있으면 모든 게시물 보여주기
    if (!searchTerm) {
      setSearchResults(posts);
      setSearchValue('');
      return;
    }
    // 검색어 필터링
    const filteredResults = posts.filter(post => {
      return post.title.toLowerCase().includes(searchTerm);
    });

    setSearchResults(filteredResults.length > 0 ? filteredResults : []);

    // 검색한 단어와 일치하는 게시물 없을 때 alert 창 띄우기
    if (filteredResults.length === 0) {
      Swal.fire('일치하는 게시물이 없습니다.');
    }

    setSearchValue('');
  };

  return (
    <div>
      <form className="flex justify-center items-center my-[80px]" onSubmit={searchInputValue}>
        <input
          type="text"
          className="w-[800px] h-12 bg-white rounded-xl text-[#666] border-1 border-[#0051ffb1] p-4"
          placeholder="검색어를 입력해주세요"
          value={searchValue}
          onChange={onChangeHandler}
        />
      </form>
    </div>
  );
}
