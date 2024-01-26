'use client';
import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {db} from '@/firebase';
import {Radio, RadioGroup} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {addDoc, collection} from 'firebase/firestore';
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import Swal from 'sweetalert2';
import ProgressBar from '../../../(main)/_components/progress/ProgressBar';

const SurveyItDetailPage: React.FC = () => {
  const {id} = useParams();
  const router = useRouter();
  // 질문 input 값의 상태를 관리하는 state
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);

  // 질문에 답변이 입력될 때마다 호출되는 함수
  const handleAnswerChange = (index: number, answer: string) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = answer;
      // 답변이 완료된 질문의 수 업데이트
      const filledAnswersCount = newAnswers.filter(answer => answer.trim() !== '').length;
      setCompletedQuestions(filledAnswersCount);
      return newAnswers;
    });
  };

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post | null, Error>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>Error fetching post data</div>;
  }

  const createdAtDate = post?.createdAt.toDate() as Date;
  const deadlineDate = post?.deadlineDate?.toDate() as Date;

  const cancelHandler = () => {
    Swal.fire({
      title: '취소하시겠습니까?',
      text: '작성한 내용은 저장되지 않습니다. 그래도 취소하시겠습니까?',
      icon: 'warning',

      showCancelButton: true,
      confirmButtonColor: '#0051FF',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',

      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('감사합니다. 다음에 또 이용해주세요!');
        router.replace('/');
      }
    });
  };

  const submithandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Firebase submitedposts에 데이터 저장
      await addDoc(collection(db, 'submitedposts'), {
        postId: id,
        email: post?.email,
        nickname: post?.nickname,
        category: post?.category,
        sexType: post?.sexType,
        ageGroup: post?.ageGroup,
        title: post?.title,
        content: post?.content,
        researchLocation: post?.researchLocation,
        researchTime: post?.researchTime,
        researchType: post?.researchType,
        answers: answers,
      });

      Swal.fire({
        title: '제출하시겠습니까?',
        text: '작성하신 내용은 이후에 수정할 수 없습니다.',
        icon: 'warning',

        showCancelButton: true,
        confirmButtonColor: '#0051FF',
        cancelButtonColor: '#d33',
        confirmButtonText: '확인',
        cancelButtonText: '취소',

        reverseButtons: true,
      }).then(async result => {
        if (result.isConfirmed) {
          Swal.fire('감사합니다. 다음에 또 이용해주세요!');
          router.replace('/');
        }
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      // 사용자에게 오류 메시지 표시 또는 오류 처리
      Swal.fire('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const totalQuestions = post?.surveyData.length ?? 0;

  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="container h-[1200px] w-[55rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="pl-4">
        {/* <p className="text-xs text-[#888]">등록일 | {createdAtDate.toLocaleString()}</p> */}
      </div>
      <div className="title-area flex justify-between items-center border-b-1 border-[#eee]  h-24">
        <h1 className="text-2xl font-bold w-2/3 h-24 flex items-center p-4">{post?.title}</h1>
        <div className="survey-method  h-24 bg-slate-100 text-sm items-center grid grid-cols-2 p-2">
          <p className="w-36">
            분야 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? `${post.category}` : '-'}</span>
          </p>
          <p className="w-36">
            카테고리 &nbsp; <span className="text-[#0051FF]">프론트엔드</span>
          </p>
          <p className="w-36">
            참여 대상 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? post.sexType : '전체'}</span>
          </p>
          <p className="w-36">
            참여 연령 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? post.ageGroup : '전체'}</span>
          </p>
          <p className="w-36">
            소요 시간 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? `${post.researchTime}` : '-'}</span>
          </p>
          <p className="w-36">
            설문 방식 &nbsp;{' '}
            <span className="text-[#0051FF]"> {post !== null && post !== undefined ? post.researchType : '-'}</span>
          </p>
        </div>
      </div>
      <div className="survey-explain h-24 p-2 border-1 border-[#eee] mt-4">{post?.content}</div>
      <div className="progress-bar flex justify-center w-full h-[35px] mt-6 ">
        <ProgressBar progress={progress} />
      </div>
      <form
        className="flex flex-col justify-between p-2 h-[850px] mt-4 border-1 border-[#eee]"
        onSubmit={submithandler}
      >
        {/* <div>
          <div className="flex flex-col p-4 gap-2">
            <label>질문1</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className=" flex flex-col  p-4 gap-2">
            <label>질문2</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col  p-4 gap-2">
            <label>질문3</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col p-4 gap-2">
            <label>질문4</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col  p-4 gap-2">
            <label>질문5</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col  p-4 gap-2">
            <label>질문6</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col  p-4 gap-2">
            <label>질문7</label>
            <input type="text" className="bg-[#eee]" />
          </div>
          <div className="flex flex-col  p-4 gap-2">
            <label>질문8</label>
            <input type="text" className="bg-[#eee]" />
          </div>
        </div> */}
        <div>
          {post?.surveyData.map((question, questionIndex) => (
            <div key={questionIndex} className="flex flex-col p-4 gap-2">
              <p>{`질문${questionIndex + 1}`}</p>
              <div>{question.question}</div>
              <RadioGroup
                className="flex flex-wrap gap-3 justify-center items-center border-2 border-gray-300"
                label="하나만 선택해주세요."
                orientation="horizontal"
                // 세로로 정렬 orientation="vertical"
              >
                {question.options.map((option, optionIndex) => (
                  <Radio
                    key={optionIndex}
                    name={`question_${questionIndex}_option`}
                    value={option}
                    checked={answers[questionIndex] === option}
                    onChange={() => handleAnswerChange(questionIndex, option)}
                  >
                    {option}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        <div className="flex ml-auto p-4 w-56 justify-end gap-4">
          <button className="w-[80px] h-8 bg-[#eee]" onClick={cancelHandler}>
            취소
          </button>
          <button className="w-[80px] h-8 bg-[#0051FF] text-white" type="submit">
            제출
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyItDetailPage;
