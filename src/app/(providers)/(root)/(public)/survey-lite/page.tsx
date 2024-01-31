'use client';

import {deleteliteSurveyPostById, getLiteSurveyPosts, updateLikesCount} from '@/app/api/litepagefirbaseApi';
import {litePost} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {LuPencilLine} from 'react-icons/lu';
import Swal from 'sweetalert2';
import Banner from '../../(main)/_components/carousel/Banner';
import LiteSurveyCreateModal from '../../(main)/_components/modal/CreateModal';
import LiteSurveyModal from '../../(main)/_components/modal/SurveyModal';
import UpdateModal from '../../(main)/_components/modal/UpdateModal';
import LitePostComponent from './_components/LitePostComponent';

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

  // 좋아하는 게시물을 서브컬렉션으로 저장하기
  const updateLikedPostsSubcollection = async (userId: string, postId: string, isLiked: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      const likedPostsRef = collection(userRef, 'likedPosts'); // likedPosts 서브컬렉션에 대한 참조

      // 사용자가 게시물을 좋아하거나 좋아요를 취소할 때 해당 게시물을 likedPosts 서브컬렉션에 추가 또는 제거
      if (isLiked) {
        await setDoc(doc(likedPostsRef, postId), {liked: true}); // 게시물을 좋아하는 경우
      } else {
        await deleteDoc(doc(likedPostsRef, postId)); // 좋아요를 취소하는 경우
      }
    } catch (error) {
      console.error('좋아하는 게시물 서브컬렉션 업데이트 중 오류:', error);
    }
  };

  // 좋아요 버튼 구현하는 함수
  const onClickLikedPostHandler = async (postId: string) => {
    if (!user) {
      return;
    }
    if (userId) {
      try {
        // 좋아요 수 카운트 함수
        await updateLikesCount(postId, userId, likedPosts);

        // 사용자 문서 업데이트: 좋아하는 게시물의 ID를 업데이트합니다.
        await updateLikedPostsSubcollection(userId, postId, !likedPosts[postId]);

        // likedPosts 상태 업데이트
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: !prevState[postId],
        }));
      } catch (error) {
        console.error('좋아요 수 업데이트 중 오류:', error);
      }
      refetch();
    }
  };

  // 좋아요 버튼 누른 게시물 가져오는 함수
  const getLikedPosts = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const likedPostsRef = collection(userRef, 'likedPosts');
      const likedPostsSnapshot = await getDocs(likedPostsRef);

      const likedPosts: {[postId: string]: boolean} = {};
      likedPostsSnapshot.forEach(doc => {
        likedPosts[doc.id] = true;
      });

      setLikedPosts(likedPosts);
    } catch (error) {
      console.error('좋아하는 게시물을 가져오는 중 오류 발생:', error);
    }
  };

  // 좋아요 버튼 누른 게시물 화면에 적용시키는 함수
  useEffect(() => {
    if (userId) {
      getLikedPosts(userId);
    }
  }, [userId]);

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
                    <LitePostComponent
                      key={litepost.id}
                      litepost={litepost}
                      onClickPosthandler={onClickPosthandler}
                      onClickUpdateDeleteMenuToggle={onClickUpdateDeleteMenuToggle}
                      onClickUpdateButton={onClickUpdateButton}
                      onClickDeleteButton={onClickDeleteButton}
                      onClickLikedPostHandler={onClickLikedPostHandler}
                      likedPosts={likedPosts}
                      menuStates={menuStates}
                    />
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
