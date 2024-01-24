'use client';

import {litePost} from '@/app/api/typePost';

interface ResultModalProps {
  litepost: litePost;
  contents: string[];
  counts: number[];
  onClickResultModalCloseHandler: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({litepost, onClickResultModalCloseHandler}) => {
  // 참여인원수
  const totalVotes = litepost.counts.reduce((acc, count) => acc + count, 0);
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-0 flex items-center justify-center">
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
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm">조사기간 : 추가해야함</span>
          <span className="text-sm">참여인원 : {totalVotes}명</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 border-b border-black pb-4 mb-4">{litepost.title}</h2>
        <div className="mb-4">
          {litepost.contents.map((item, index) => {
            const percent = totalVotes === 0 ? 0 : (litepost.counts[index] / totalVotes) * 100;
            return (
              <div key={index} className="flex items-center mb-2 border-b border-blue-100 pb-4 mb-4">
                <span className="text-gray-700 mr-2">{item}</span>
                <span className="text-blue-500 font-bold">
                  {litepost.counts[index]}표 ({percent.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300"
            onClick={onClickResultModalCloseHandler}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
