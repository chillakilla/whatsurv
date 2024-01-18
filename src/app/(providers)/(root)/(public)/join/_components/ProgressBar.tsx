import type {ProgressBarTypes} from '../_types/typeJoin';

export default function ProgressBar({progress}: ProgressBarTypes) {
  const progressBarStyle = {
    width: `${progress}%`,
    transition: 'width 0.3s ease-in-out',
  };
  return (
    <div className="progress-bar mt-[30px] w-[400px] mx-auto">
      <div className="bg-gray-200 w-full h-4 rounded-lg">
        <div className="bg-blue-500 h-4 rounded-lg" style={progressBarStyle}></div>
      </div>
    </div>
  );
}
