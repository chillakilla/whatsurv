'use client';

import {useRef} from 'react';
import SwiperCore from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Navigation, Pagination} from 'swiper/modules';

export default function Popular() {
  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();
  return (
    <>
      <h2 className="text-xl font-bold">인기 서베이</h2>
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="popular-swiper"
      >
        <SwiperSlide className="popular-slide">Slide 1</SwiperSlide>
        <SwiperSlide className="popular-slide">Slide 2</SwiperSlide>
        <SwiperSlide className="popular-slide">Slide 3</SwiperSlide>
        <SwiperSlide className="popular-slide">Slide 1</SwiperSlide>
        <SwiperSlide className="popular-slide">Slide 2</SwiperSlide>
        <SwiperSlide className="popular-slide">Slide 3</SwiperSlide>
      </Swiper>
    </>
  );
}
