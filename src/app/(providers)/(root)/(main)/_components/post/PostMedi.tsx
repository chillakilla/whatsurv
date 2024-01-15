import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import {Button} from '@nextui-org/react';
import {FaRegHeart} from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';

export default function PostMedi() {
  const target = 'Medical';
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
  const hasPosts = posts.some(post => post.category === target);

  return (
    <div className="my-20">
      <div className="title-box flex justify-between items-center gap-12 mb-4">
        <h2 className="font-bold text-xl w-[150px] ">Medical 전체</h2>
        <Link href="/survey-medical" className="font-bold text-lg text-[#0051FF]">
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
                <div className="h-36 border-2 border-[#eee] rounded-xl p-2">
                  <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs mb-[10px]">
                    {post.category}
                  </div>
                  <p className="text-xs text-[#666]">
                    마감일 |{' '}
                    {post.deadlineDate.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                  </p>
                  <h3 className="text-lg font-bold">{post.title}</h3>

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
