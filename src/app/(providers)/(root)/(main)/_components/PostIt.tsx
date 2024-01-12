import {fetchPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import {Button} from '@nextui-org/react';
import {FaRegHeart} from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';
import Paging from './Paging';
import SortingPost from './SortingPost';
import FloatingBtn from './FloatingBtn';

export default function PostIt() {
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

  return (
    <div>
      <div className="title-box flex justify-between items-center gap-12 mb-4">
        <div className="flex w-48 items-center">
          <h2 className="font-bold text-xl w-[80px] ">IT 전체</h2>
          <Link href="/survey_it" className="text-sm text-[#666]">
            자세히 보기
          </Link>
        </div>
        <SortingPost />
      </div>
      <div className="post-container grid grid-cols-4 gap-4">
        {posts.map(post => (
          <Link href="#" key={post.id}>
            <div className=" h-72 border-2 border-[#eee] rounded-xl p-2">
              <div className="bg-[#0051FF] text-white w-20 text-center rounded-lg font-semibold text-sm mb-[10px]">
                {post.category}
              </div>
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="text-[#333] text-md">{post.content}</p>
              <img src={post.imageUrl} alt="Post Image" className="w-full h-32 rounded-md" />
              <p className="text-xs text-[#666]">
                작성일 |{' '}
                {post.createdAt.toDate().toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
              </p>
              <Button isIconOnly color="danger" aria-label="Like" className="w-[50px] h-[20px] flex justify-evenly">
                <FaRegHeart />
                {post.likes}
              </Button>
            </div>
          </Link>
        ))}
      </div>
      {/* <Paging /> */}
      <FloatingBtn />
    </div>
  );
}
