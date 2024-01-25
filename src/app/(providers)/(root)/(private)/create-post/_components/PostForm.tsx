import {FormData} from '@/app/api/typeFormData';
import {Input, Spacer} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import React, {ChangeEvent} from 'react';
import {BsPersonCircle} from 'react-icons/bs';
import {MdArrowBackIos} from 'react-icons/md';
import {ageGroup, majorCategories, researchLocation, researchType, sexType} from './categories';
import {Question} from '@/app/api/typePost';
import {getAuth} from 'firebase/auth';
// next/router 가 아니고 navigation....하

interface PostFormProps {
  formData: Omit<FormData, 'updatedAt' | 'email'> & {};
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onImgFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  setFormData: React.Dispatch<React.SetStateAction<Omit<FormData, 'updatedAt' | 'email'>>>;
}

export default function PostForm({
  formData,
  setFormData,
  previewImage,
  onInputChange,
  onDateChange,
  onCategoryChange,
  onImgFileChange,
  onSubmit,
}: PostFormProps) {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
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

  const addOption = (e: React.MouseEvent<HTMLButtonElement>, questionIndex: number) => {
    e.preventDefault();
    setFormData(prevData => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].options.push('');
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const addQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData(prevData => {
      const updatedQuestions = [...prevData.questions, {question: '', options: [''], selectedOption: ''}];
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const removeOption = (e: React.MouseEvent<HTMLButtonElement>, questionIndex: number, optionIndex: number) => {
    e.preventDefault();
    setFormData(prevData => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const removeQuestion = (e: React.MouseEvent<HTMLButtonElement>, questionIndex: number) => {
    e.preventDefault();
    setFormData(prevData => {
      const updatedQuestions = [...prevData.questions];
      updatedQuestions.splice(questionIndex, 1);
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <div>
          <button onClick={backButtonHandler} className="self-start">
            <MdArrowBackIos />
          </button>
          <Spacer y={6} />
          <div className="bg-white">
            <form onSubmit={onSubmit} className="mt-[0.5rem]">
              <div className="w-[64.625rem] h-[5rem] p-[0.625rem] flex items-center border-b gap-[0.5rem]">
                <input
                  className="w-[59.8125rem] h-[1.625rem] text-base font-semibold"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onInputChange}
                  maxLength={70}
                  required
                  placeholder="제목은 최대 70자까지 입력할 수 있습니다."
                />
                <p className="text-[#818490]">{formData.title.length}/70</p>
                <div className="flex flex-col gap-[0.5rem]">
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
                </div>
                <div className="flex flex-col">
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
                  <Input
                    className="p-[3px] border border-sky-500 rounded-lg"
                    type="text"
                    label="소요시간"
                    name="researchTime"
                    value={formData.researchTime}
                    onChange={onInputChange}
                    required
                    placeholder="설문에 소요되는 시간을 작성해주세요."
                  />
                </div>
              </div>
              <Spacer y={6} />
              {/* <div className="flex items-start self-stretch w-[64.625rem]">
                <div className="flex justify-center items-center">
                  <BsPersonCircle />
                  <div className="ml-[0.625rem]">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                  </div>
                </div>
              </div> */}
              <Spacer y={8} />
              <div className="flex items-center justify-between gap-[0.625rem]">
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

                <label htmlFor="deadlineDate">마감일: </label>
                <input
                  className="p-[2px] border border-sky-500 rounded-lg"
                  type="date"
                  name="deadlineDate"
                  value={formData.deadlineDate instanceof Date ? formData.deadlineDate.toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDateChange(e)}
                />
              </div>
              <Spacer y={6} />
              <div className="flex flex-col">
                <label>보상: </label>
                <input
                  className="border-solid border-2  border-#ccc"
                  type="number"
                  name="rewards"
                  value={formData.rewards}
                  onChange={onInputChange}
                />
                <label>이미지 Url: </label>
                <input
                  className="border-solid border-2 border-#ccc"
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={onInputChange}
                />
                <input
                  className="mt-[10px] border-solid border-2 border-#ccc"
                  type="file"
                  accept="image/*"
                  onChange={onImgFileChange}
                />
              </div>
              <h3>이미지 미리보기</h3>
              {previewImage && (
                <div>
                  <img src={previewImage} alt="Image Preview" />
                </div>
              )}
              <div className="flex flex-col w-[64.625rem] ">
                {/* <ToastEditor
                onChange={(content: string) => {
                  onInputChange({target: {name: 'content', value: content}} as React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >);
                }}
              /> */}
                <label>내용: </label>
                <textarea
                  className="border border-sky-500 rounded-lg resize-none"
                  name="content"
                  value={formData.content}
                  onChange={onInputChange}
                  required
                />
              </div>
              {/* TODO: 새로 추가된 문항과 그에 따른 옵션 */}
              <div className="flex flex-col w-[64.625rem]">
                <h3>문항</h3>
                <div>
                  {formData.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="flex flex-col gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`질문 ${questionIndex + 1}`}
                        value={question.question}
                        onChange={e =>
                          onInputChange({
                            target: {name: `questions.${questionIndex}.question`, value: e.target.value},
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                      />
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={`옵션 ${optionIndex + 1}`}
                            value={option}
                            onChange={e =>
                              onInputChange({
                                target: {
                                  name: `questions.${questionIndex}.options.${optionIndex}`,
                                  value: e.target.value,
                                },
                              } as React.ChangeEvent<HTMLInputElement>)
                            }
                          />
                          <button onClick={e => addOption(e, questionIndex)}>옵션 추가</button>
                          <button onClick={e => removeOption(e, questionIndex, optionIndex)}>옵션 제거</button>
                        </div>
                      ))}
                      <div className="flex flex-col">
                        <button onClick={e => removeQuestion(e, questionIndex)}>문항 제거</button>
                        <button onClick={e => addQuestion(e)}>문항 추가</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
    </div>
  );
}
