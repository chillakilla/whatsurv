'use client';
import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {useParams, useRouter} from 'next/navigation';
import React from 'react';
import ProgressBar from '../../../(main)/_components/progress/ProgressBar';
import Swal from 'sweetalert2';
import {db} from '@/firebase';
import {collection} from 'firebase/firestore';

const SurveyItDetailPage: React.FC = () => {
  const {id} = useParams();
  const router = useRouter();

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
  console.log(post);

  const createdAtDate = post?.createdAt.toDate() as Date;
  const deadlineDate = post?.deadlineDate?.toDate() as Date;

  const cancelHandler = () => {
    Swal.fire({
      title: '취소하시겠습니까?',
      text: '작성한 내용은 저장되지 않습니다. 그래도 취소하시겠습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#0051FF',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',

      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('감사합니다. 다음에 또 이용해주세요!');
        router.replace('/');
      }
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: '제출하시겠습니까?',
      text: '작성하신 내용은 이후에 수정할 수 없습니다.',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#0051FF',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',

      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        Swal.fire('감사합니다. 다음에 또 이용해주세요!');
        router.replace('/');
      }
    });
  };

  return (
    <div className="container h-[1200px] w-[55rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="pl-4">
        <p className="text-xs text-[#888]">등록일 | {createdAtDate.toLocaleString()}</p>
      </div>
      <div className="title-area flex justify-between items-center border-b-1 border-[#eee]  h-24">
        <h1 className="text-2xl font-bold w-2/3 h-24 flex items-center p-4">{post?.title}</h1>
        <div className="survey-method  h-24 bg-slate-100 text-sm items-center grid grid-cols-2 p-2">
          <p className="w-36">
            분야 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? `${post.category}` : '-'}</span>
          </p>
          <p className="w-36">
            카테고리 &nbsp; <span className="text-[#0051FF]">프론트엔드</span>
          </p>
          <p className="w-36">
            참여 대상 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? post.sexType : '전체'}</span>
          </p>
          <p className="w-36">
            참여 연령 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? post.ageGroup : '전체'}</span>
          </p>
          <p className="w-36">
            소요 시간 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? `${post.researchTime}` : '-'}</span>
          </p>
          <p className="w-36">
            설문 방식 &nbsp;{' '}
            <span className="text-[#0051FF]"> {post !== null && post !== undefined ? post.researchType : '-'}</span>
          </p>
        </div>
      </div>
      <div className="survey-explain h-24 p-2 border-1 border-[#eee] mt-4">{post?.content}</div>
      <div className="progress-bar flex justify-center w-full h-[35px] mt-6 ">
        <ProgressBar />
      </div>
      <form
        className="flex flex-col justify-between p-2 h-[850px] mt-4 border-1 border-[#eee]"
        onSubmit={submitHandler}
      >
        <div className="survey-data"></div>

        <div className="flex ml-auto p-4 w-56 justify-end gap-4">
          <button className="w-[80px] h-8 bg-[#eee]" onClick={cancelHandler}>
            취소
          </button>
          <button className="w-[80px] h-8 bg-[#0051FF] text-white" type="submit">
            제출
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyItDetailPage;
