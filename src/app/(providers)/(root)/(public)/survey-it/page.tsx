'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import {FaRegHeart} from 'react-icons/fa';
import Link from 'next/link';
import Popular from '../../(main)/_components/carousel/Popular';
import {Spinner} from '@nextui-org/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {IoPeopleSharp} from 'react-icons/io5';
import SortingPost from '../../(main)/_components/post/SortingPost';
import {FaCalendarAlt} from 'react-icons/fa';
import {useState} from 'react';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '@/firebase';
import {Post} from '@/app/api/typePost';

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const updateViewsCount = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;
        await updateDoc(postRef, {
          views: currentViews + 1, // 'views' 카운트 증가
        });
      } else {
        console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
      }
    } catch (error) {
      console.error('Views 카운트 업데이트 중 오류:', error);
    }
  };
  // 게시물 클릭을 처리하는 함수
  const clickPostHandler = (post: Post) => {
    setSelectedPost(post);
    updateViewsCount(post.id); // 'views' 카운트를 업데이트하는 함수 호출
  };

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
                <Link href={`/survey-it/${post.id}`} key={post.id}>
                  <div
                    className="h-64 border-2 border-[#e1e1e1] flex flex-col justify-between rounded-xl p-4 bg-white"
                    onClick={() => clickPostHandler(post)}
                  >
                    <div className="category-box flex justify-between items-center mb-4">
                      <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                        {post.category}
                      </div>
                      <button className="like-button w-[20px] h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                        <FaRegHeart />
                      </button>
                    </div>
                    <h3 className="font-semibold text-lg text-ellipsis overflow-hidden ">{post.title}</h3>
                    <div className="survey-method flex flex-col gap-2 bg-slate-100 h-[70px] p-2  ">
                      <div className="flex text-sm justify-start grid grid-cols-2 ">
                        <p>
                          <span className="text-[#666]">소요 시간</span> &nbsp; {post.researchTime}
                        </p>
                        <p>
                          <span className="text-[#666]">설문 방식</span> &nbsp; {post.researchType}
                        </p>
                      </div>
                      <div className="survey-method flex text-sm justify-start grid grid-cols-2">
                        <p>
                          <span className="text-[#666]">참여 연령</span> &nbsp; {post.ageGroup}
                        </p>
                        <p>
                          <span className="text-[#666]">참여 대상</span> &nbsp; {post.sexType}
                        </p>
                      </div>
                    </div>
                    <div className="border-t-1 border-[#eee] flex justify-between items-center p-2">
                      <div className="flex items-center w-full mt-4 justify-between">
                        <p className="flex items-center gap-2 text-sm text-[#666]">
                          <FaCalendarAlt />{' '}
                          <span className="text-[#0051FF]">
                            {post.createdAt.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}{' '}
                            ~ &nbsp;
                            {post.deadlineDate
                              ? post.deadlineDate.toDate
                                ? post.deadlineDate
                                    .toDate()
                                    .toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                                : '2099.12.31'
                              : '2099.12.31'}
                          </span>
                        </p>
                        <div className="viewer flex  gap-2 text-[#818490]">
                          <IoPeopleSharp />
                          {post.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          ) : (
            <div>등록된 게시글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
