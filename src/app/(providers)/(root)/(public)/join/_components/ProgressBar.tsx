import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  const progressBarStyle = {
    width: `${progress}%`,
    // 진행률이 변경될 때 부드럽게 애니메이션 적용
    transition: 'width 0.3s ease-in-out',
  };
  return (
    <div className="progress-bar mt-[30px] w-[400px] mx-auto">
      <div className="bg-gray-200 w-full h-4 rounded-lg">
        <div className="bg-blue-500 h-4 rounded-lg" style={progressBarStyle}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
