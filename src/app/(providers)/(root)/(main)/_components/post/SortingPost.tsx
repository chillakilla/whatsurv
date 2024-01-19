import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {getPosts} from '@/app/api/firebaseApi';
import FilterSelect from './FilterSelect';
import {useState} from 'react';

type Message = {
  condition: boolean;
  text: string;
};

export default function SortingPost() {
  const [sortOptions, setSortOptions] = useState<string[]>([]);
  console.log('sortOptions: ', sortOptions);
  // 게시글 상세 페이지에 들어있는 옵션과 필터의 옵션이 일치하는 게시물 보여주기..
  // 같은 정렬 select 박스에서 바꾸면 그 정렬 조건으로 최신화

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts', sortOptions],
    queryFn: getPosts,
  });

  const messages: Message[] = [
    {condition: isLoading, text: '로딩 중...'},
    {condition: isError, text: '로딩 중에 오류가 발생했습니다.'},
    {condition: !posts, text: '불러올 수 있는 게시글이 없습니다.'},
  ];

  const showMessage = messages.find(message => message.condition);

  const ageOptions = ['전체', '10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대 이상'];
  const typeOptions = ['전체', '설문조사', '인터뷰', '임상시험', '유저테스트'];
  const methodOptions = ['전체', '온라인', '오프라인'];
  const normalOptions = ['인기순', '직종순'];
  const genderOptions = ['전체', '남성', '여성'];

  const changeSortHandler = (option: string) => {
    const updateSortOptions = [...sortOptions];
    console.log('updateSortOptions: ', updateSortOptions);

    if (updateSortOptions.includes(option)) {
      const index = updateSortOptions.indexOf(option);
      console.log('index: ', index);
      updateSortOptions.splice(index, 1);
    } else {
      updateSortOptions.push(option);
    }

    setSortOptions(updateSortOptions);
    console.log(updateSortOptions);
  };

  return (
    <>
      <div className="flex gap-4 my-2">
        <FilterSelect label="정렬" options={normalOptions} onChange={changeSortHandler} />
        <FilterSelect label="연령" options={ageOptions} onChange={changeSortHandler} />
        <FilterSelect label="성별" options={genderOptions} onChange={changeSortHandler} />
        <FilterSelect label="설문 유형" options={typeOptions} onChange={changeSortHandler} />
        <FilterSelect label="진행 방식" options={methodOptions} onChange={changeSortHandler} />
        <button className="bg-black w-[100px] h-8 text-sm text-white font-semibold px-2 rounded-full">초기화</button>
      </div>
    </>
  );
}
