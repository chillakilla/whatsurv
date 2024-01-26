'use client';

import Link from 'next/link';
import {useRef} from 'react';
import SwiperCore from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Navigation, Pagination} from 'swiper/modules';

export default function Banner() {
  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();

  return (
    <>
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="banner-swiper"
      >
        <SwiperSlide className="banner-slide">
          <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#D6FF00] via-black to-[#0051FF] ">
            <div className="relative z-1 flex flex-col justify-center items-center w-[500px] h-[400px] m-auto">
              <h1 className="leading-10 text-3xl mb-4 text-white">
                UT와 리서치 모객이 어려우신가요? <br />
                WhatSurv으로 초대합니다.
              </h1>
              <Link href="/auth">
                <button className="w-24 h-[35px] bg-[#0051FF] text-white rounded-lg hover:bg-white hover:text-black">
                  초대 수락
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#0051FF] via-black to-[#00a2ff] ">
            <div className="relative z-1 flex flex-col justify-center items-center w-[500px] h-[400px] m-auto">
              <h1 className="leading-10 text-3xl mb-4 text-white">
                피드백 수집할 땐? <br />
                WhatSurv
              </h1>
              <Link href="/auth">
                <button className="w-24 h-[35px] bg-[#0051FF] text-white rounded-lg hover:bg-white hover:text-black">
                  참여하기
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#00a2ff] via-black to-[#D6FF00] ">
            <div className="relative z-1 flex flex-col justify-center items-center w-[550px] h-[400px] m-auto">
              <h1 className=" text-3xl mb-4 text-white">WhatSurv에서 설문도 만들고 참여해보세요!</h1>
              <Link href="/survey-lite">
                <button className="w-24 h-[35px] bg-[#0051FF] text-white rounded-lg hover:bg-white hover:text-black">
                  참여하기
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
