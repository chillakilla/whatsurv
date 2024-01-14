import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {useRef} from 'react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import {Pagination, Navigation} from 'swiper/modules';

export default function Popular() {
  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();
  return (
    <>
      <h2 className="text-xl font-bold">🔥HOT 포스트🔥</h2>
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
