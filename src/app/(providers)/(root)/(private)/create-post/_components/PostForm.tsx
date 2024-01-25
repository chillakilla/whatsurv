import {FormData} from '@/app/api/typeFormData';
import {useRouter} from 'next/navigation';
import React, {ChangeEvent, useState} from 'react';
import {MdArrowBackIos} from 'react-icons/md';
import {ageGroup, majorCategories, researchLocation, researchTime, researchType, sexType} from './categories';
import {Question} from '@/app/api/typePost';
import {getAuth} from 'firebase/auth';
import {Radio, RadioGroup, Input} from '@nextui-org/react';
// next/router 가 아니고 navigation....하

interface PostFormProps {
  formData: Omit<FormData, 'updatedAt' | 'email'> & {};
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PostForm({formData, onInputChange, onDateChange, onCategoryChange, onSubmit}: PostFormProps) {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([{question: '', options: ['', '', '', '', '']}]);
  const isFormValid =
    formData.title.trim() !== '' &&
    formData.category !== '' &&
    formData.sexType !== '' &&
    formData.ageGroup !== '' &&
    formData.researchType !== '' &&
    formData.researchLocation !== '' &&
    formData.researchTime !== '' &&
    formData.deadlineDate !== null;

  const backButtonHandler = () => {
    const isContentModified =
      formData.title.trim() !== '' ||
      // content 부분 테스트 할 것이 있어 주석
      // formData.content.trim() !== '' ||
      formData.category !== '' ||
      formData.sexType !== '' ||
      formData.ageGroup !== '' ||
      formData.researchType !== '' ||
      formData.researchLocation !== '' ||
      formData.researchTime !== '' ||
      formData.deadlineDate !== null;

    if (isContentModified) {
      const userConfirmed = window.confirm('정말 뒤로 가시겠습니까? 작성된 내용은 저장되지 않습니다.');

      if (userConfirmed) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const addQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSurveyQuestions(prevQuestions => [...prevQuestions, {question: '', options: ['', '', '', '', '']}]);
  };

  const deleteQuestion = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setSurveyQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => {
    const newQuestions = [...surveyQuestions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setSurveyQuestions(newQuestions);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newQuestions = [...surveyQuestions];
    newQuestions[index].question = e.target.value;
    setSurveyQuestions(newQuestions);
  };

  const optionLabels = ['많이 그렇다.', '조금 그렇다.', '보통이다', '조금 아니다', '많이 아니다'];

  return (
    <>
      <div className="flex flex-col items-center">
        {/* 흰생 배경 컨테이너 */}
        <div className="w-[80rem] h-[109.375rem] mt-[5.5rem] bg-white flex flex-col justify-center items-center">
          <div className="w-[80rem]">
            <button
              onClick={backButtonHandler}
              className="flex justify-center items-center w-[3rem] h-[3rem] border-none bg-sky-400 rounded-full ml-10"
            >
              <MdArrowBackIos />
            </button>
          </div>
          {/* 문서 작성 컨테이너 */}
          <div className="w-[74rem] h-[101.56rem]">
            <form>
              {/* 타이틀 및 참여대상 연령 등 컨테이너 */}
              <div className="w-[74rem] h-[6rem] flex ">
                <div className="w-[74rem] h-[6rem] flex justify-center items-center  border-black border-b-2">
                  <input
                    className="w-[54rem] h-[5rem] p-2"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    maxLength={70}
                    required
                    placeholder="제목은 최대 70자까지 입력할 수 있습니다."
                  />
                  <p className="text-[#818490] p-2">{formData.title.length}/70</p>
                </div>
              </div>
              <div>
                <div className="flex w-[74rem] h-[6rem] justify-center items-center gap-3">
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="sexType"
                    value={formData.sexType}
                    onChange={onCategoryChange}
                    required
                  >
                    {sexType.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={onCategoryChange}
                    required
                  >
                    {ageGroup.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="category"
                    value={formData.category}
                    onChange={onCategoryChange}
                    required
                  >
                    {majorCategories.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="researchType"
                    value={formData.researchType}
                    onChange={onCategoryChange}
                    required
                  >
                    {researchType.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="researchLocation"
                    value={formData.researchLocation}
                    onChange={onCategoryChange}
                    required
                  >
                    {researchLocation.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-[2px] border border-sky-500 rounded-lg"
                    name="researchTime"
                    value={formData.researchTime}
                    onChange={onCategoryChange}
                    required
                  >
                    {researchTime.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    className="p-[2px] border border-sky-500 rounded-lg"
                    type="date"
                    name="deadlineDate"
                    value={
                      formData.deadlineDate instanceof Date ? formData.deadlineDate.toISOString().split('T')[0] : ''
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e)}
                  /> */}
                </div>
              </div>
              {/* 설문조사 설명 컨테이너 */}
              <div className="w-[74rem] h-[10.6875rem] mt-[1.75rem] flex flex-col items-center justify-center border-1 border-gray-300">
                <textarea
                  className="w-[56.5625rem] h-[7.25rem] p-[1rem] rounded-lg resize-none"
                  name="content"
                  value={formData.content}
                  onChange={onInputChange}
                  required
                  placeholder="설문조사에 대한 설명을 간단하게 작성해주세요."
                />
              </div>
              {/* 설문조사 폼 양식 컨테이너 */}
              <div className="w-[74rem] h-[72.8125rem] mt-[2.31rem] flex bg-blue-200 justify-center">
                {/* TODO: 새로 추가된 문항과 그에 따른 옵션 */}
                <div className="flex flex-col">
                  <h3>문항</h3>
                  {surveyQuestions.map((question, questionIndex) => (
                    <div key={questionIndex}>
                      <Input
                        type="text"
                        value={question.question}
                        onChange={e => handleQuestionChange(e, questionIndex)}
                        placeholder="Enter question"
                      />
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <input
                            type="radio"
                            value={option}
                            onChange={e => handleOptionChange(e, questionIndex, optionIndex)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <label>{optionLabels[optionIndex]}</label>
                        </div>
                      ))}
                      <button onClick={e => deleteQuestion(e, questionIndex)}>Delete Question</button>
                    </div>
                  ))}
                  <button onClick={addQuestion}>Add Question</button>
                </div>
              </div>
              {/* 버튼 컨테이너 */}
              <div className="flex justify-end items-start self-stretch gap-6">
                <button
                  className="
            w-[15.625rem]
            h-[3rem]
            mt-[10px]
            border-[1.4px]
            bg-white
            border-sky-500
            rounded-[25rem]
            hover:bg-[#0051FF]
            hover:text-white
            "
                  onClick={e => {
                    e.preventDefault();
                    backButtonHandler();
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`
              w-[15.625rem]
              h-[3rem]
              mt-[10px]
              border-[1.4px]
              bg-[#0051FF]
              rounded-[25rem]
              text-white
              ${!isFormValid ? 'cursor-not-allowed' : 'hover:bg-white hover:text-[#0051FF] hover:border-none'}
              }`}
                  disabled={!isFormValid}
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
