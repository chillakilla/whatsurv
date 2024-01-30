'use client';
import 'firebase/compat/firestore';
import Link from 'next/link';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {IoPeopleSharp} from 'react-icons/io5';
import {RenderPostProps} from './SearchRenderPost';
import firebase from 'firebase/compat/app';

export default function NormalRenderPost({
  post,
  clickPostHandler,
  clickLikedButtonHandler,
  likedPosts,
}: RenderPostProps) {
  const isWithin24Hours = (createdAt: Date | firebase.firestore.Timestamp): boolean => {
    const currentTime = new Date();
    const createdAtDate = createdAt instanceof firebase.firestore.Timestamp ? createdAt.toDate() : createdAt;

    const timeDifference = currentTime.getTime() - createdAtDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 24;
  };
  return (
    <div
      className={`h-64 border-2 border-[#e1e1e1] flex flex-col justify-between rounded-xl p-4 bg-white `}
      onClick={() => clickPostHandler(post)}
    >
      <div className="category-box flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
            {post.category}
          </div>
          <div
            className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
              post.views >= 15 ? 'block' : 'hidden'
            }`}
          >
            {post.views >= 15 ? 'HOT🔥' : ''}
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
      <Link href={`/survey-it/${post.id}`}>
        <h3 className="font-semibold text-lg text-ellipsis overflow-hidden  line-clamp-1">{post.title}</h3>
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
      </Link>
      <div className="border-t-1 border-[#eee] flex justify-between items-center p-2">
        <div className="flex items-center w-full mt-4 justify-between">
          <p className="flex items-center gap-2 text-sm text-[#666]">
            종료일 &nbsp;
            {post.deadlineDate
              ? post.deadlineDate
                  ?.toDate()
                  ?.toLocaleDateString('ko-KR', {year: 'numeric', month: 'numeric', day: 'numeric'})
              : '2024.12.31'}
          </p>
          <div className="viewer flex  gap-2 text-[#818490]">
            <IoPeopleSharp />
            {post.views}
          </div>
        </div>
      </div>
    </div>
  );
}
