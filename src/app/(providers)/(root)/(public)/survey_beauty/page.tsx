'use client';

import {fetchPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';

export default function SurveyItPage() {
  const {
    data: surveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['surveyData'],
    queryFn: fetchPosts,
  });

  // Beauty 카테고리만 필터링 하도록 설정
  const selectedCategory = 'Beauty';

  const filteredSurveyData = surveyData?.filter(item => item.category === selectedCategory) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Beauty 설문조사</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching survey data</div>}
      {filteredSurveyData.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredSurveyData.map(item => (
            <li key={item.id} className="p-4 bg-gray-100 rounded shadow">
              <p className="text-lg font-bold mb-2">{item.category}</p>
              <p>{item.createdAt.toDate().toLocaleString()}</p>
              <p>{item.imageUrl}</p>
              <p className="text-lg font-semibold">{item.title}</p>
              <p>{item.content}</p>
              <p className="mt-2">{item.likes}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div> 설문조사 목록이 없습니다. </div>
      )}
    </div>
  );
}
