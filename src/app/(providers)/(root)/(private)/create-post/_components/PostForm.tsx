import {FormData} from '@/app/api/typeFormData';
import {useRouter} from 'next/navigation';
import React, {ChangeEvent, useState, useEffect} from 'react';
import {MdArrowBackIos} from 'react-icons/md';
import {ageGroup, majorCategories, researchLocation, researchTime, researchType, sexType} from './categories';
import {Question} from '@/app/api/typePost';
import {getAuth} from 'firebase/auth';
import {Input, Radio, RadioGroup, Button} from '@nextui-org/react';
import Swal from 'sweetalert2';

// next/router 가 아니고 navigation....하

interface PostFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isFormChanged: boolean;
}

export default function PostForm({
  formData,
  setFormData,
  onInputChange,
  onDateChange,
  onCategoryChange,
  onSubmit,
  isFormChanged,
}: PostFormProps) {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(1);

  const questionChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const newFormData = {...formData};
    newFormData.surveyData[questionIndex] = {
      ...newFormData.surveyData[questionIndex],
      question: e.target.value,
      selectedOption: null,
    };
    setFormData(newFormData);
  };

  const optionChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => {
    console.log('Handling option change:', e.target.value, questionIndex, optionIndex);
    const newFormData = {...formData};
    newFormData.surveyData[questionIndex] = {
      ...newFormData.surveyData[questionIndex],
      selectedOption: e.target.value,
    };
    setFormData(newFormData);
  };

  const MAX_QUESTIONS = 10;

  const addQuestionHandler = () => {
    if (questionCount < MAX_QUESTIONS) {
      const newFormData = {...formData};
      newFormData.surveyData.push({
        question: '',
        options: ['매우 그렇다', '그렇다', '보통이다', '아니다', '매우 아니다'],
        selectedOption: null,
      });
      setFormData(newFormData);
      setQuestionCount(questionCount + 1);
    } else {
      console.warn('질문은 10개가 최대입니다.');
      window.alert('질문은 10개가 최대입니다.');
    }
  };

  const removeLastQuestion = () => {
    const lastQuestionIndex = formData.surveyData.length - 1;

    if (questionCount > 1) {
      const newFormData = {...formData};
      newFormData.surveyData.splice(lastQuestionIndex, 1);
      setFormData(newFormData);
      setQuestionCount(questionCount - 1);
    } else {
      console.warn('처음 질문은 삭제할 수 없습니다.');
      window.alert('처음 질문은 삭제할 수 없습니다.');
    }
  };

  const goBackButtonHandler = async () => {
    if (isFormChanged) {
      const result = await Swal.fire({
        title: '확실합니까?',
        text: '변경된 내용이 저장되지 않을 겁니다. 뒤로 가시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네',
        cancelButtonText: '취소',
      });

      if (result.isConfirmed) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* 흰생 배경 컨테이너 */}
        <div className="w-[80rem] h-[109.375rem] mt-[5.5rem] bg-white flex flex-col justify-center items-center">
          <div className="w-[80rem]">
            <button
              className="flex justify-center items-center w-[3rem] h-[3rem] border-none bg-sky-400 rounded-full ml-10"
              onClick={goBackButtonHandler}
            >
              <MdArrowBackIos />
            </button>
          </div>
          {/* 문서 작성 컨테이너 */}
          <div className="w-[74rem] h-[101.56rem]">
            <form onSubmit={onSubmit}>
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
              <div className="w-[74rem] h-[68.8125rem] mt-[2.31rem] flex flex-col items-center bg-blue-100">
                {/* TODO: 새로 추가된 문항과 그에 따른 옵션 */}
                <div className="w-[54rem] overflow-y-auto">
                  <h3>문항</h3>
                  {formData.surveyData.map((question, questionIndex) => (
                    <div key={questionIndex}>
                      <Input
                        label="질문을 입력해주세요."
                        value={question.question}
                        onChange={e => questionChangeHandler(e, questionIndex)}
                      />
                      <div>
                        <RadioGroup
                          className="flex flex-wrap gap-3 justify-center items-center border-2 border-gray-300"
                          label="하나만 선택해주세요."
                          orientation="horizontal"
                        >
                          {question.options.map((option, optionIndex) => (
                            <Radio
                              key={optionIndex}
                              name={`question_${questionIndex}_option_${optionIndex}`}
                              value={option}
                              checked={question.selectedOption === option}
                              onChange={e => optionChangeHandler(e, questionIndex, optionIndex)}
                            >
                              {option}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center gap-5">
                    <Button
                      type="button"
                      className="w-[10rem] h-[2.5rem] mt-[10px] bg-white rounded-[25rem] text-red-500"
                      onClick={() => removeLastQuestion()}
                    >
                      마지막 질문 삭제
                    </Button>
                    <Button
                      type="button"
                      className="w-[10rem] h-[2.5rem] mt-[10px] bg-blue-500 text-white rounded-[25rem]"
                      onClick={addQuestionHandler}
                    >
                      질문 추가
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-3">
                <p>마감일:&nbsp;</p>
                <input
                  className="p-[2px] border border-sky-500 rounded-lg"
                  type="date"
                  name="deadlineDate"
                  value={formData.deadlineDate instanceof Date ? formData.deadlineDate.toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e)}
                />
              </div>
              {/* 버튼 컨테이너 */}
              <div className="flex justify-end items-start self-stretch gap-6">
                <Button
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
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="
                  w-[15.625rem]
                  h-[3rem]
                  mt-[10px]
                  border-[1.4px]
                  bg-[#0051FF]
                  rounded-[25rem]
                  text-white
                  "
                >
                  등록
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
