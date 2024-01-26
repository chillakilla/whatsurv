// import {Progress} from '@nextui-org/react';
// import React from 'react';

// interface ProgressBarProps {
//   progress: number;
// }

// export default function ProgressBar({progress}: ProgressBarProps) {
//   const [completedQuestions, setCompletedQuestions] = React.useState(0);

//   const completeQuestionHandler = () => {
//     setCompletedQuestions(prev => prev + 1);
//   };

//   // const progress = totalQuestion > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

//   return (
//     <div className="w-[80%] h-[30px] flex items-center gap-4 justify-center ">
//       <Progress size="md" value={progress} />
//       {/* <p>{Math.round()}%</p> */}
//       <p>{Math.round(progress)}%</p>
//     </div>
//   );
// }

import {Progress} from '@nextui-org/react';
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  return (
    <div className="w-[80%] h-[30px] flex items-center gap-4 justify-center ">
      <Progress size="md" value={progress} />
      <p>{Math.round(progress)}%</p>
    </div>
  );
};

export default ProgressBar;
