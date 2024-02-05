'use client';
import 'firebase/compat/firestore';
import Link from 'next/link';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {Tooltip} from '@nextui-org/react';
import firebase from 'firebase/compat/app';
import {BsFillQuestionCircleFill} from 'react-icons/bs';
import {Post, RenderPostProps} from '@/app/api/typePost';
import {IoPeopleSharp} from 'react-icons/io5';
import {useRouter} from 'next/navigation';
import Swal from 'sweetalert2';

export default function RenderPost({post, clickPostHandler, clickLikedButtonHandler, likedPosts}: RenderPostProps) {
  const router = useRouter();
  const isWithin24Hours = (createdAt: Date | firebase.firestore.Timestamp): boolean => {
    const currentTime = new Date();
    const createdAtDate = createdAt instanceof firebase.firestore.Timestamp ? createdAt.toDate() : createdAt;

    const timeDifference = currentTime.getTime() - createdAtDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 24;
  };

  const moveResultHandler = (post: Post) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      title: '구현 중인 기능입니다. 죄송합니다!',
    });
  };

  // 이미 참여한 설문 비활성화 함수

  return (
    <div className={`h-72 border-2 border-[#e1e1e1] flex flex-col justify-between rounded-xl p-4 bg-white `}>
      <div className="category-box flex justify-between items-center ">
        <div className="flex gap-2">
          <div className="bg-[#0051ff] text-[#D6FF00] h-[25px] w-[75px] p-1 text-center rounded-full font-semibold text-xs">
            {post.category}
          </div>
          <div
            className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
              post.views >= 40 ? 'block' : 'hidden'
            }`}
          >
            {post.views >= 40 ? 'HOT🔥' : ''}
          </div>
          <div
            className={`bg-[#0051ffb3] text-black w-14 p-1 text-center rounded-full font-md text-xs text-white ${
              isWithin24Hours(post.createdAt) ? 'block' : 'hidden'
            }`}
          >
            {isWithin24Hours(post.createdAt) ? 'NEW🔥' : ''}
          </div>
        </div>
        <button
          className="like-button w-[20px] h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent"
          onClick={() => clickLikedButtonHandler(post.id)}
        >
          {likedPosts[post.id] ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div>
        <p className="text-xs text-[#666]">등록일 {post.createdAt.toLocaleDateString()}</p>
        <h3 className="font-semibold text-lg text-ellipsis overflow-hidden  line-clamp-1 mb-2">{post.title}</h3>
      </div>
      <div className="survey-method flex flex-col gap-2 bg-slate-100 h-[70px] p-2  ">
        <div className="flex text-sm justify-start grid grid-cols-2 ">
          <p>
            <span className="text-[#666]">소요 시간</span> &nbsp; {post.researchTime}
          </p>
          <p>
            <span className="text-[#666]">설문 방식</span> &nbsp; {post.researchType}
          </p>
        </div>
        <div className="survey-method flex text-sm justify-start grid grid-cols-2">
          <p>
            <span className="text-[#666]">참여 연령</span> &nbsp; {post.ageGroup}
          </p>
          <p>
            <span className="text-[#666]">참여 대상</span> &nbsp; {post.sexType}
          </p>
        </div>
      </div>
      <div className=" flex justify-between items-center">
        <div className="flex items-center w-full justify-between">
          <p className="flex items-center gap-2 text-sm text-black">종료일 {post.deadline ? post.deadline : '--'}</p>
          <div className="goal flex  gap-2 text-[#818490]">
            <Tooltip content={`설문 목적 : ${post.content}`} className="line-clamp-1 text-wrap" placement="left">
              <button>
                <BsFillQuestionCircleFill className="question" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className=" h-[40px] flex justify-between items-center ">
        <div className="flex gap-2">
          <button
            className="w-[100px] h-[32px] border-1 border-[#0051ff] hover:bg-[#0051ff] hover:text-white text-sm rounded-lg "
            onClick={() => clickPostHandler(post)}
          >
            참여하기
          </button>

          <button
            className="w-[100px] h-[32px] border-1 border-[#ddd]  hover:bg-black hover:text-white text-sm rounded-lg"
            onClick={() => moveResultHandler(post)}
          >
            결과보기
          </button>
        </div>
        <div className="viewer flex  gap-2 text-[#818490]">
          <IoPeopleSharp />
          {post.views}
        </div>
      </div>
    </div>
  );
}
