'use client';

import {deleteliteSurveyPostById, getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';
import {LuPencilLine} from 'react-icons/lu';
import Swal from 'sweetalert2';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/modal/CreateModal';
import LiteSurveyModal from '../../(main)/_components/modal/SurveyModal';
import UpdateModal from '../../(main)/_components/modal/UpdateModal';

// 새로운 게시물 알려주기
const isWithin24Hours = (createdAt: Date): boolean => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - createdAt.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference <= 24;
};

export default function page() {
  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [menuStates, setMenuStates] = useState<{[postId: string]: boolean}>({});
  const [editingPost, setEditingPost] = useState<litePost | null>(null);

  const user = auth.currentUser;
  const userId = user?.uid;

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

  // 수정, 삭제 토글버튼
  const onClickUpdateDeleteMenuToggle = (postId: string) => {
    setMenuStates(prevStates => ({
      ...prevStates,
      [postId]: !prevStates[postId],
    }));
  };

  const onClickUpdateButton = (postId: string) => {
    if (!liteSurveyData) {
      return;
    }
    const postToEdit = liteSurveyData.find(litepost => litepost.id === postId);
    setEditingPost(postToEdit || null);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateLiteSurveyPost = async (updatedData: {title: string; contents: string[]; images: string[]}) => {
    try {
      // 수정할 게시물의 ID를 가져옵니다.
      const postId = editingPost?.id;

      // 게시물 수정 함수 호출
      if (postId) {
        await handleUpdateLiteSurveyPost(updatedData);
      }

      // 모달 닫기 및 데이터 리프레시
      setIsUpdateModalOpen(false);
      await refetch();
    } catch (error) {
      console.error('LiteSurvey 게시물을 업데이트하는 중 에러 발생:', error);
    }
  };

  //삭제 버튼
  const onClickDeleteButton = async (postId: string) => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });
    if (result.isConfirmed) {
      try {
        await deleteliteSurveyPostById(postId);
        Swal.fire({
          title: '삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        });
        refetch();
      } catch (error) {
        console.log('게시물 삭제중 오류 발생', error);
      }
    }
  };

  return (
    <>
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
                              <button
                                className="toggle-menu w-8 h-7"
                                onClick={() => onClickUpdateDeleteMenuToggle(litepost.id)}
                              >
                                {userId === litepost.userId && (menuStates[litepost.id] ? '닫기' : '⁝')}
                              </button>
                              {menuStates[litepost.id] && (
                                <div className="gap-2">
                                  <button
                                    className="w-8 h-7 text-blue-800 hover:bg-gray-100"
                                    onClick={() => onClickUpdateButton(litepost.id)}
                                  >
                                    수정
                                  </button>
                                  <button
                                    className="w-8 h-7 text-red-500 hover:bg-gray-100"
                                    onClick={() => onClickDeleteButton(litepost.id)}
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex">
                              <button className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                                <FaRegHeart />
                              </button>
                            </div>
                          </div>
                          <a onClick={() => onClickPosthandler(litepost)} className="cursor-pointer">
                            <div className="flex justify-between">
                              <div>
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
                              </div>
                              {/* <p className="text-xs text-[#666] mb-4">
                                마감일 | {litepost.deadlineDate ? litepost.deadlineDate.toLocaleString() : '2099.12.31'}
                              </p> */}
                            </div>
                            <h3 className="text-lg font-bold">{litepost.title}</h3>
                          </a>
                        </div>
                        <div className="bottom-content flex items-end">
                          <div className="flex justify-between items-center mt-[3.125rem] w-full border-t-1 ">
                            <div className="user flex mt-4 gap-2">
                              <FaRegCircleUser />
                              <p className="font-semibold">{litepost.nickname}</p>
                            </div>
                            <div className="viewer flex mt-4 gap-2 text-[#818490]">
                              <GrView />
                              {litepost.views}
                            </div>
                          </div>
                        </div>
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
                className="w-[3.125rem] h-[3.125rem] rounded-full bg-gray-200"
              >
                <LuPencilLine />
              </Button>
            </div>
            {isCreateModalOpen && <LiteSurveyCreateModal onCloseCreateModal={() => setIsCreateModalOpen(false)} />}
            {editingPost && (
              <UpdateModal
                selectedPost={editingPost}
                onClose={() => setEditingPost(null)}
                onUpdate={handleUpdateLiteSurveyPost}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
