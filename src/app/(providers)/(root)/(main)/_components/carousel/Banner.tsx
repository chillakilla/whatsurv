'use client';

import {useRef} from 'react';
import SwiperCore from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import Link from 'next/link';

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
          <div className="flex flex-col justify-center items-center  bg-gradient-to-r from-[#D6FF00]  via-black to-[#0051FF]">
            <div className="relative z-1 flex flex-col justify-center items-center w-[500px] h-[400px] m-auto">
              <h1 className="leading-10 text-3xl mb-4 text-white">
                UT와 리서치 모객이 어려우신가요? <br />
                WhatSurv으로 초대합니다.
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
          <img src="/image/img1.png" />
        </SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </>
  );
}
