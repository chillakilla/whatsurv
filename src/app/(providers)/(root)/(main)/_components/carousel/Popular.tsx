'use client';

import {Swiper, SwiperSlide} from 'swiper/react';
import {useRef} from 'react';
import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {GrView} from 'react-icons/gr';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function Popular() {
  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();
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
  console.log(posts);
  return (
    <>
      <h2 className="text-xl font-bold">인기 서베이</h2>
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={4}
        spaceBetween={20}
        loop={true}
        pagination={{
          clickable: true,
          el: null,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="popular-swiper"
      >
        {posts.map(post => {
          return (
            <SwiperSlide className="popular-slide" key={post.id}>
              <Link href={`/survey-${post.category.toLowerCase()}/${post.id}`}>
                <div className=" h-[8.25rem] border-2 border-[#0051FF80] rounded-xl p-4 bg-white">
                  <div className="category-box flex justify-between items-center mb-4">
                    <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                      {post.category}
                    </div>
                    <div className="bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs">
                      🔥HOT
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#666]">
                      마감일 |{' '}
                      {post.deadlineDate
                        ? post.deadlineDate.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : '2099.12.31'}
                    </p>
                    <div className="viewer flex  gap-2 text-[#818490]">
                      <GrView />
                      {post.views}
                    </div>
                  </div>
                  <h3 className="text-base font-bold">{post.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
