'use client';

import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {useParams} from 'next/navigation';
import {FaRegHeart} from 'react-icons/fa';

export default function SurveyItDetailPage() {
  // URL에서 'id' 매개변수를 가져옵니다.
  const {id} = useParams();

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post | null, Error>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching post data</div>;
  }

  return (
    <div className="container  w-[88rem] m-auto mt-20 border-1 border-[#C1C5CC] p-4">
      <div className="condition-box w-[35rem] h-52 bg-gray-200 flex">
        <div className="age-box flex-col">
          <p>연령</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-24">2030</p>
        </div>
        <div className="gender-box">
          <p>성별</p>
          <p>남성</p>
        </div>
        <div className="category-box">
          <p>카테고리</p>
          <p>IT</p>
        </div>
        <div className="process-box">
          <p>진행방식</p>
          <p>온라인</p>
        </div>
        <div className="type-box">
          <p>유형</p>
          <p>설문조사</p>
        </div>
        <div className="deadline-box">
          <p>마감일</p>
          <p>2024.03.01</p>
        </div>
      </div>
      <div className="content-box">
        <h1>{post?.title}</h1>
        <p>{post?.content}</p>
      </div>

      <div className="flex items-center justify-end">
        <button className="like-button w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent">
          <FaRegHeart />
        </button>
        <p>{post?.likes}</p>
      </div>
    </div>
  );
}
