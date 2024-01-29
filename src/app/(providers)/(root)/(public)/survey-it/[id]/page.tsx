'use client';
import {deletePostById, getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {Radio, RadioGroup} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import {getAuth} from 'firebase/auth';
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import Swal from 'sweetalert2';
import ProgressBar from '../../../(main)/_components/progress/ProgressBar';

const SurveyItDetailPage: React.FC = () => {
  const {id} = useParams();
  const router = useRouter();
  const auth = getAuth();
  const postId = Array.isArray(id) ? id[0] : id;
  const currentUser = auth.currentUser?.uid;
  // 질문 input 값의 상태를 관리하는 state
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [completedQuestions, setCompletedQuestions] = useState<number>(0);

  // SurveyItDetailPage 컴포넌트에서 질문에 답변이 입력될 때마다 호출되는 함수
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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

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
  };

  const editPostHandler = () => {
    router.push(`/edit-post/${postId}`);
  };

  const deletePostHandler = async () => {
    Swal.fire({
      title: '삭제하시겠습니까?',
      text: '작성한 내용은 복구할 수 없습니다. 그래도 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deletePostById(postId);
          Swal.fire('게시글이 성공적으로 삭제되었습니다.', '', 'success');
          router.replace('/');
        } catch (error) {
          console.error('게시글 삭제 중 에러가 발생했습니다.', error);
          Swal.fire('게시글 삭제 중 에러가 발생했습니다.', '게시글 삭제 중 에러가 발생했습니다.', 'error');
        }
      }
    });
  };

  const totalQuestions = post?.surveyData.length ?? 0;
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="container min-h-[1200px] w-[55rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="pl-4">
        {/* <p className="text-xs text-[#888]">등록일 | {createdAtDate.toLocaleString()}</p> */}
      </div>
      <div className="title-area flex justify-between items-center border-b-1 border-[#eee]  h-24">
        <h1 className="text-2xl font-bold w-2/3 h-24 flex items-center p-4">{post?.title}</h1>
        <div className="survey-method  h-24 bg-slate-100 text-sm items-center grid grid-cols-2 p-2">
          <p className="w-36 text-md">
            분야 &nbsp;{' '}
            <span className="text-[#0051FF]">{post !== null && post !== undefined ? `${post.category}` : '-'}</span>
          </p>
          <br />
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
        className="flex flex-col justify-between p-2 min-h-[850px] mt-4 border-1 border-[#eee]"
        onSubmit={submitHandler}
      >
        <div className="survey-data">
          {post?.surveyData.map((question, questionIndex) => (
            <div key={questionIndex} className="flex flex-col p-4 gap-2 ">
              <p>{`질문${questionIndex + 1}. ${question.question}`}</p>
              <RadioGroup
                className="flex gap-3 p-2 border-2 border-gray-300"
                label="하나만 선택해주세요."
                orientation="horizontal"
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
      <div>
        {post?.userId === currentUser && (
          <div className="">
            {/* Render your edit and delete buttons here */}
            <button className="w-[80px] h-8 bg-[#eee]" onClick={editPostHandler}>
              수정
            </button>

            <button className="w-[80px] h-8 bg-[#0051FF] text-white" onClick={deletePostHandler}>
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyItDetailPage;
