'use client';

import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {useParams} from 'next/navigation';

export default function SurveyMedicalDetailPage() {
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

  const createdAtDate = post?.createdAt.toDate() as Date;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Post Detail Page</h1>
      <p>{post?.title}</p>
      <p>{createdAtDate.toLocaleString()}</p>
      <img src={post?.imageUrl} alt="Post Image" />
      <p>{post?.content}</p>
      <p className="mt-2">{post?.likes}</p>
    </div>
  );
}
