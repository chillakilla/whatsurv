'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {GrView} from 'react-icons/gr';
import Tab from '../_components/Tab';
import FloatingBtn from './_components/FloatingBtn';
import Banner from './_components/carousel/Banner';
import Popular from './_components/carousel/Popular';
import SortingPost from './_components/post/SortingPost';

function Post({target}: {target: string}) {
  // firebase where로 다르게 가져오기 & query key 도 수정해야 할 듯
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  const hasPosts = posts.some(post => post.category === target);

  return (
    <div className="my-20">
      <div className="title-box flex-col items-center  mb-4">
        <div className="flex">
          {/* TODO: 바꾸기 => 완료*/}
          <h2 className="font-bold text-xl w-[140px] ">{target} 전체</h2>
        </div>
        <SortingPost />
      </div>
      <div className="post-container grid grid-cols-4 gap-4">
        {hasPosts ? (
          posts
            .filter(post => post.category === target)
            .slice(0, 4)
            .map(post => (
              <Link href={`/${post.id}`} key={post.id}>
                <div className="h-[215px] bg-white border-1 border-[#C1C5CC] flex-col justify-between rounded-md p-4">
                  <div className="top-content h-[90px]">
                    <div className="category-box flex justify-between items-center mb-4">
                      <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                        {post.category}
                      </div>
                      <button className="like-button w-12 h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent">
                        <FaRegHeart />
                      </button>
                    </div>
                    <p className="text-xs text-[#666] mb-4">
                      마감일 |{' '}
                      {post.deadlineDate
                        ? post.deadlineDate.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : '2099.12.31'}
                    </p>
                    <h3 className="text-base font-bold">{post.title}</h3>
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
              </Link>
            ))
        ) : (
          <div>등록된 게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default function MainPage() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState({
    name: searchParams.get('tab') || 'IT',
    to: '/', // ?
  });

  return (
    <div>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <Popular />
        {/* {renderContent()} */}
        {/* 1. 메인 페이지 -> 게시물 컴포넌트를 하나만 만들어서 재사용. */}
        <Post target={selectedTab.name} />
        <FloatingBtn />
      </div>
    </div>
  );
}

// 1. IT, Beauty, Medical 을 메인 페이지 & Lite는 다른 페이지로 만든다
// 2. PostIT, PostBeauty, PostMedi 를 하나의 컴포넌트로 만든다
// 3. Lite 클릭 시 /survey-lite 페이지로 이동한다. (같은 페이지의 경우 이동 X)
// 4. IT, Beauty, Medical 클릭 시 / 페이지로 이동한다. (같은 페이지의 경우 이동 X)
