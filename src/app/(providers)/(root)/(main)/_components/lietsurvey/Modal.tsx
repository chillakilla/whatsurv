'use client';

import {Post} from '@/app/api/typePost';
import {db} from '@/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import React, {useState} from 'react';

interface LiteSurveyModalProps {
  post: Post;
  contents: string[];
  images: string[];
  onClose: () => void;
}

const LiteSurveyModal: React.FC<LiteSurveyModalProps> = ({post, contents, onClose}) => {
  const [selectedContentIndex, setSelectedContentIndex] = useState<number | null>(null);
  const [contentsCounts, setContentsCounts] = useState<number[]>(new Array(contents.length).fill(0));

  const handleContentClick = (index: number) => {
    const newCounts = [...contentsCounts];
    newCounts[index] += 1;
    setSelectedContentIndex(index);
    setContentsCounts(newCounts);
  };

  // const handleJoinButtonClick = () => {
  //   if (selectedContentIndex !== null) {
  //     // 선택된 content에 대한 동작 추가
  //     console.log(
  //       `참여하기 버튼 클릭 - 선택된 content: ${contents[selectedContentIndex]}, 카운트: ${contentsCounts[selectedContentIndex]}`,
  //     );
  //     // 참여하기 버튼 클릭시 모달 닫기
  //     onClose();
  //   } else {
  //     // 선택된 content가 없을 때 알람 표시
  //     window.alert('답변을 선택해주세요.');
  //   }
  // };

  const handleJoinButtonClick = async () => {
    try {
      if (selectedContentIndex !== null) {
        const contentId = post.id; // 게시물 ID 또는 다른 고유 식별자
        console.log('contentId', contentId);
        const postRef = doc(db, 'litesurveyposts', contentId);

        // Firestore에서 해당 게시물의 문서를 가져옵니다.
        const postDoc = await getDoc(postRef);
        console.log('postDoc', postDoc);

        if (postDoc && postDoc.exists()) {
          // 현재 counts 배열 가져오기
          const currentCounts = postDoc.data()?.counts || [];
          // 선택된 인덱스의 값을 1 증가
          currentCounts[selectedContentIndex] = (currentCounts[selectedContentIndex] || 0) + 1;

          // counts 필드 업데이트
          await updateDoc(postRef, {
            counts: currentCounts,
          });

          console.log('게시물 카운트가 성공적으로 업데이트되었습니다.');
        } else {
          console.error(`게시물 ID ${contentId}에 해당하는 문서가 존재하지 않습니다.`);
        }

        // 참여하기 버튼 클릭시 모달 닫기
        onClose();
      } else {
        // 선택된 content가 없을 때 알람 표시
        window.alert('답변을 선택해주세요.');
      }
    } catch (error) {
      console.error('게시물 카운트 업데이트 중 오류:', error);
      // 오류 발생시에 대한 처리 추가
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-1/2 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <div className="mb-4 flex justify-center gap-4">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index}`}
              className="max-w-full h-auto max-h-64 object-cover mb-2"
            />
          ))}
        </div>
        <div className="mb-4">
          {contents.map((item, index) => (
            <div
              key={index}
              className={`flex items-center mb-2 cursor-pointer ${
                selectedContentIndex === index ? 'text-blue-500 underline' : 'text-gray-700'
              }`}
              onClick={() => handleContentClick(index)}
            >
              <div
                className={`w-4 h-4 rounded-full border border-blue-500 mr-2 ${
                  selectedContentIndex === index ? 'bg-blue-500' : 'bg-white'
                }`}
              ></div>
              {item}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleJoinButtonClick}
          >
            참여하기
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500"
            onClick={() => {
              /* 결과보기 버튼 클릭 시의 동작 추가 */
            }}
          >
            결과보기
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiteSurveyModal;
