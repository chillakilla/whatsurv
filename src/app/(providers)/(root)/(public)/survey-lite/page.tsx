'use client';

import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/lietsurvey/CreatModal';
import LiteSurveyModal from '../../(main)/_components/lietsurvey/Modal';

export default function page() {
  const router = useRouter();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const onClickCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const {
    data: liteSurveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['surveyData'],
    queryFn: getLiteSurveyPosts,
  });

  return (
    <>
      <div className="flex-col items-center justify-center">
        <Banner />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Lite한 설문조사</h1>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error fetching survey data</div>}
          {liteSurveyData && liteSurveyData.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {liteSurveyData?.map(post => (
                <li key={post.id} className="h-36 border-2 border-[#eee] rounded-xl p-2">
                  <a onClick={() => handlePostClick(post)} className="cursor-pointer">
                    <div className="category-box flex justify-between items-center">
                      <p className="bg-[#0051FF] text-[#D6FF00] w-12 p-1 text-center rounded-full font-semibold text-xs"></p>
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
                      작성일 |{' '}
                      {post.createdAt.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                    </p>
                    <img src={post.imageUrl} alt="Post Image" />
                    <p className="text-sm font-bold">{post.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div>설문조사 목록이 없습니다.</div>
          )}
          {selectedPost && (
            <LiteSurveyModal post={selectedPost} contents={selectedPost.contents} onClose={handleCloseModal} />
          )}
        </div>
        <Button onClick={onClickCreateModalOpen}>{'작성하기'}</Button>
        {isCreateModalOpen && <LiteSurveyCreateModal onCloseModal={() => setIsCreateModalOpen(false)} />}
      </div>
    </>
  );
}
