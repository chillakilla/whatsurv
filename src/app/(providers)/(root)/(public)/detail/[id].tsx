// import {fetchPostDetail} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {NextPage} from 'next';
import {useRouter} from 'next/router';

const SurveyItDetailPage: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;

  const {
    data: surveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post>({
    queryKey: ['surveyItDetail', id],
    // queryFn: () => fetchPostById(id as string),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching IT survey detail</div>;

  if (!surveyData) {
    return <div>IT 설문조사 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1>IT Survey Detail Page for ID: {id}</h1>
      <p className="text-lg font-bold mb-2">{surveyData.category}</p>
    </div>
  );
};

export default SurveyItDetailPage;
