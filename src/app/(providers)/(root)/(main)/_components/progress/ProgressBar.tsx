import React from 'react';
import {Progress} from '@nextui-org/react';

export default function ProgressBar() {
  const [completedQuestions, setCompletedQuestions] = React.useState(0);

  const completeQuestionHandler = () => {
    setCompletedQuestions(prev => prev + 1);
  };

  // const progress = totalQuestion > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="w-[80%] h-[30px] flex items-center gap-4 justify-center ">
      <Progress size="md" value={0} />
      {/* <p>{Math.round()}%</p> */}
    </div>
  );
}
