'use client';
import {litePost} from '@/app/api/typePost';
import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRef} from 'react';
import {GrView} from 'react-icons/gr';
import {Swiper, SwiperSlide} from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function LiteList() {
  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();

  const {
    data: liteSurveyData,
    isLoading,
    isError,
    refetch,
  } = useQuery<litePost[]>({
    queryKey: ['surveyData'],
    queryFn: getLiteSurveyPosts,
  });

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">참여해 Surv?</h2>
        <Link href={`/survey-lite`} className="text-lg font-semibold">
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
        {liteSurveyData &&
          liteSurveyData.map(litepost => {
            return (
              <SwiperSlide id="it-slide" key={litepost.id}>
                <Link href={`/survey-it/${litepost.id}`}>
                  <div className=" h-[180px] border-2 border-[#0051FF80] rounded-xl p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#666]">
                        마감일 |{' '}
                        {litepost.deadlineDate
                          ? litepost.deadlineDate.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : '2099.12.31'}
                      </p>
                      <div className="viewer flex  gap-2 text-[#818490]">
                        <GrView />
                        {litepost.views}
                      </div>
                    </div>
                    <h3 className="text-base font-bold">{litepost.title}</h3>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
}
