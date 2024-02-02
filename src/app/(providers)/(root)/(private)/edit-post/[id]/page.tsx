'use client';

import {getAuth} from 'firebase/auth';
import {useRouter, useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {FaArrowLeft} from 'react-icons/fa6';
import Swal from 'sweetalert2';
import {getPostToEdit, updatePost} from '@/app/api/firebaseApi'; // Assuming you have an updatePost function
import {FormData} from '@/app/api/typeFormData';
import {Button, Input, Radio, RadioGroup, Select, SelectItem, Textarea} from '@nextui-org/react';
import {
  ageGroup,
  majorCategories,
  researchLocation,
  researchTime,
  researchType,
  sexType,
} from '../../create-post/_components/categories';

export default function EditPostForm() {
  const {id} = useParams<{id: string}>();
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    content: '',
    category: '',
    ageGroup: '',
    sexType: '',
    researchType: '',
    researchTime: '',
    researchLocation: '',
    liked: 0,
    likes: false,
    createdAt: new Date(),
    deadline: '',
    nickname: user?.displayName || null,
    email: user?.email || null,
    views: 0,
    userId: user?.uid || '',
    updatedAt: new Date(),
    surveyData: [{question: '', options: ['매우 그렇다', '그렇다', '보통이다', '아니다', '매우 아니다']}],
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        console.log('postId:', id);

        const postData = await getPostToEdit(id);
        if (!postData) {
          window.alert('게시글을 찾을 수 없습니다.');
          router.push('/');
          return;
        }
        if (postData.userId !== user.uid) {
          window.alert('권한이 없습니다.');
          router.push('/');
          return;
        }
        setFormData({
          ...postData,
          updatedAt: new Date(),
        });
        console.log('postdata category', postData.category);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchData();
  }, []);

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updatePost(id, formData);
      router.push('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const goBackHandler = async () => {
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

  if (!formData) {
    return null;
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    setIsFormChanged(true);
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const questionChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const newFormData = {...formData};
    newFormData.surveyData[questionIndex] = {
      ...newFormData.surveyData[questionIndex],
      question: e.target.value,
      selectedOption: null,
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

  return (
    <div className="flex flex-col items-center">
      <div className="w-[80rem] mt-[5.5rem] rounded-md bg-white flex flex-col justify-center items-center">
        <div className="w-[80rem]">
          <button className="text-3xl p-[10px] bg-blue-100 rounded-full mt-[20px] ml-[20px]">
            <FaArrowLeft onClick={goBackHandler} />
          </button>
        </div>
        <div className="w-[74rem] px-[20px] pt-[20px] pb-[40px] mb-[10px]">
          <form onSubmit={SubmitHandler}>
            {' '}
            <div className="flex items-center relative">
              <Input
                className=" p-2 !text-2xl"
                type="text"
                color="primary"
                size="lg"
                name="title"
                variant="underlined"
                value={formData.title}
                onChange={onInputChange}
                maxLength={70}
                required
                placeholder="제목은 최대 70자까지 입력할 수 있습니다."
              />
              <p className="text-[#818490] absolute bottom-[10px] right-0 p-2">{formData.title.length}/70</p>
            </div>
            <div>
              <div className="flex w-[74rem] h-[6rem] justify-center items-center gap-3">
                <Select
                  className="p-[2px] rounded-lg w-[150px]"
                  name="sexType"
                  label="성별"
                  size="sm"
                  color="primary"
                  value={formData.sexType}
                  onChange={onCategoryChange}
                  required
                >
                  {sexType.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="p-[2px]  rounded-lg w-[150px]"
                  name="ageGroup"
                  color="primary"
                  label="연령"
                  size="sm"
                  value={formData.ageGroup}
                  onChange={onCategoryChange}
                  required
                >
                  {ageGroup.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="p-[2px]  rounded-lg w-[150px]"
                  name="category"
                  label="직종"
                  size="sm"
                  color="primary"
                  value={formData.category}
                  onChange={onCategoryChange}
                  required
                >
                  {majorCategories.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="p-[2px]  rounded-lg w-[150px]"
                  name="researchType"
                  value={formData.researchType}
                  onChange={onCategoryChange}
                  label="설문 종류"
                  size="sm"
                  color="primary"
                  required
                >
                  {researchType.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="p-[2px]  rounded-lg w-[150px]"
                  name="researchLocation"
                  label="설문 장소"
                  size="sm"
                  color="primary"
                  value={formData.researchLocation}
                  onChange={onCategoryChange}
                  required
                >
                  {researchLocation.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  className="p-[2px]  rounded-lg w-[150px]"
                  name="researchTime"
                  label="소요 시간"
                  size="sm"
                  color="primary"
                  value={formData.researchTime}
                  onChange={onCategoryChange}
                  required
                >
                  {researchTime.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* 설문조사 설명 컨테이너 */}
            <div className="mb-[40px] mt-[20px]">
              <Textarea
                className=" rounded-lg resize-none"
                name="content"
                size="lg"
                variant="faded"
                value={formData.content}
                onChange={onInputChange}
                required
                placeholder="설문조사에 대한 설명을 간단하게 작성해주세요."
              />
            </div>
            {/* 설문조사 폼 양식 컨테이너 */}
            <div className="mt-[10px] py-[30px] px-[30px] rounded-lg  bg-blue-100">
              {/* TODO: 새로 추가된 문항과 그에 따른 옵션 */}
              <div className="  m-auto">
                {formData.surveyData.map((question, questionIndex) => (
                  <div key={questionIndex}>
                    <div className=" m-auto max-w-5xl mt-[30px] mb-[50px]">
                      <Input
                        placeholder="질문을 입력해주세요"
                        size="lg"
                        className="mb-[20px] mt-[20px]"
                        value={question.question}
                        onChange={e => questionChangeHandler(e, questionIndex)}
                        required
                      />
                      <div className="mb-[30px] mt-[30px]]">
                        <RadioGroup className="" label="하나만 선택해주세요." isDisabled orientation="horizontal">
                          {question.options.map((option, optionIndex) => (
                            <Radio
                              key={optionIndex}
                              name={`question_${questionIndex}_option_${optionIndex}`}
                              value={option}
                            >
                              {option}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <hr className="!bg-[#0051FF] h-[2px]" />
                  </div>
                ))}
                <div className="mt-[30px] flex justify-end">
                  <Button
                    type="button"
                    className=" w-[125px] text-red-500 mr-[10px]"
                    onClick={() => removeLastQuestion()}
                  >
                    마지막 질문 삭제
                  </Button>
                  <Button type="button" color="primary" className="text-white  w-[125px] " onClick={addQuestionHandler}>
                    질문 추가
                  </Button>
                </div>
              </div>
            </div>
            <div className="my-[30px] float-right">
              <Input
                className="p-[2px]  rounded-lg"
                type="text"
                label="마감일"
                size="lg"
                labelPlacement="outside-left"
                pattern="\d{4}.\d{2}.\d{2}"
                name="deadline"
                value={formData.deadline}
                placeholder="yyyy.mm.dd"
                onChange={onInputChange}
                required
              />
            </div>
            {/* 버튼 컨테이너 */}
            <div className=" w-full flex justify-end">
              <Button
                color="danger"
                variant="bordered"
                size="lg"
                className="
      
 
            hover:bg-red-500
            hover:text-white
            mr-[20px]
         w-[200px]
            "
              >
                취소
              </Button>
              <Button
                type="submit"
                size="lg"
                className="
           
                  bg-[#0051FF]
           w-[200px]
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
  );
}
