import {getPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import {Category} from '../../../(private)/create-post/_components/categories';

type Message = {
  condition: boolean;
  text: string;
};

type SortingPostProps = {
  categories: Category[];
  onCategorySelect: (category: string) => void;
  selectCategory: string;
  setFilteredPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export default function SortingPost({
  categories,
  onCategorySelect,
  selectCategory,
  setFilteredPosts,
}: SortingPostProps) {
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

  const filterByCategory = (selectedCategory: string) => {
    // 필터링 할 카테고리
    const filterCategory = selectedCategory.trim();

    // 카테고리가 '전체'일 때, 모든 게시물 보여주기
    if (filterCategory === '전체') {
      setFilteredPosts(posts || []);
      return;
    }

    // 카테고리 필터링
    const filteredPosts = posts?.filter(post => {
      return post.category === filterCategory;
    });

    setFilteredPosts(filteredPosts || []);

    if (filteredPosts?.length === 0) {
      return <p>현재 등록된 게시물이 없습니다.</p>;
    }
  };

  useEffect(() => {
    filterByCategory(selectCategory);
  }, [selectCategory, posts, setFilteredPosts]);

  return (
    <>
      <div className="flex mb-10 justify-between border-b-2 border-[#eee]">
        <div className="category flex gap-8">
          {categories.slice(1).map(category => (
            <button
              key={category.label}
              onClick={() => onCategorySelect(category.label)}
              className={`${selectCategory === category.value ? 'border-b-2 border-[#0051FF] text-[#0051FF]' : ''}`}
            >
              {category.value}
            </button>
          ))}
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
