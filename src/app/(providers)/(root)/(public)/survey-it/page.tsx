'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';
import Popular from '../../(main)/_components/carousel/Popular';
import {Spinner} from '@nextui-org/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import SortingPost from '../../(main)/_components/post/SortingPost';
import {useState} from 'react';

const isWithin24Hours = (createdAt: Date | firebase.firestore.Timestamp): boolean => {
  const currentTime = new Date();

  const createdAtDate = createdAt instanceof firebase.firestore.Timestamp ? createdAt.toDate() : createdAt;

  const timeDifference = currentTime.getTime() - createdAtDate.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference <= 24;
};

export default function SurveyIt() {
  const [categories, setCategories] = useState<string[]>(['전체', '프론트엔드', '백엔드', '머신러닝/AI', '데이터']);
  const [selectCategory, setSelectCategory] = useState<string>('전체');

  const clickCategoryHandler = (category: string) => {
    setSelectCategory(category);
  };

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return (
      <div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  const hasPosts = posts.some(post => post.category === 'IT');

  return (
    <div className="flex-col items-center justify-center w-[88.5rem] m-auto mt-20">
      <SortingPost categories={categories} selectCategory={selectCategory} onCategorySelect={clickCategoryHandler} />
      <Popular />
      <div className="my-20">
        <div className="title-box flex-col items-center  mb-4">
          <div className="flex">
            <h2 className="font-bold text-xl w-[140px]  ">{selectCategory}</h2>
          </div>
        </div>
        <div className="post-container grid grid-cols-4 gap-4">
          {hasPosts ? (
            posts
              .filter(post => post.category === 'IT')
              .map(post => (
                <div
                  key={post.id}
                  className="h-[215px] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4"
                >
                  <div className="top-content h-[90px]">
                    <div className="category-box flex justify-between items-center mb-4">
                      <div className="flex gap-2">
                        <p className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                          {post.category}
                        </p>
                        <p
                          className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
                            isWithin24Hours(post.createdAt) ? '' : 'hidden'
                          }`}
                        >
                          {isWithin24Hours(post.createdAt) ? 'New🔥' : ''}
                        </p>
                      </div>
                      <button className="like-button w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                        <FaRegHeart />
                      </button>
                    </div>
                    <p className="text-xs text-[#666] mb-4">
                      마감일 |{' '}
                      {post.deadlineDate
                        ? post.deadlineDate
                            .toDate()
                            .toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : '2099.12.31'}
                    </p>
                    <a href={`/survey-it/${post.id}`}>
                      <h3 className="text-base font-bold">{post.title}</h3>
                    </a>
                  </div>
                  <div className="bottom-content flex items-end  ">
                    <div className="flex justify-between items-center mt-[50px] w-full border-t-1 ">
                      <div className="user flex mt-4 gap-2">
                        <FaRegCircleUser />
                        <p className="font-semibold">작성자 닉네임</p>
                      </div>
                      <div className="viewer flex mt-4 gap-2 text-[#818490]">
                        <GrView />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div>등록된 게시글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
