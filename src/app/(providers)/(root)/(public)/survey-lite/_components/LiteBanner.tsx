'use client';

import {useRef} from 'react';
import SwiperCore from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Navigation, Pagination} from 'swiper/modules';

export default function LiteBanner() {
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
          <div>
            {' '}
            <img src="/image/001.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <img src="/image/002.png" />
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
