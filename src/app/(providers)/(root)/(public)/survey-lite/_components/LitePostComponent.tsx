'use client';

import {litePost} from '@/app/api/typePost';
import {auth} from '@/firebase';
import {useState} from 'react';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {IoPeopleSharp} from 'react-icons/io5';

export type LitePostProps = {
  litepost: litePost;
  onClickPostHandler: (litepost: litePost) => void;
  onClickUpdateDeleteMenuToggle: (postId: string) => void;
  onClickUpdateButton: (postId: string) => void;
  onClickDeleteButton: (postId: string) => void;
  onClickLikedPostHandler: (postId: string) => void;
  likedPosts: {[postId: string]: boolean};
  menuStates: {[postId: string]: boolean};
  // contents: string[];
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
}: // contents,
LitePostProps) {
  const user = auth.currentUser;
  const userId = user?.uid;

  // 새로운 게시물 알려주기
  const isWithin24Hours = (createdAt: Date): boolean => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  // 결과 모달을 표시하는 상태를 관리합니다.
  const [showResultModal, setShowResultModal] = useState(false);
  // const [contentsCounts, setContentsCounts] = useState<number[]>(contents ? new Array(contents.length).fill(0) : []);

  // 결과 모달을 닫는 핸들러 함수를 정의합니다.
  const resultModalClosehandler = () => {
    setShowResultModal(false);
  };

  return (
    <>
      <div key={litepost.id}>
        <div className="h-[13.4375rem] bg-white border-1 border-[#C1C5CC] flex flex-col justify-between rounded-md p-4">
          <div className="top-content h-[50px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="flex items=center gap-2">
                <p className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                  참여해
                </p>
                <p
                  className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
                    isWithin24Hours(litepost.createdAt) ? '' : 'hidden'
                  }`}
                >
                  {isWithin24Hours(litepost.createdAt) ? 'New🔥' : ''}
                </p>
                <button className="toggle-menu w-3 h-5" onClick={() => onClickUpdateDeleteMenuToggle(litepost.id)}>
                  {userId === litepost.userId && (menuStates[litepost.id] ? 'X' : '⁝')}
                </button>
                {menuStates[litepost.id] && (
                  <div className="gap-2">
                    <button
                      className="w-8 h-5 text-blue-800 hover:bg-gray-100"
                      onClick={() => onClickUpdateButton(litepost.id)}
                    >
                      수정
                    </button>
                    <button
                      className="w-8 h-5 text-red-500 hover:bg-gray-100"
                      onClick={() => onClickDeleteButton(litepost.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => onClickLikedPostHandler(litepost.id)}
                className="like-button w-12 h-[1.25rem] flex justify-end gap-1 items-center text-[#0051FF]"
              >
                {likedPosts[litepost.id] ? <FaHeart /> : <FaRegHeart />}
                {litepost.likes}
              </button>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-[#666]">
                등록일{' '}
                {litepost.createdAt
                  ? litepost.createdAt.toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : '2099.12.31'}
              </p>
              <div className="user flex gap-2 text-xs text-[#666]">
                작성자 |
                {/* {litepost.userPhotoURL ? (
              <img src={litepost.userPhotoURL} className="profile-img  rounded-full" alt="Profile" />
            ) : (
              <FaRegCircleUser className="lite-profile" />
            )} */}
                <p className="font-md text-xs">{litepost.nickname}</p>
              </div>
            </div>
          </div>
          <a onClick={() => onClickPostHandler(litepost)} className="cursor-pointer">
            <h3 className="text-lg font-bold h-[35px]">
              {litepost.title.length > 18 ? `${litepost.title.substring(0, 18)}...` : litepost.title}
            </h3>
          </a>

          <div className="bottom-content flex items-end border-t-1 border-[#eee]">
            <div className="flex justify-between items-end w-full">
              <div className="viewer flex gap-2 text-[#818490]">
                <IoPeopleSharp />
                {litepost.views}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onClickPostHandler(litepost)}
                  className="w-[100px] h-[32px] border-1 border-[#0051ff] hover:bg-[#0051ff] hover:text-white text-sm rounded-lg cursor-pointer"
                >
                  참여하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 결과보기 모달 표시
      {showResultModal && (
        <ResultModal
          litepost={litepost}
          contents={contents}
          counts={contentsCounts}
          onClickResultModalCloseHandler={resultModalClosehandler}
        />
      )} */}
    </>
  );
}
