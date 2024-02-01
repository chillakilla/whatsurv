'use client';

import {litePost} from '@/app/api/typePost';
import {auth} from '@/firebase';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';

export type LitePostProps = {
  litepost: litePost;
  onClickPostHandler: (litepost: litePost) => void;
  onClickUpdateDeleteMenuToggle: (postId: string) => void;
  onClickUpdateButton: (postId: string) => void;
  onClickDeleteButton: (postId: string) => void;
  onClickLikedPostHandler: (postId: string) => void;
  likedPosts: {[postId: string]: boolean};
  menuStates: {[postId: string]: boolean};
};

export default function LitePostComponent({
  litepost,
  onClickPostHandler,
  onClickUpdateDeleteMenuToggle,
  onClickUpdateButton,
  onClickDeleteButton,
  onClickLikedPostHandler,
  likedPosts,
  menuStates,
}: LitePostProps) {
  const user = auth.currentUser;
  const userId = user?.uid;

  // 새로운 게시물 알려주기
  const isWithin24Hours = (createdAt: Date): boolean => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  return (
    <>
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
                <button className="toggle-menu w-8 h-7" onClick={() => onClickUpdateDeleteMenuToggle(litepost.id)}>
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
                onClick={() => onClickLikedPostHandler(litepost.id)}
                className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF]"
              >
                {litepost.likes} {likedPosts[litepost.id] ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <a onClick={() => onClickPostHandler(litepost)} className="cursor-pointer">
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
    </>
  );
}
