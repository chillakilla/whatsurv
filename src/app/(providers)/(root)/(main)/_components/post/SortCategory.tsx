import {getPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import Link from 'next/link';
import {Category} from '../../../(private)/create-post/_components/categories';

type Message = {
  condition: boolean;
  text: string;
};

type SortingCategoryProps = {
  categories: Category[];
  onCategorySelect: (category: string) => void;
  selectCategory: string;

  setFilteredPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export default function SortCategory({
  categories,
  onCategorySelect,
  selectCategory,

  setFilteredPosts,
}: SortingCategoryProps) {
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

  // 게시물 정렬하기 (최신순, 인기순, 마감 임박순)

  const filterByCategory = (selectedCategory: string) => {
    // 필터링 할 카테고리
    const filterCategory = selectedCategory.trim();

    // 카테고리가 '전체'일 때, 모든 게시물 보여주기
    if (filterCategory === '전체') {
      return posts || [];
    }

    // 카테고리 필터링
    const filteredPosts = posts?.filter(post => {
      return post.category === filterCategory;
    });

    return filteredPosts || [];
  };

  useEffect(() => {
    const filteredPosts = filterByCategory(selectCategory);
    setFilteredPosts(filteredPosts);
  }, [selectCategory, posts, setFilteredPosts]);

  return (
    <>
      <div className="flex mb-10 justify-between border-b-2 border-[#eee]">
        <div className="category flex gap-8">
          {categories.map(category => (
            <button
              key={category.label}
              onClick={() => onCategorySelect(category.label)}
              className={`${selectCategory === category.value ? 'border-b-2 border-[#0051FF] text-[#0051FF]' : ''}`}
            >
              {category.value}
            </button>
          ))}
        </div>
        <Link href={`/create-post`}>
          <button className="h-[30px] text-xs w-[80px] border-1 bg-[#0051ff] text-white rounded-md">설문 만들기</button>
        </Link>
      </div>
    </>
  );
}
