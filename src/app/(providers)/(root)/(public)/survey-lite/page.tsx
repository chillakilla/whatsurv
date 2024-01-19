'use client';
import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {IoEyeOutline} from 'react-icons/io5';
import {LuPencilLine} from 'react-icons/lu';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/modal/CreateModal';
import LiteSurveyModal from '../../(main)/_components/modal/SurveyModal';
import Tab from '../../_components/Tab';
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
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState({
    name: searchParams.get('tab') || 'IT',
    to: '/',
  });

  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const updateViewsCount = async (postId: string) => {
    try {
      const postRef = doc(db, 'litesurveyposts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;
        await updateDoc(postRef, {
          views: currentViews + 1, // 'views' 카운트 증가
        });
      } else {
        console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
      }
    } catch (error) {
      console.error('Views 카운트 업데이트 중 오류:', error);
    }
  };

  // 게시물 클릭을 처리하는 함수
  const onClickPosthandler = (litepost: litePost) => {
    setSelectedPost(litepost);
    updateViewsCount(litepost.id); // 'views' 카운트를 업데이트하는 함수 호출
  };

  // 게시물 모달창 닫기
  const onCloseModalHandler = () => {
    setSelectedPost(null);
  };

  // 게시물 작성 모달창 열기
  const onClickCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  // FirebaseApi에서 liteSurveyData 가져오기
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
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto">
        <Banner />
        <div className="my-20">
          <div>
            <h1 className="text-2xl font-bold mb-4">Lite한 설문조사</h1>
            {isLoading && <div>로딩 중...</div>}
            {isError && <div>로딩 중에 오류가 발생했습니다.</div>}
          </div>
          <div>
            <div>
              {liteSurveyData && liteSurveyData.length > 0 ? (
                <div className="post-container grid grid-cols-4 gap-4">
                  {liteSurveyData?.map(litepost => (
                    <div key={litepost.id}>
                      <div className="h-[13.4375rem] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4">
                        <a onClick={() => onClickPosthandler(litepost)} className="cursor-pointer">
                          <div className="top-content h-[5.625rem]">
                            <div className="flex justify-between items-center mb-4">
                              <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                                Lite
                              </div>
                              <button className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF] bg-transparent">
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
                            <div className="flex justify-between items-center mt-[3.125rem] w-full border-t-1 ">
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
