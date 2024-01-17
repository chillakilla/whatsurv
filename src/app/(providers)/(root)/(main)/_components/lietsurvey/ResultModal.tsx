'use client';

import {litePost} from '@/app/api/typePost';

interface ResultModalProps {
  litepost: litePost;
  contents: string[];
  counts: number[];
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({litepost, contents, counts, onClose}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-0 flex items-center justify-center">
      <div className="bg-white w-1/2 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{litepost.title}</h2>
        <div className="mb-4 flex justify-center gap-4">
          {litepost.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index}`}
              className="max-w-full h-auto max-h-64 object-cover mb-2"
            />
          ))}
        </div>
        <div className="mb-4">
          <div className="font-bold mb-2"></div>
          {litepost.contents.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">{item}:</span>
              <span className="text-blue-500 font-bold">{litepost.counts[index]}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
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

export default ResultModal;
