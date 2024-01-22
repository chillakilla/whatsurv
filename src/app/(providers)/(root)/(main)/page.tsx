// 'use client';

// import {useSearchParams} from 'next/navigation';
// import {useState} from 'react';

// import Tab from '../_components/Tab';
// import FloatingBtn from './_components/FloatingBtn';
// import Banner from './_components/carousel/Banner';
// import Popular from './_components/carousel/Popular';

// import SurveyPost from './_components/post/SurveyPost';

// export default function MainPage() {
//   const searchParams = useSearchParams();
//   const [selectedTab, setSelectedTab] = useState({
//     name: searchParams.get('tab') || 'LITE',
//     to: '/', // ?
//   });

//   return (
//     <div>
//       <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//       <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
//         <Banner />
//         <Popular />
//         <SurveyPost target={selectedTab.name} />
//         <FloatingBtn />
//       </div>
//     </div>
//   );
// }

// 1. IT, Beauty, Medical 을 메인 페이지 & Lite는 다른 페이지로 만든다
// 2. PostIT, PostBeauty, PostMedi 를 하나의 컴포넌트로 만든다
// 3. Lite 클릭 시 /survey-lite 페이지로 이동한다. (같은 페이지의 경우 이동 X)
// 4. IT, Beauty, Medical 클릭 시 / 페이지로 이동한다. (같은 페이지의 경우 이동 X)

'use client';
import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';
import {LuPencilLine} from 'react-icons/lu';
import Tab from '../_components/Tab';
import Banner from './_components/carousel/Banner';
import LiteSurveyCreateModal from './_components/modal/CreateModal';
import LiteSurveyModal from './_components/modal/SurveyModal';

// 새로운 게시물 알려주기
const isWithin24Hours = (createdAt: Date): boolean => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - createdAt.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference <= 24;
};

export default function page() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState({
    name: searchParams.get('tab') || 'LITE',
    to: '/',
  });

  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const user = auth.currentUser;

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
    if (!user) {
      window.alert('로그인이 필요합니다.');
    } else {
      setIsCreateModalOpen(true);
    }
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

  // 게시물 정렬하기
  const sortByCreatedAt = (a: litePost, b: litePost) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  };

  return (
    <>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
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
                  {liteSurveyData?.sort(sortByCreatedAt).map(litepost => (
                    <div key={litepost.id}>
                      <div className="h-[13.4375rem] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4">
                        <a onClick={() => onClickPosthandler(litepost)} className="cursor-pointer">
                          <div className="top-content h-[5.625rem]">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex gap-2">
                                <p className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                                  Lite
                                </p>
                                <p
                                  className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
                                    isWithin24Hours(litepost.createdAt) ? '' : 'hidden'
                                  }`}
                                >
                                  {isWithin24Hours(litepost.createdAt) ? 'New🔥' : ''}
                                </p>
                              </div>
                              <button className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                                <FaRegHeart />
                              </button>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-xs text-[#666] mb-4">
                                작성일 |{' '}
                                {litepost.createdAt
                                  ? litepost.createdAt.toLocaleString('ko-KR', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })
                                  : '2099.12.31'}
                              </p>
                              <p className="text-xs text-[#666] mb-4">
                                마감일 | {litepost.deadlineDate ? litepost.deadlineDate.toLocaleString() : '2099.12.31'}
                              </p>
                            </div>
                            <h3 className="text-lg font-bold">{litepost.title}</h3>
                          </div>
                          <div className="bottom-content flex items-end">
                            <div className="flex justify-between items-center mt-[3.125rem] w-full border-t-1 ">
                              <div className="user flex mt-4 gap-2">
                                <FaRegCircleUser />
                                <p className="font-semibold">작성자 닉네임</p>
                              </div>
                              <div className="viewer flex mt-4 gap-2 text-[#818490]">
                                <GrView />
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
                onCloseLiteSurveyModal={onCloseModalHandler}
              />
            )}
            <div className="flex justify-end sticky bottom-10">
              <Button
                onClick={onClickCreateModalOpen}
                isIconOnly
                aria-label="write-post"
                className="w-[3.125rem] h-[3.125rem] rounded-full text-lg text-[#0051FF] bg-white shadow-md shadow-[#888]"
              >
                <LuPencilLine />
              </Button>
            </div>
            {isCreateModalOpen && <LiteSurveyCreateModal onCloseCreateModal={() => setIsCreateModalOpen(false)} />}
          </div>
        </div>
      </div>
    </>
  );
}
