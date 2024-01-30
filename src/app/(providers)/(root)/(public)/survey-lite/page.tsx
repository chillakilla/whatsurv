'use client';

import {deleteliteSurveyPostById, getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {litePost} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useState} from 'react';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';
import {LuPencilLine} from 'react-icons/lu';
import Swal from 'sweetalert2';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/modal/CreateModal';
import LiteSurveyModal from '../../(main)/_components/modal/SurveyModal';
import UpdateModal from '../../(main)/_components/modal/UpdateModal';

export default function SurveyLitePage() {
  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [menuStates, setMenuStates] = useState<{[postId: string]: boolean}>({});
  const [editingPost, setEditingPost] = useState<litePost | null>(null);
  const [likedPosts, setLikedPosts] = useState<{[postId: string]: boolean}>({});

  const user = auth.currentUser;
  const userId = user?.uid;

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

  // 게시물 조회수
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
    if (!user) {
      Swal.fire('로그인 회원만 이용 가능합니다.', '', 'warning');
    } else {
      setSelectedPost(litepost);
      updateViewsCount(litepost.id); // 'views' 카운트를 업데이트하는 함수 호출
    }
  };

  // 게시물 모달창 닫기
  const onCloseModalHandler = () => {
    setSelectedPost(null);
  };

  // 게시물 작성 모달창 열기
  const onClickCreateModalOpen = () => {
    if (!user) {
      Swal.fire({
        title: '로그인이 필요합니다.',
        confirmButtonColor: '#0051FF',
        icon: 'error',
      });
    } else {
      setIsCreateModalOpen(true);
    }
  };

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

  // 게시물 수정하기
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

      // 모달 닫기 및 데이터 리프레
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
          confirmButtonColor: '#0051FF',
        });
        refetch();
      } catch (error) {
        console.log('게시물 삭제중 오류 발생', error);
      }
    }
  };

  // 새로운 게시물 알려주기
  const isWithin24Hours = (createdAt: Date): boolean => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  // 좋아요 카운트 firebase에 저장하기
  const updateLikesCount = async (postId: string, increment: number) => {
    try {
      const postRef = doc(db, 'litesurveyposts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentLikes = postSnapshot.data().likes || 0;
        await updateDoc(postRef, {
          likes: currentLikes + increment, // 좋아요 수 업데이트
        });
      } else {
        console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
      }
    } catch (error) {
      console.error('Likes 카운트 업데이트 중 오류:', error);
    }
  };

  // 좋아요 버튼의 상태를 토글하기 위한 함수
  const toggleLikesButton = async (postId: string) => {
    if (!user) {
      return;
    }

    if (likedPosts[postId]) {
      // 사용자가 이미 좋아요를 누른 상태에서 다시 클릭한 경우
      await updateLikesCount(postId, -1); // 좋아요 수 감소
      setLikedPosts({...likedPosts, [postId]: false}); // 해당 게시물의 좋아요 상태 변경
    } else {
      // 사용자가 좋아요를 처음 누른 경우
      await updateLikesCount(postId, 1); // 좋아요 수 증가
      setLikedPosts({...likedPosts, [postId]: true}); // 해당 게시물의 좋아요 상태 변경
    }
    refetch(); // 데이터 리프레시
  };

  return (
    <>
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <div className="my-20">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">참여해 Surv?</h1>
            {isLoading && <div>로딩 중...</div>}
            {isError && <div>로딩 중에 오류가 발생했습니다.</div>}
            <button onClick={onClickCreateModalOpen}>작성 하기</button>
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
                              {/* <p className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                                Lite
                              </p> */}
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
                                {userId === litepost.userId && (menuStates[litepost.id] ? 'X' : '⁝')}
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
                            <button
                              onClick={() => {
                                if (user) {
                                  toggleLikesButton(litepost.id);
                                  // 좋아요 상태를 토글할 때마다 아이콘 변경
                                  setLikedPosts(prevLikedPosts => ({
                                    ...prevLikedPosts,
                                    [litepost.id]: !prevLikedPosts[litepost.id], // 좋아요 상태 토글
                                  }));
                                }
                              }}
                              aria-label="like-button"
                              className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF] bg-transparent"
                            >
                              {litepost.likes} {likedPosts[litepost.id] ? <FaHeart /> : <FaRegHeart />}
                            </button>
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
