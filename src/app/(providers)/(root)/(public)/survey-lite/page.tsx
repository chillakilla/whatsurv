'use client';
import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/lietsurvey/CreatModal';
import LiteSurveyModal from '../../(main)/_components/lietsurvey/Modal';
import {BsPencilSquare} from 'react-icons/bs';
import {FaRegCircleUser} from 'react-icons/fa6';

const isWithin24Hours = (createdAt: Date): boolean => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - createdAt.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference <= 24;
};

export default function page() {
  const router = useRouter();

  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePostClick = (litepost: litePost) => {
    setSelectedPost(litepost);
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
  } = useQuery<litePost[]>({
    queryKey: ['surveyData'],
    queryFn: getLiteSurveyPosts,
  });

  useEffect(() => {
    refetch(); // new 키워드의 기준
  }, []);

  return (
    <>
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto">
        <Banner />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Lite한 설문조사</h1>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error fetching survey data</div>}
          {liteSurveyData && liteSurveyData.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {liteSurveyData?.map(litepost => (
                <li
                  key={litepost.id}
                  className="h-[215px] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4"
                >
                  <a onClick={() => handlePostClick(litepost)} className="cursor-pointer">
                    <div className="category-box flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <p className="bg-[#0051FF] text-[#D6FF00] w-12 p-1 text-center rounded-full font-semibold text-xs">
                          Lite
                        </p>
                        <p className="bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs">
                          {isWithin24Hours(litepost.createdAt) ? 'New🔥' : ''}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        aria-label="Like"
                        className="like-button w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent"
                      >
                        <FaRegHeart />
                      </Button>
                    </div>
                    <p className="text-xs text-[#666] my-">
                      {' '}
                      작성일 |{' '}
                      {litepost.createdAt.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                    </p>
                    <p className="text-lg font-bold">{litepost.title}</p>
                  </a>
                  <div className="bottom-content flex items-end  ">
                    <div className="flex justify-between items-center mt-[50px] w-full border-t-1 ">
                      <div className="user flex mt-4 gap-2">
                        <FaRegCircleUser />
                        <p className="font-semibold">작성자 닉네임</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div>설문조사 목록이 없습니다.</div>
          )}
          {selectedPost && (
            <LiteSurveyModal
              litepost={selectedPost}
              contents={selectedPost.contents}
              images={selectedPost.images}
              onClose={handleCloseModal}
            />
          )}
        </div>
        <div className="flex justify-end sticky bottom-10">
          <Button
            onClick={onClickCreateModalOpen}
            className="w-[50px] h-[50px] p-0 rounded-full text-lg text-[#0051FF] bg-white shadow-md shadow-[#888]"
          >
            <BsPencilSquare />
          </Button>
        </div>
        {isCreateModalOpen && <LiteSurveyCreateModal onCloseModal={() => setIsCreateModalOpen(false)} />}
      </div>
    </>
  );
}
