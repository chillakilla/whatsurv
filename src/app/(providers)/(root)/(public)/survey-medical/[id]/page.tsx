'use client';
import {getPostById, updateLikesCount} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {User, getAuth, onAuthStateChanged} from 'firebase/auth';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';

const DetailInfoBox = ({label, value}: {label: string; value: string | number}) => (
  <div className="type-box flex gap-2 justify-center items-center">
    <p className="text-sm font-semibold">{label}</p>
    <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">{value}</p>
  </div>
);

const SurveyItDetailPage: React.FC = () => {
  const {id} = useParams();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post | null, Error>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중 오류가 발생했습니다.</div>;
  }

  // 게시글을 작성한 유저 userId 비교 검사
  // 동일할 시에 renderEditDeleteButton 실행
  const isCurrentUser = user && post && user.uid === post.userId;
  const renderEditDeleteButton = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <button className="border border-sky-500 rounded-lg">수정</button>
        <button className="border border-sky-500 rounded-lg">삭제</button>
      </div>
    );
  };

  const createdAtDate = post?.createdAt.toDate() as Date;
  const deadlineDate = post?.deadlineDate?.toDate() as Date;

  // 좋아요 증가 핸들러
  // TODO: 다른 페이지에도 적용 필요
  const likeButtonHandler = async () => {
    if (user) {
      await updateLikesCount(id as string);
      console.log('likes up', updateLikesCount);
    } else {
      const loginConfirmed = window.confirm('로그인이 필요합니다. 로그인하시겠습니까?');
      if (loginConfirmed) {
        router.push('/auth');
      }
    }
  };

  return (
    <div className="container h-[940px] w-[88.5rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="flex justify-between items-center">
        <div className="bg-[#0051FF] text-[#D6FF00] w-24 p-1 text-center font-semibold text-lg">Medical</div>
        <button className="like-button flex  gap-2 text-[#0051FF] bg-transparent" onClick={likeButtonHandler}>
          <FaRegHeart />
          {post?.likes}
        </button>
      </div>
      <div className="border-b-1 border-[#d2d7e0] h-14 flex items-center p-2">
        <h1 className="text-xl font-bold ">{post?.title}</h1>
      </div>
      <div className="condition-box w-full h-52 bg-gray-200 grid grid-cols-4 items-center p-4 mt-4">
        <DetailInfoBox label="카테고리" value={post?.category || ''} />
        <DetailInfoBox label="연령" value={post?.ageGroup || ''} />
        <DetailInfoBox label="성별" value={post?.sexType || ''} />
        <DetailInfoBox label="소요 시간" value={post?.researchTime || ''} />
        <DetailInfoBox label="진행방식" value={post?.researchLocation || ''} />
        <DetailInfoBox label="유형" value={post?.researchType || ''} />
        <DetailInfoBox label="리워드" value={post?.rewards || ''} />
        <DetailInfoBox label="마감일" value={deadlineDate.toLocaleDateString()} />
      </div>
      <div className="flex justify-between items-center p-2 h-[40px] mt-4 border-b-1 border-[#eee]">
        <div className="user flex  gap-2">
          <FaRegCircleUser />
          <p className="font-semibold">작성자 닉네임</p>
        </div>
        <div>
          <p className="text-xs text-[#888]">작성일 | {createdAtDate.toLocaleString()}</p>
        </div>
      </div>
      <div className="content-box  mt-4 flex gap-8 h-[500px]">
        <div className="img-box w-[420px] h-full border-1 border-[#eee] flex items-center justify-center">
          <img src={post?.imageUrl} alt="Post Image" />
        </div>
        <div className="w-3/4 border-1 border-[#ddd] pl-4">
          <p className="h-[400px] mt-4">{post?.content}</p>
        </div>
        {/* 유저 로그인 상태에 따른 버튼 렌더링 */}
        {isCurrentUser && renderEditDeleteButton()}
      </div>
    </div>
  );
};

export default SurveyItDetailPage;
