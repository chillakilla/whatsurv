'use client';

import {getPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';

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

  // Beauty 카테고리만 필터링 하도록 설정
  const selectedCategory = 'Beauty';

  const filteredSurveyData = surveyData?.filter(post => post.category === selectedCategory) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Beauty 설문조사</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching survey data</div>}
      {filteredSurveyData.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSurveyData.map(post => (
            <li key={post.id} className="p-4 bg-gray-100 rounded shadow">
              <a onClick={() => router.push(`/survey-beauty/${post.id}`)} className="cursor-pointer">
                <p className="text-lg font-bold mb-2">{post.category}</p>
                <p>{post.createdAt.toLocaleString()}</p>
                <p>{post.imageUrl}</p>
                <p className="text-lg font-semibold">{post.title}</p>
                <p>{post.content}</p>
                <p className="mt-2">{post.likes}</p>
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
