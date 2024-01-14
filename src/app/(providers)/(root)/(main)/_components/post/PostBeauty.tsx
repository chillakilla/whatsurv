import {fetchPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import {Button} from '@nextui-org/react';
import {FaRegHeart} from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';

export default function PostBeauty() {
  const target = 'Beauty';
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
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

  const hasPosts = posts.some(post => post.category === target);

  return (
    <div className="my-20">
      <div className="title-box flex justify-between items-center gap-12 mb-4">
        <h2 className="font-bold text-xl w-[150px] ">Beauty 전체</h2>
        <Link href="/survey_it" className="font-bold text-lg text-[#0051FF]">
          더보기
        </Link>
      </div>
      <div className="post-container grid grid-cols-4 gap-4">
        {hasPosts ? (
          posts
            .slice(0, 4)
            .filter(post => post.category === target)
            .map(post => (
              <Link href="#" key={post.id}>
                <div className="h-72 border-2 border-[#eee] rounded-xl p-2">
                  <div className="bg-[#D6FF00] text-[#0051FF] w-16 p-1 text-center rounded-lg font-semibold text-sm mb-[10px]">
                    {post.category}
                  </div>
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-[#333] text-md">{post.content}</p>
                  <p className="text-xs text-[#666]">
                    작성일 |{' '}
                    {post.createdAt
                      .toDate()
                      .toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                  </p>
                  <Button
                    isIconOnly
                    aria-label="Like"
                    className="w-[50px] h-[20px] flex justify-evenly bg-[#0051FF] text-white"
                  >
                    <FaRegHeart />
                    {post.likes}
                  </Button>
                </div>
              </Link>
            ))
        ) : (
          <div>등록된 게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
