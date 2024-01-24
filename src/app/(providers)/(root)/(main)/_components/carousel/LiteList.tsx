'use client';
import {litePost} from '@/app/api/typePost';
import {useState} from 'react';
import {getLiteSurveyPosts} from '@/app/api/firebaseApi';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRef} from 'react';
import {GrView} from 'react-icons/gr';
import {Swiper, SwiperSlide} from 'swiper/react';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '@/firebase';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function LiteList() {
  const [selectedPost, setSelectedPost] = useState<litePost | null>(null);

  const updateViewsCount = async (postId: string) => {
    try {
      const postRef = doc(db, 'litesurveyposts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;
        await updateDoc(postRef, {
          views: currentViews + 1, // 'views' 카운트 증가
        });
      } else {
        console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
      }
    } catch (error) {
      console.error('Views 카운트 업데이트 중 오류:', error);
    }
  };

  const onClickPosthandler = (litepost: litePost) => {
    setSelectedPost(litepost);
    updateViewsCount(litepost.id); // 'views' 카운트를 업데이트하는 함수 호출
  };

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
        <h2 className="text-xl font-bold">
          <span className="text-[#0051FF]">참여해</span> Surv?
        </h2>
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
                <a onClick={() => onClickPosthandler(litepost)}>
                  <div className=" h-[260px] border-2 border-[#e1e1e1] rounded-xl p-4 bg-white">
                    {litepost.images && litepost.images.length >= 2 ? (
                      <div className="flex gap-2">
                        <img src={litepost.images[0]} alt="post-img" className="w-40 h-28" />
                        <img src={litepost.images[1]} alt="post-img" className="w-40 h-28" />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="bg-[#0051ffb8] text-[#D6FF00] text-lg w-40 h-28 flex justify-center items-center">
                          WHAT SURV
                        </div>
                        <div className="bg-[#d4ff00bb] text-[#0051FF] text-lg w-40 h-28 flex justify-center items-center">
                          WHAT SURV
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-[#666]">
                        등록일 |{' '}
                        {litepost.createdAt
                          ? litepost.createdAt.toLocaleString('ko-KR', {
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
                </a>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
}
