'use client';

import {litePost} from '@/app/api/typePost';
import {db} from '@/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import ResultModal from './ResultModal';

interface LiteSurveyModalProps {
  litepost: litePost;
  contents: string[];
  images: string[];
  onCloseLiteSurveyModal: () => void;
}

const LiteSurveyModal: React.FC<LiteSurveyModalProps> = ({litepost, contents, onCloseLiteSurveyModal}) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState<number | null>(null);
  const [contentsCounts, setContentsCounts] = useState<number[]>(new Array(contents.length).fill(0));
  const [showResultModal, setShowResultModal] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // 이미지 로딩이 완료되면 상태 변경
    const images = litepost.images || [];
    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(() => {
        setImagesLoaded(true); // 또는 에러 처리
      });
  }, [litepost.images]);

  // 어떤 내용을 카운트 하는지 정하기
  const onClickContentsHandler = (index: number) => {
    const newCounts = [...contentsCounts];
    newCounts[index] += 1;
    setSelectedContentIndex(index);
    setContentsCounts(newCounts);
  };

  // Lite 설문조사 게시물 등록하기
  const onClickSurveySubmitHandler = async () => {
    try {
      if (selectedContentIndex !== null) {
        const contentId = litepost.id;
        const postRef = doc(db, 'litesurveyposts', contentId);

        // Firestore에서 해당 게시물의 문서를 가져오기
        const postDoc = await getDoc(postRef);

        if (postDoc && postDoc.exists()) {
          // 현재 counts 배열 가져오기
          const currentCounts = postDoc.data()?.counts || [];
          // 선택된 인덱스의 값을 1 증가
          currentCounts[selectedContentIndex] = (currentCounts[selectedContentIndex] || 0) + 1;

          // counts 필드 업데이트
          await updateDoc(postRef, {
            counts: currentCounts,
          });

          // 참여하기 버튼 클릭시 모달 닫기
          onCloseLiteSurveyModal();

          // 업데이트된 counts 배열을 litepost에 반영
          litepost.counts = currentCounts;

          console.log('게시물 카운트가 성공적으로 업데이트되었습니다.');
          Swal.fire({
            icon: 'success',
            title: '참여 완료',
            text: '답변해 주셔서 감사합니다.',
            confirmButtonColor: '#0051FF',
          });
        } else {
          console.error(`게시물 ID ${contentId}에 해당하는 문서가 존재하지 않습니다.`);
        }
      } else {
        // 선택된 content가 없을 때 알람 표시
        Swal.fire({
          title: '답변을 선택해 주세요.',
          confirmButtonColor: '#0051FF',
          icon: 'warning',
        });
      }
    } catch (error) {
      console.error('게시물 카운트 업데이트 중 오류:', error);
    }
  };

  // 결과보기 모달창 닫기
  const resultModalClosehandler = () => {
    setShowResultModal(false);
    onCloseLiteSurveyModal();
  };

  // 참여인원수
  const totalVotes = litepost.counts.reduce((acc, count) => acc + count, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      {imagesLoaded ? (
        <div className="bg-white w-[39rem] p-8 rounded-lg">
          <div className="mb-4 flex justify-center gap-4">
            {litepost.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                className="max-w-64 h-auto max-h-64 object-cover mb-2"
              />
            ))}
          </div>
          <div className="mb-2 flex justify-end">
            <span className="text-sm">참여인원 : {totalVotes}명</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 border-b border-black pb-4 mb-4">{litepost.title}</h2>
          <div className="mb-4">
            {contents.map((item, index) => (
              <div
                key={index}
                className="flex items-center mb-2 cursor-pointer border-b border-blue-300 pb-4 mb-4"
                onClick={() => onClickContentsHandler(index)}
              >
                <input
                  type="radio"
                  name="contentRadioGroup"
                  className={`w-4 h-4 rounded-full border border-blue-500 mr-2 ${
                    selectedContentIndex === index ? 'bg-blue-500' : 'bg-white'
                  }`}
                ></input>
                {item}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-[#4D85FF] text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              onClick={onClickSurveySubmitHandler}
            >
              참여하기
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500"
              onClick={() => {
                setShowResultModal(true);
              }}
            >
              결과보기
            </button>
            <button
              className="bg-[#EB271C] text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
              onClick={onCloseLiteSurveyModal}
            >
              닫기
            </button>
            {/* 결과보기 모달 표시 */}
            {showResultModal && (
              <ResultModal
                litepost={litepost}
                contents={contents}
                counts={contentsCounts}
                onClickResultModalCloseHandler={resultModalClosehandler}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white w-[39rem] h-[24rem] p-8 rounded-lg flex items-center justify-center">로딩 중...</div>
      )}
    </div>
  );
};

export default LiteSurveyModal;
