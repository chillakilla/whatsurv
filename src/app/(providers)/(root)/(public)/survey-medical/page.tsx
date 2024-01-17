'use client';

import {getPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {FaRegHeart} from 'react-icons/fa';

export default function SurveyItPage() {
  const router = useRouter();

  const {
    data: surveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['surveyData'],
    queryFn: getPosts,
  });

  const selectedCategory = 'Medical';

  const filteredSurveyData = surveyData?.filter(post => post.category === selectedCategory) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical 설문조사</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching survey data</div>}
      {filteredSurveyData.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSurveyData.map(post => (
            <li key={post.id} className="h-36 border-2 border-[#eee] rounded-xl p-2">
              <a onClick={() => router.push(`/survey-medical/${post.id}`)} className="cursor-pointer">
                <div className="category-box flex justify-between items-center">
                  <p className="bg-[#0051FF] text-[#D6FF00] w-12 p-1 text-center rounded-full font-semibold text-xs">
                    {post.category}
                  </p>
                  <Button
                    isIconOnly
                    aria-label="Like"
                    className="w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent"
                  >
                    <FaRegHeart />
                  </Button>
                </div>
                <p className="text-xs text-[#666] my-">
                  {' '}
                  작성일 | {post.createdAt.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                </p>
                {/* <img src={post.imageUrl} alt="Post Image" /> */}
                <p className="text-[15px] font-bold">
                  {post.title.length > 47 ? `${post.title.substring(0, 47)}...` : post.title}
                </p>
                <p className="mt-2">{post.likes}</p>
                <p>작성자</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div> 설문조사 목록이 없습니다. </div>
      )}
    </div>
  );
}
