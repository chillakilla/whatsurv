import {fetchPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import React from 'react';

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
      <h2 className="font-bold text-lg mb-[8px]">IT 전체</h2>
      <div className="post-container grid grid-cols-4">
        {posts.map(post => (
          <div key={post.id} className=" h-64 border-2 border-[#ddd] rounded-xl p-2 gap-4">
            <div className="bg-amber-300 w-20 text-center rounded-lg font-semibold text-sm mb-[10px]">
              {post.category}
            </div>
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-[#333] text-md">{post.content}</p>
            <img src={post.imageUrl} alt="Post Image" />
            <p className="text-xs text-[#666]">
              작성일 |{' '}
              {post.createdAt.toDate().toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
            </p>
            <p className="text-sm">Likes: {post.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
