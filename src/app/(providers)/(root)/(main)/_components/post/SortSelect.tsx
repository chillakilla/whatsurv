import React from 'react';
import {Post} from '@/app/api/typePost';

type SortingSelectProps = {
  filteredPosts: Post[];
  sortOptions: string;
  setSortOptions: React.Dispatch<React.SetStateAction<string>>;
  setFilteredPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export default function SortSelect({filteredPosts, sortOptions, setSortOptions, setFilteredPosts}: SortingSelectProps) {
  const isDeadlinePast = (deadline: any) => {
    if (!deadline || deadline === 'No deadline') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정하여 오늘 날짜만 비교
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

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
      case 'deadline':
        setFilteredPosts(
          filteredPosts?.slice().sort((a, b) => {
            // 먼저 마감일이 지났는지 확인
            const isAPastDeadline = isDeadlinePast(a.deadline);
            const isBPastDeadline = isDeadlinePast(b.deadline);

            // 마감일이 지났으면 뒤로 정렬, 아니면 views로 정렬
            if (isAPastDeadline && !isBPastDeadline) {
              return 1;
            } else if (!isAPastDeadline && isBPastDeadline) {
              return -1;
            } else {
              // 마감일이 지나지 않은 경우 views로 정렬
              return b.views - a.views;
            }
          }) || [],
        );
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
        <option value="deadline" className="text-black">
          마감일순
        </option>
      </select>
    </div>
  );
}
