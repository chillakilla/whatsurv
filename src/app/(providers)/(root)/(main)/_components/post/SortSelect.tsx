import React from 'react';
import {Post} from '@/app/api/typePost';

type SortingSelectProps = {
  filteredPosts: Post[];
  sortOptions: string;
  setSortOptions: React.Dispatch<React.SetStateAction<string>>;
  setFilteredPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export default function SortSelect({filteredPosts, sortOptions, setSortOptions, setFilteredPosts}: SortingSelectProps) {
  const changeOptionValueHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    // 카테고리가 변경될 때 정렬 조건을 '정렬'로 초기화
    if (selectedValue !== 'latest' && selectedValue !== 'popular') {
      setSortOptions('');
    } else {
      setSortOptions(selectedValue);
    }

    switch (selectedValue) {
      case 'latest':
        setFilteredPosts(
          filteredPosts?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) ||
            [],
        );
        break;
      case 'popular':
        setFilteredPosts(filteredPosts?.slice().sort((a, b) => b.views - a.views) || []);
        break;
      default:
        setFilteredPosts(filteredPosts || []);
    }
  };
  return (
    <div className="sort-post">
      <select className={`bg-transparent outline-none `} value={sortOptions} onChange={changeOptionValueHandler}>
        <option value="sortBy" className="text-black">
          정렬
        </option>
        <option value="latest" className="text-black">
          최신순
        </option>
        <option value="popular" className="text-black">
          인기순
        </option>
      </select>
    </div>
  );
}
