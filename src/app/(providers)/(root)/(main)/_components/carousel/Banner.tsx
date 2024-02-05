'use client';
import Link from 'next/link';
import {useRef} from 'react';
import SwiperCore from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import {getAuth} from 'firebase/auth';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {Navigation, Pagination} from 'swiper/modules';
import {useRouter} from 'next/navigation';

export default function Banner() {
  const router = useRouter();
  const auth = getAuth();
  const currentUser = auth.currentUser?.uid;
  const bannerButton = () => {
    if (currentUser) {
      router.push('/survey-it');
    } else {
      router.push('/auth');
    }
  };

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
                환영합니다! <br />
                WhatSurv 이용 가이드
              </h1>
              <Link href="/guide">
                <button className="w-24 h-[35px] bg-[#0051FF] text-white rounded-lg hover:bg-white hover:text-black">
                  보러가기
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#0051FF] via-black to-[#00a2ff] ">
            <div className="relative z-1 flex flex-col justify-center items-center w-[500px] h-[400px] m-auto">
              <h1 className="leading-10 text-3xl mb-4 text-white">
                IT 설문조사가 필요하다면 <br />
                WhatSurv
              </h1>

              <button
                className="w-24 h-[35px] bg-[#0051FF] text-white rounded-lg hover:bg-white hover:text-black"
                onClick={bannerButton}
              >
                참여하기
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#00a2ff] via-black to-[#D6FF00] ">
            <div className="relative z-1 flex flex-col justify-center items-center w-[550px] h-[400px] m-auto">
              <h1 className=" text-3xl mb-4 text-white line-relaxed">
                오늘 점심 메뉴 고민된다면? <br />
                WhatSurv에서 고민 해결!
              </h1>
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
