'use client';

import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {IoEyeOutline} from 'react-icons/io5';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/lietsurvey/CreatModal';
import LiteSurveyModal from '../../(main)/_components/lietsurvey/SurveyModal';
import PostBeauty from '../../(main)/_components/post/PostBeauty';
import Tab from '../../_components/Tab';
import PostIt from '../survey-it/page';
import PostMedi from '../survey-medical/page';
export default function page() {
  const [selectedTab, setSelectedTab] = useState<string>('IT');
  const renderContent = () => {
    switch (selectedTab) {
      case 'IT':
        return <PostIt />;
      case 'BEAUTY':
        return <PostBeauty />;
      case 'MEDICAL':
        return <PostMedi />;
      default:
        return <PostIt />;
    }
  };
  const router = useRouter();

  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const onClickPosthandler = (litepost: litePost) => {
    setSelectedPost(litepost);
  };

  const onCloseModalHandler = () => {
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

  return (
    <>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <div className="my-20">
          <div>
            <h1 className="text-2xl font-bold mb-4">Lite한 설문조사</h1>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error fetching survey data</div>}
          </div>
          <div>
            <div>
              {liteSurveyData && liteSurveyData.length > 0 ? (
                <div className="post-container grid grid-cols-4 gap-4">
                  {liteSurveyData?.map(litepost => (
                    <div key={litepost.id}>
                      <div className="h-[215px] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4">
                        <a onClick={() => onClickPosthandler(litepost)} className="cursor-pointer">
                          <div className="top-content h-[90px]">
                            <div className="category-box flex justify-between items-center mb-4">
                              <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                                Lite
                              </div>
                              <button className="like-button w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                                <FaRegHeart />
                              </button>
                            </div>
                            <p className="text-xs text-[#666] mb-4">
                              마감일 |{' '}
                              {litepost.deadlineDate
                                ? litepost.deadlineDate.toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                  })
                                : '2099.12.31'}
                            </p>
                            <h3 className="text-lg font-bold">{litepost.title}</h3>
                          </div>
                          <div className="bottom-content flex items-end">
                            <div className="flex justify-between items-center mt-[50px] w-full border-t-1 ">
                              <div className="user flex mt-4 gap-2">
                                <FaRegCircleUser />
                                <p className="font-semibold">작성자 닉네임</p>
                              </div>
                              <div className="viewer flex mt-4 gap-2 text-[#818490]">
                                <IoEyeOutline />
                                {litepost.views}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>설문조사 목록이 없습니다.</div>
              )}
            </div>
            {selectedPost && (
              <LiteSurveyModal
                litepost={selectedPost}
                contents={selectedPost.contents}
                images={selectedPost.images}
                onClose={onCloseModalHandler}
              />
            )}
            <Button onClick={onClickCreateModalOpen}>{'작성하기'}</Button>
            {isCreateModalOpen && <LiteSurveyCreateModal onCloseCreateModal={() => setIsCreateModalOpen(false)} />}
          </div>
        </div>
      </div>
    </>
  );
}
