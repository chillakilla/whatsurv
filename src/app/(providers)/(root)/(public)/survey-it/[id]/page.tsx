'use client';

import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';

import {useParams} from 'next/navigation';
import React from 'react';
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
    return <div>Error fetching post data</div>;
  }

  const createdAtDate = post?.createdAt.toDate() as Date;
  const deadlineDate = post?.deadlineDate?.toDate() as Date;

  return (
    <div className="container h-[940px] w-[80rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="title-area flex items-center bg-[#eee] h-20">
        <h1 className="text-xl font-bold ">{post?.title}</h1>
      </div>
      <div className="progress-bar w-full h-52 bg-gray-200 grid grid-cols-4 items-center p-4 mt-4"></div>
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
      </div>
    </div>
  );
};

export default SurveyItDetailPage;
