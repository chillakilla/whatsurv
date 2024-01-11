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

  return (
    <div>
      <h1>Survey Data</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching survey data</div>}
      {surveyData && (
        <ul>
          {surveyData.map(item => (
            <li key={item.id}>
              <p>{item.category}</p>
              <p>{item.createdAt.toDate().toLocaleString()}</p>
              <p>{item.imageUrl}</p>
              <p>{item.title}</p>
              <p>{item.content}</p>
              <p>{item.likes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
