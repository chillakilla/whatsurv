'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRef} from 'react';
import {GrView} from 'react-icons/gr';
import {Swiper, SwiperSlide} from 'swiper/react';
import {FaRegCircleUser} from 'react-icons/fa6';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function ItList() {
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

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">요즘 IT Surv</h2>
        <Link href={`/survey-it`} className="text-lg font-semibold text-[#0051FF]">
          더보기
        </Link>
      </div>
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
            <SwiperSlide id="it-slide" key={post.id}>
              <Link href={`/survey-it/${post.id}`}>
                <div className=" h-[180px] border-2 border-[#C1C5CC] rounded-xl p-4 bg-white">
                  <div className="category-box flex justify-between items-center mb-4">
                    <div className="bg-[#0051FF] text-[#D6FF00] w-14 p-1 text-center rounded-full font-semibold text-xs">
                      {post.category}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#666]">
                      마감일 |{' '}
                      {post.deadlineDate
                        ? post.deadlineDate.toDate
                          ? post.deadlineDate
                              .toDate()
                              .toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
                          : '2099.12.31'
                        : '2099.12.31'}
                    </p>
                    <div className="viewer flex  gap-2 text-[#818490]">
                      <GrView />
                      {post.views}
                    </div>
                  </div>
                  <h3 className="text-base font-bold">{post.title}</h3>
                  <div className="mt-4 border-t-1 border-[#eee]">
                    <div className="user-info flex items-center gap-4 mt-4">
                      <FaRegCircleUser />
                      <p>{post?.nickname}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
