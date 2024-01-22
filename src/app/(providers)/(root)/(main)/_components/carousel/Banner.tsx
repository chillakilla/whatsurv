'use client';

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
        <SwiperSlide>
          <img src="/image/img1.png" />
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </>
  );
}
